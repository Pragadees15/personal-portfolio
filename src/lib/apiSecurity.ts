import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site";

type RateLimitResult =
  | { ok: true; limit: number; remaining: number; reset: number }
  | { ok: false; limit: number; remaining: number; reset: number; retryAfterSeconds: number };

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // allow server-to-server / curl; rely on rate limits

  const allow = new Set<string>();
  const siteUrl = getSiteUrl();
  if (siteUrl) {
    try {
      allow.add(new URL(siteUrl).origin);
    } catch {
      // ignore
    }
  }

  // Dev defaults
  allow.add("http://localhost:3000");
  allow.add("http://127.0.0.1:3000");

  try {
    return allow.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

export function requireJson(req: NextRequest): boolean {
  const ct = req.headers.get("content-type") || "";
  return ct.toLowerCase().includes("application/json");
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip;
  return "0.0.0.0";
}

function nowMs(): number {
  return Date.now();
}

const memoryWindows = new Map<string, { resetAtMs: number; used: number }>();
let lastPruneAtMs = 0;

function pruneMemoryWindows(now: number) {
  // Prune at most once per ~30s, and keep the map bounded.
  if (now - lastPruneAtMs < 30_000) return;
  lastPruneAtMs = now;

  for (const [k, v] of memoryWindows) {
    if (v.resetAtMs <= now) memoryWindows.delete(k);
  }

  // Hard cap to avoid unbounded growth in long-lived processes.
  const HARD_CAP = 5000;
  if (memoryWindows.size <= HARD_CAP) return;

  // If still too large, remove earliest-reset entries first.
  const entries = Array.from(memoryWindows.entries());
  entries.sort((a, b) => a[1].resetAtMs - b[1].resetAtMs);
  const removeCount = memoryWindows.size - HARD_CAP;
  for (let i = 0; i < removeCount; i++) {
    memoryWindows.delete(entries[i]![0]);
  }
}

async function memoryRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const t = nowMs();
  pruneMemoryWindows(t);
  const entry = memoryWindows.get(key);
  if (!entry || entry.resetAtMs <= t) {
    const resetAtMs = t + windowMs;
    memoryWindows.set(key, { resetAtMs, used: 1 });
    return { ok: true, limit, remaining: limit - 1, reset: resetAtMs };
  }

  const used = entry.used + 1;
  entry.used = used;
  memoryWindows.set(key, entry);
  const remaining = Math.max(0, limit - used);
  const ok = used <= limit;
  const retryAfterSeconds = ok ? 0 : Math.max(1, Math.ceil((entry.resetAtMs - t) / 1000));
  return ok
    ? { ok: true, limit, remaining, reset: entry.resetAtMs }
    : { ok: false, limit, remaining, reset: entry.resetAtMs, retryAfterSeconds };
}

const upstash = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const redis = new Redis({ url, token });
    return { redis };
  } catch {
    return null;
  }
})();

const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(name: string, limit: number, windowSeconds: number): Ratelimit | null {
  if (!upstash) return null;
  const key = `${name}:${limit}:${windowSeconds}`;
  const existing = upstashLimiters.get(key);
  if (existing) return existing;
  const limiter = new Ratelimit({
    redis: upstash.redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: true,
    prefix: `rl:${name}`,
  });
  upstashLimiters.set(key, limiter);
  return limiter;
}

export async function rateLimit(req: NextRequest, opts: { name: string; limit: number; windowMs: number }): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent") || "";
  const key = `${opts.name}:${ip}:${ua.slice(0, 40)}`;

  const windowSeconds = Math.max(1, Math.round(opts.windowMs / 1000));
  const limiter = getUpstashLimiter(opts.name, opts.limit, windowSeconds);
  if (limiter) {
    const r = await limiter.limit(key);
    const resetMs = typeof r.reset === "number" ? r.reset : nowMs() + opts.windowMs;
    if (r.success) {
      return { ok: true, limit: opts.limit, remaining: r.remaining, reset: resetMs };
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - nowMs()) / 1000));
    return { ok: false, limit: opts.limit, remaining: r.remaining, reset: resetMs, retryAfterSeconds };
  }

  return memoryRateLimit(key, opts.limit, opts.windowMs);
}

export function noStoreJsonHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    "content-type": "application/json",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...(extra ?? {}),
  };
}

export function asRetryAfterHeaders(retryAfterSeconds: number): Record<string, string> {
  return {
    "retry-after": String(retryAfterSeconds),
  };
}
