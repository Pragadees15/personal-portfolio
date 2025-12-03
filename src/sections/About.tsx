"use client";

import Image from "next/image";
import { Mail, MapPin, Briefcase, GraduationCap, Download } from "lucide-react";
import { profile, projects, education, researchInterests } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { GsapReveal } from "@/components/GsapReveal";
import { SectionHeading } from "@/components/SectionHeading";

type AboutProps = {
  avatarUrl: string;
};

export function About({ avatarUrl }: AboutProps) {
  const projectCount = projects?.length ?? 0;
  // Prefer CGPA parsed from education meta; fallback to summary
  const eduCgpaMatch = education?.[0]?.meta?.match(/CGPA\s*([0-9.]+)/i);
  const summaryCgpaMatch = profile.summary.match(/CGPA\s*([0-9.]+)/i);
  const cgpaValue = (eduCgpaMatch?.[1] || summaryCgpaMatch?.[1]) as string | undefined;
  const shortSummary =
    "AI/ML engineer focused on shipping usable ML — vision and RL — with efficient, reproducible pipelines.";
  const topInterests = (researchInterests ?? []).slice(0, 3);
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
    <section id="about" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <div className="">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
          <SectionHeading subtitle="Profile & focus">About</SectionHeading>

          <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 md:grid-cols-[.9fr_1.1fr]">
            {/* Left: Avatar + quick facts (GSAP reveal) */}
            <GsapReveal>
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-[2px] rounded-[0.9rem] bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/40 to-cyan-500/40 flex-shrink-0">
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-zinc-900/40">
                      <Image
                        src={avatarUrl}
                        alt={profile.name}
                        fill
                        quality={100}
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">{profile.name}</div>
                    {profile.role && (
                      <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                        <Briefcase className="h-3.5 w-3.5" /> {profile.role}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-white/10" />

                <div className="mt-4 sm:mt-5 grid gap-2.5 sm:gap-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                  {profile.location && (
                    <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-zinc-900/40">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {cgpaValue && (
                    <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-zinc-900/40">
                      <GraduationCap className="h-4 w-4" />
                      <span>CGPA {cgpaValue}/10</span>
                    </div>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-md border border-indigo-200/70 bg-white/70 px-2 py-1 text-indigo-700 hover:border-indigo-300 hover:bg-white/90 dark:border-indigo-500/20 dark:bg-zinc-900/40 dark:text-indigo-300">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                </div>
                {Array.isArray(profile.links) && profile.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {profile.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-md border-2 border-zinc-200/70 bg-white/70 px-2.5 py-1 text-zinc-700 transition hover:border-indigo-300 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-indigo-600/40"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </GsapReveal>

            {/* Right: Summary + highlights + actions */}
            <div>
              <GsapReveal delay={0.05}>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500" />
                <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-xl">{shortSummary}</p>
              </GsapReveal>
              <GsapReveal delay={0.07} stagger={0.05}>
                <div className="mt-4">
                  <div className="text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">Highlights</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full p-[1px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-cyan-500/40">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-900/60 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Open‑source contributor (DX & docs)
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full p-[1px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-cyan-500/40">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-900/60 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                        {projectCount}+ projects in ML/CV/RL
                      </span>
                    </span>
                  </div>
                </div>
              </GsapReveal>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-white/10" />
              {topInterests.length > 0 && (
                <Reveal delay={0.08}>
                  <div className="mt-5">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">Focus areas</div>
                    <div className="flex flex-wrap gap-2">
                      {topInterests.map((it, idx) => (
                        <span key={it} className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-zinc-900/50 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 ring-1 ring-inset ring-zinc-200/70 dark:ring-white/10">
                          <span className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-cyan-500" : idx === 1 ? "bg-indigo-500" : "bg-fuchsia-500"}`} />
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.09}>
                <div className="mt-5 rounded-xl border border-zinc-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">{projectCount}+</span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">Projects</span>
                    </div>
                    <div className="h-4 w-px bg-zinc-300/70 dark:bg-white/10" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">{cgpaValue ?? "9.3"}</span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">CGPA</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              {/* Removed duplicate location/role chips under summary to reduce clutter */}
              <Reveal delay={0.1}>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="button-shine inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300/60">
                      <Mail className="h-4 w-4" /> Email Me
                    </a>
                  )}
                  <a href="#projects" className="inline-flex items-center gap-2 rounded-md border-2 border-zinc-200/70 bg-white/70 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-indigo-300 hover:bg-white/90 focus:ring-2 focus:ring-indigo-300/40 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-indigo-600/40">
                    View Projects
                  </a>
                  <button onClick={downloadVCard} className="inline-flex items-center gap-2 rounded-md border-2 border-zinc-200/70 bg-white/70 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-indigo-300 hover:bg-white/90 focus:ring-2 focus:ring-indigo-300/40 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-indigo-600/40">
                    <Download className="h-4 w-4" /> Download vCard
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


