import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { asRetryAfterHeaders, isAllowedOrigin, noStoreJsonHeaders, rateLimit, requireJson } from "@/lib/apiSecurity";

const schema = z.object({
  tag: z.enum(["projects"]),
});

export async function POST(req: NextRequest) {
  if (!requireJson(req)) {
    return new NextResponse(JSON.stringify({ error: "Content-Type must be application/json" }), {
      status: 415,
      headers: noStoreJsonHeaders(),
    });
  }

  if (!isAllowedOrigin(req)) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: noStoreJsonHeaders(),
    });
  }

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse(JSON.stringify({ error: "Revalidation is not configured" }), {
      status: 501,
      headers: noStoreJsonHeaders(),
    });
  }

  const provided =
    req.headers.get("x-revalidate-secret") ||
    new URL(req.url).searchParams.get("secret") ||
    "";
  if (provided !== secret) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: noStoreJsonHeaders(),
    });
  }

  const rl = await rateLimit(req, { name: "revalidate", limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: noStoreJsonHeaders(asRetryAfterHeaders(rl.retryAfterSeconds)),
    });
  }

  try {
    const { tag } = schema.parse(await req.json());
    revalidateTag(tag, "page");
    return new NextResponse(JSON.stringify({ ok: true, tag }), {
      status: 200,
      headers: noStoreJsonHeaders(),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: "Invalid payload", issues: err.issues }), {
        status: 400,
        headers: noStoreJsonHeaders(),
      });
    }
    return new NextResponse(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: noStoreJsonHeaders(),
    });
  }
}

