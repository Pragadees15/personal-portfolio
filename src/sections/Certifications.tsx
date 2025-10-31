"use client";

import { Award, BadgeCheck } from "lucide-react";
import { certifications } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useMemo, useState } from "react";

export function Certifications() {
  type Cat = "All" | "AWS" | "Oracle" | "NPTEL" | "Hackathon" | "Other";
  const [cat, setCat] = useState<Cat>("All");

  function categoryOf(title: string): Cat {
    const t = title.toLowerCase();
    if (t.includes("aws")) return "AWS";
    if (t.includes("oracle")) return "Oracle";
    if (t.includes("nptel")) return "NPTEL";
    if (t.includes("hackathon") || t.includes("hack")) return "Hackathon";
    return "Other";
  }

  const withCat = useMemo(() => certifications.map((c) => ({ ...c, _cat: categoryOf(c.title) })), []);
  const cats: Cat[] = ["All", "AWS", "Oracle", "NPTEL", "Hackathon", "Other"];
  const filtered = useMemo(() => (cat === "All" ? withCat : withCat.filter((c: any) => c._cat === cat)), [cat, withCat]);

  // Minimal style: neutral surfaces, no emojis/gradients
  return (
    <section id="certifications" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Relevant certifications and training">Certifications</SectionHeading>
      <div className="mb-4 flex flex-wrap gap-2">
        {cats.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={("rounded-full border px-3 py-1 text-xs transition " + (active
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-200"
                : "border-zinc-200/70 bg-white/60 text-zinc-700 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"))}
              aria-pressed={active}
            >
              {c}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-zinc-600 dark:text-zinc-400">{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
      </div>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c: any, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <div className="">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition will-change-transform hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg border border-zinc-200/70 bg-white/60 p-2 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                    {c._cat === "NPTEL" ? (
                      <BadgeCheck className="h-4 w-4" />
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{c.title}</div>
                    {c.issuer && (
                      <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{c.issuer}</div>
                    )}
                    <div className="mt-2 text-[10px]">
                      <span className="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{c._cat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


