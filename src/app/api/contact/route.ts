import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const website = String(body?.website ?? ""); // honeypot
    const elapsedMs = Number(body?.elapsedMs ?? 0);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Basic validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Simple spam checks: honeypot and minimal dwell time
    if (website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }
    if (Number.isFinite(elapsedMs) && elapsedMs < 2000) {
      return NextResponse.json({ error: "Too fast. Please try again." }, { status: 400 });
    }

    const toEmail = process.env.FORMSUBMIT_EMAIL || "pragadees1323@gmail.com";
    const ajaxEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`;
    const formEndpoint = `https://formsubmit.co/${encodeURIComponent(toEmail)}`;
    const subject = `New contact from ${name}`;

    const bodyParams = new URLSearchParams();
    bodyParams.set("name", name);
    bodyParams.set("email", email);
    bodyParams.set("message", message);
    bodyParams.set("_subject", subject);
    bodyParams.set("_replyto", email);
    bodyParams.set("_captcha", "false");
    bodyParams.set("_template", "table");
    // Optional: pass through a honeypot field compatible with FormSubmit
    bodyParams.set("_honey", website);

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
    const resp = await fetch(ajaxEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Origin: origin,
        Referer: origin,
      },
      body: bodyParams.toString(),
      redirect: "manual",
    });

    // Parse JSON if available for clearer diagnostics
    let payload: any = null;
    try { payload = await resp.json(); } catch {}

    if (resp.ok) {
      // Expected: { success: "true", message: "..." }
      return NextResponse.json({ ok: true, provider: "formsubmit", response: payload ?? null });
    }

    let detail = payload ? JSON.stringify(payload) : await resp.text().catch(() => "");
    if (detail && typeof detail === "string" && detail.includes("browsed as HTML files")) {
      // Fallback to non-AJAX endpoint which tolerates server-to-server and returns redirects
      const resp2 = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: origin,
          Referer: origin,
        },
        body: bodyParams.toString(),
        redirect: "manual",
      });
      if (resp2.ok || (resp2.status >= 300 && resp2.status < 400)) {
        return NextResponse.json({ ok: true, provider: "formsubmit", mode: "fallback" });
      }
      const text2 = await resp2.text().catch(() => "");
      return NextResponse.json({ error: `FormSubmit failed (${resp2.status})`, detail: text2.slice(0, 800) }, { status: 502 });
    }

    return NextResponse.json({ error: `FormSubmit failed (${resp.status})`, detail: (detail || "").slice(0, 800) }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}


