import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asRetryAfterHeaders, getClientIp, isAllowedOrigin, noStoreJsonHeaders, rateLimit, requireJson, verifyTurnstile } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  try {
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

    const rl = await rateLimit(req, { name: "contact", limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: noStoreJsonHeaders(asRetryAfterHeaders(rl.retryAfterSeconds)),
      });
    }

    const schema = z.object({
      name: z.string().trim().min(1, "Missing name").max(120, "Name too long"),
      email: z.string().trim().email("Invalid email").max(254, "Email too long"),
      message: z.string().trim().min(1, "Missing message").max(4000, "Message too long"),
      website: z.string().optional().default(""),
      elapsedMs: z.coerce.number().optional(),
      turnstileToken: z.string().optional(),
    });

    const body = schema.parse(await req.json());
    const { name, email, message } = body;
    const website = body.website; // honeypot
    const elapsedMs = body.elapsedMs ?? 0;
    const turnstileToken = body.turnstileToken ?? "";

    if (!name || !email || !message) {
      return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: noStoreJsonHeaders(),
      });
    }

    // Simple spam checks: honeypot and minimal dwell time
    if (website) {
      return new NextResponse(JSON.stringify({ error: "Spam detected" }), {
        status: 400,
        headers: noStoreJsonHeaders(),
      });
    }
    if (Number.isFinite(elapsedMs) && elapsedMs < 2000) {
      return new NextResponse(JSON.stringify({ error: "Too fast. Please try again." }), {
        status: 400,
        headers: noStoreJsonHeaders(),
      });
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      const ok = await verifyTurnstile({ token: turnstileToken, ip: getClientIp(req) });
      if (!ok) {
        return new NextResponse(JSON.stringify({ error: "Bot check failed" }), {
          status: 400,
          headers: noStoreJsonHeaders(),
        });
      }
    }

    const toEmail = process.env.FORMSUBMIT_EMAIL;
    if (!toEmail) {
      return new NextResponse(JSON.stringify({ error: "Contact is not configured" }), {
        status: 501,
        headers: noStoreJsonHeaders(),
      });
    }
    // Use the standard FormSubmit endpoint as per current documentation
    // https://formsubmit.co (HTML-style form post)
    const submitEndpoint = `https://formsubmit.co/${encodeURIComponent(toEmail)}`;
    const subject = `New contact from ${name}`;

    const bodyParams = new URLSearchParams();
    bodyParams.set("name", name);
    bodyParams.set("email", email);
    bodyParams.set("message", message);
    bodyParams.set("_subject", subject);
    bodyParams.set("_replyto", email);
    bodyParams.set("_template", "table");
    // Optional: pass through a honeypot field compatible with FormSubmit
    bodyParams.set("_honey", website);

    const resp = await fetch(submitEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
      signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout(12_000) : undefined,
    });

    // FormSubmit often responds with a redirect (302/303) on success.
    // Treat any 2xx or 3xx response as a successful submission.
    if (resp.ok || (resp.status >= 300 && resp.status < 400)) {
      return new NextResponse(JSON.stringify({ ok: true }), {
        status: 200,
        headers: noStoreJsonHeaders(),
      });
    }

    console.error("[contact] provider error", resp.status);
    return new NextResponse(JSON.stringify({ error: "Contact submission failed" }), {
      status: 502,
      headers: noStoreJsonHeaders(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: "Invalid payload", issues: error.issues }), {
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


