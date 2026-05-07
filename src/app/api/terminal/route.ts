import { NextRequest } from "next/server";
import * as Resume from "@/data/resume";
import * as Site from "@/data/profile";
import { asRetryAfterHeaders, isAllowedOrigin, noStoreJsonHeaders, rateLimit, requireJson } from "@/lib/apiSecurity";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.TERMINAL_API_KEY;
  const origin = req.headers.get("origin");

  // In development, allow calls without a secret to make local testing easy.
  if (process.env.NODE_ENV !== "production" && !secret) {
    return true;
  }

  // For browser calls from an allowed origin, rely on the origin gate + rate limit.
  // Do NOT require a shared secret from client-side code (it would be public).
  if (origin) {
    return true;
  }

  if (!secret) {
    return false;
  }

  const provided = req.headers.get("x-terminal-api-key");
  return provided === secret;
}

export async function POST(req: NextRequest) {
  try {
    if (!requireJson(req)) {
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
        status: 415,
        headers: noStoreJsonHeaders(),
      });
    }

    if (!isAllowedOrigin(req)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: noStoreJsonHeaders(),
      });
    }

    if (!isAuthorized(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: noStoreJsonHeaders(),
      });
    }

    const rl = await rateLimit(req, { name: "terminal", limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: noStoreJsonHeaders(asRetryAfterHeaders(rl.retryAfterSeconds)),
      });
    }

    const { prompt } = (await req.json()) as { prompt?: string };
    const normalizedPrompt = typeof prompt === "string" ? prompt.trim() : "";
    if (!normalizedPrompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400,
        headers: noStoreJsonHeaders(),
      });
    }
    if (normalizedPrompt.length > 600) {
      return new Response(JSON.stringify({ error: "Prompt too long" }), {
        status: 413,
        headers: noStoreJsonHeaders(),
      });
    }

    if (!process.env.GROQ_API_KEY) {
      const msg = [
        "Groq is not configured.",
        "Set GROQ_API_KEY in your environment.",
        "Optional: GROQ_MODEL (default: llama-3.1-8b-instant)",
      ].join("\n");
      return new Response(JSON.stringify({ error: msg }), {
        status: 501,
        headers: noStoreJsonHeaders(),
      });
    }

    let answer = "";

    // Build concise portfolio context for grounded answers
    const contextParts: string[] = [];
    try {
      const name = Resume.profile?.name || Site.profile?.name;
      const title = Resume.profile?.role || Site.profile?.title;
      const summary = Resume.profile?.summary || Site.profile?.summary;
      const email = Resume.profile?.email || Site.profile?.email;
      const github = Resume.profile?.github || Site.profile?.github;
      const linkedin = Resume.profile?.linkedin || Site.profile?.linkedin;
      const resumeSkills = Array.isArray(Resume.skillsGrouped?.languages)
        ? [
          ...(Resume.skillsGrouped.languages ?? []),
          ...(Resume.skillsGrouped.aiMl ?? []),
          ...(Resume.skillsGrouped.web ?? []),
        ]
        : [];
      const fallbackSkills = Array.isArray(Site.skills) ? Site.skills : [];
      const skills = resumeSkills.length ? resumeSkills : fallbackSkills;
      const projects = (Resume.projects || []).map((p) => p.title).slice(0, 6);
      const expTitles = (Resume.experiences || []).map((e) => `${e.title} @ ${e.org}`).slice(0, 5);
      const edu = (Resume.education || []).map((e) => `${e.degree} — ${e.institution}`).slice(0, 3);

      contextParts.push(`Name: ${name}`);
      if (title) contextParts.push(`Title: ${title}`);
      if (summary) contextParts.push(`Summary: ${summary}`);
      contextParts.push(`Contact: email ${email}, GitHub ${github}, LinkedIn ${linkedin}`);
      if (skills?.length) contextParts.push(`Skills: ${skills.slice(0, 20).join(", ")}`);
      if (projects?.length) contextParts.push(`Projects: ${projects.join("; ")}`);
      if (expTitles?.length) contextParts.push(`Experience: ${expTitles.join("; ")}`);
      if (edu?.length) contextParts.push(`Education: ${edu.join("; ")}`);
    } catch { }

    const portfolioContext = contextParts.join("\n");

    {
      const apiKey = process.env.GROQ_API_KEY as string;
      const systemPrompt =
        "You are the terminal assistant for Pragadeeswaran's portfolio site. Answer ONLY questions about this portfolio (skills, projects, experience, education, contact). If the user asks unrelated questions, briefly say you only answer about the portfolio and invite a related question. Keep answers concise (1–4 sentences). Use the provided context faithfully.";
      type ChatMessage = { role: "system" | "user"; content: string };
      const messages = (
        [
          { role: "system", content: systemPrompt },
          portfolioContext ? { role: "system", content: `Portfolio context:\n${portfolioContext}` } : null,
          { role: "user", content: normalizedPrompt },
        ].filter(Boolean) as ChatMessage[]
      );

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
          messages,
          temperature: 0.5,
          stream: false,
        }),
        signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout(12_000) : undefined,
      });
      if (!res.ok) {
        console.error("[terminal] Groq API error", res.status);
        throw new Error("Upstream AI provider error");
      }
      type GroqResponse = {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const data = (await res.json()) as GroqResponse;
      const raw = data.choices?.[0]?.message?.content;
      answer = typeof raw === "string" ? raw.trim() : "";
    }

    return new Response(
      JSON.stringify({ reply: answer || "(no response)" }),
      { headers: noStoreJsonHeaders() }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message === "Upstream AI provider error" ? "Service unavailable" : message }), {
      status: message === "Upstream AI provider error" ? 503 : 500,
      headers: noStoreJsonHeaders(),
    });
  }
}


