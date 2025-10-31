import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || "Portfolio <noreply@example.com>";
    const to = process.env.RESEND_TO || "pragadees1323@gmail.com";

    if (!apiKey) {
      // Soft-success in dev if not configured
      return NextResponse.json({ ok: true, note: "Email provider not configured" });
    }

    const resend = new Resend(apiKey);
    const subject = `New contact from ${name}`;

    await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.6;color:#0a0a0a;background:#ffffff;padding:16px;">
        <h2 style="margin:0 0 12px 0;">${subject}</h2>
        <p style="margin:0 0 8px 0;"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:12px;">${escapeHtml(message)}</div>
      </body></html>`
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


