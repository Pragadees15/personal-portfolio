"use client";

import { useMemo, useState } from "react";
import { profile as resumeProfile, researchInterests, education, certifications, skillsGrouped, projects, experiences, honors, leadership } from "@/data/resume";
import { profile as basicProfile } from "@/data/profile";

type Passage = {
  id: string;
  title: string;
  text: string;
  href?: string;
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function scoreQueryAgainstPassage(query: string, passage: Passage): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const textTokens = tokenize(passage.text);
  if (textTokens.length === 0) return 0;

  const textSet = new Set(textTokens);
  let overlap = 0;
  for (const tok of queryTokens) {
    if (textSet.has(tok)) overlap += 1;
  }

  // Bigram bonus for slightly more semantic feel
  let bigramBonus = 0;
  for (let i = 0; i < queryTokens.length - 1; i++) {
    const a = queryTokens[i];
    const b = queryTokens[i + 1];
    for (let j = 0; j < textTokens.length - 1; j++) {
      if (textTokens[j] === a && textTokens[j + 1] === b) {
        bigramBonus += 1.5;
        break;
      }
    }
  }

  // Length normalization
  const normalization = Math.log(1 + textTokens.length);
  return (overlap + bigramBonus) / normalization;
}

function buildPassages(): Passage[] {
  const items: Passage[] = [];

  items.push({
    id: "summary",
    title: "Summary",
    text: resumeProfile.summary ?? "",
  });

  for (const topic of researchInterests) {
    items.push({ id: `interest-${topic}`, title: `Research Interest: ${topic}`, text: topic });
  }

  for (const edu of education) {
    items.push({
      id: `edu-${edu.institution}`,
      title: `Education: ${edu.degree}`,
      text: `${edu.degree} at ${edu.institution}. ${edu.location ?? ""} ${edu.meta ?? ""}`.trim(),
    });
  }

  for (const cert of certifications) {
    const t = [cert.title, cert.issuer].filter(Boolean).join(" — ");
    items.push({ id: `cert-${cert.title}`, title: `Certification`, text: t });
  }

  const skillGroups = Object.entries(skillsGrouped);
  for (const [group, skills] of skillGroups) {
    items.push({ id: `skills-${group}`, title: `Skills: ${group}`, text: skills.join(", ") });
  }

  for (const proj of projects) {
    items.push({
      id: `proj-${proj.title}`,
      title: `Project: ${proj.title}`,
      text: `${proj.title}. Stack: ${proj.stack.join(", ")}. ${proj.bullets.join(" ")}`,
      href: proj.repo ?? proj.demo,
    });
  }

  for (const exp of experiences) {
    items.push({
      id: `exp-${exp.title}-${exp.org}`,
      title: `Experience: ${exp.title} @ ${exp.org}`,
      text: `${exp.title} at ${exp.org}. ${[exp.location, exp.start, exp.end].filter(Boolean).join(" • ")}. ${exp.bullets.join(" ")}`,
    });
  }

  for (const h of honors) {
    items.push({ id: `honor-${h}`, title: "Honor/Recognition", text: h });
  }

  for (const lead of leadership) {
    items.push({ id: `lead-${lead}`, title: "Leadership", text: lead });
  }

  // Contact/profile facts
  items.push({ id: "contact-email", title: "Contact", text: `Email: ${resumeProfile.email}` });
  items.push({ id: "contact-github", title: "GitHub", text: `GitHub: ${resumeProfile.github}` });
  items.push({ id: "contact-linkedin", title: "LinkedIn", text: `LinkedIn: ${resumeProfile.linkedin}` });
  items.push({ id: "location", title: "Location", text: basicProfile.location });

  return items;
}

export function AskMeAnything() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const passages = useMemo(() => buildPassages(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [] as Passage[];
    const scored = passages
      .map((p) => ({ p, s: scoreQueryAgainstPassage(query, p) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map(({ p }) => p);
    return scored;
  }, [query, passages]);

  const suggestions = [
    "What ML areas are you focused on?",
    "Show your top projects",
    "What tools and stacks do you use?",
    "Tell me about your education",
    "Any honors or certifications?",
  ];

  return (
    <div className="mt-6">
      <div className="rounded-xl border border-zinc-200/70 bg-white/60 shadow-sm ring-1 ring-black/5 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
        <div className="p-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ask me anything</label>
          <div className={`mt-2 rounded-lg border ${focused ? "border-indigo-400" : "border-zinc-200 dark:border-white/10"} bg-white/70 px-3 py-2 shadow-sm transition-colors dark:bg-zinc-900/60`}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. What projects use PyTorch?"
              className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 outline-none dark:text-zinc-100"
            />
          </div>

          {!query && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {query && (
          <div className="border-t border-zinc-200/70 p-4 dark:border-white/10">
            {results.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No direct matches. Try different wording.</p>
            ) : (
              <ul className="space-y-3">
                {results.map((r) => (
                  <li key={r.id} className="rounded-lg border border-zinc-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-900/60">
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{r.title}</div>
                    <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{r.text}</div>
                    {r.href && (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-300"
                      >
                        View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AskMeAnything;


