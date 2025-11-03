import { NextRequest } from "next/server";
import * as Resume from "@/data/resume";
import * as Site from "@/data/profile";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400,
        headers: { "content-type": "application/json" },
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
        headers: { "content-type": "application/json" },
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
      const skills = Array.isArray(Resume.skillsGrouped?.languages)
        ? [
            ...(Resume.skillsGrouped.languages || []),
            ...(Resume.skillsGrouped.aiMl || []),
            ...(Resume.skillsGrouped.web || []),
          ]
        : (Site.skills as any as string[]) || [];
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
    } catch {}

    const portfolioContext = contextParts.join("\n");

    {
      const apiKey = process.env.GROQ_API_KEY as string;
      const systemPrompt =
        "You are the terminal assistant for Pragadeeswaran's portfolio site. Answer ONLY questions about this portfolio (skills, projects, experience, education, contact). If the user asks unrelated questions, briefly say you only answer about the portfolio and invite a related question. Keep answers concise (1–4 sentences). Use the provided context faithfully.";
      const messages = (
        [
          { role: "system", content: systemPrompt },
          portfolioContext ? { role: "system", content: `Portfolio context:\n${portfolioContext}` } : null,
          { role: "user", content: prompt },
        ].filter(Boolean) as { role: string; content: string }[]
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
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Groq API error: ${res.status} ${text}`);
      }
      const data = (await res.json()) as any;
      answer = data.choices?.[0]?.message?.content?.trim?.() ?? "";
    }

    return new Response(
      JSON.stringify({ reply: answer || "(no response)" }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    const message = err?.message || "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}


