"use client";

import Image from "next/image";
import { Mail, MapPin, Briefcase, GraduationCap, Download } from "lucide-react";
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

          <div className="mt-6 grid gap-6 md:grid-cols-[.9fr_1.1fr]">
            {/* Left: Avatar + quick facts */}
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/60 p-5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                    <Image
                      src={`https://github.com/Pragadees15.png?size=160`}
                      alt={profile.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{profile.name}</div>
                    {profile.role && (
                      <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                        <Briefcase className="h-3.5 w-3.5" /> {profile.role}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {profile.location && (
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {/* Highlight CGPA if present in summary */}
                  {profile.summary?.includes("CGPA") && (
                    <div className="inline-flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profile.summary.match(/CGPA[^).]*/)?.[0] ?? "Academic details"}</span>
                    </div>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-indigo-700 hover:underline dark:text-indigo-300">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Right: Summary + actions */}
            <div>
              <Reveal delay={0.05}>
                <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">{profile.summary}</p>
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
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={downloadVCard} className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                    <Download className="h-4 w-4" /> Download vCard
                  </button>
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                      <Mail className="h-4 w-4" /> Email Me
                    </a>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6">
                  <AskMeAnything />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


