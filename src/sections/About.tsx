"use client";

import { profile } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import AskMeAnything from "@/components/AskMeAnything";

export function About() {
  function downloadVCard() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      `TITLE:${profile.role}`,
      profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
      profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
      profile.linkedin ? `URL:${profile.linkedin}` : "",
      profile.github ? `URL:${profile.github}` : "",
      "END:VCARD",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pragadeeswaran.vcf";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section id="about" className="site-container py-20 scroll-mt-24">
      <div className="">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
          <SectionHeading subtitle="Who I am in a few lines">About</SectionHeading>
        <Reveal delay={0.05}>
          <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">{profile.summary}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {profile.location && (
              <span className="rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{profile.location}</span>
            )}
            {profile.role && (
              <span className="rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{profile.role}</span>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={downloadVCard} className="rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">Download vCard</button>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">Email Me</a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <AskMeAnything />
        </Reveal>
        </div>
      </div>
    </section>
  );
}


