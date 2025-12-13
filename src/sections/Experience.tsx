"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { experiences } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";
import { useState } from "react";

type LogoCandidate = { src: string; alt: string };

function getOrgLogoCandidates(title: string, org: string): LogoCandidate[] {
  const titleLower = title.toLowerCase();
  const orgLower = org.toLowerCase();

  // Check title first for specific roles
  if (titleLower.includes("internship") || titleLower.includes("virtual program") || titleLower.includes("internships") || titleLower.includes("virtual programs")) {
    return [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" },
    ];
  }
  if (titleLower.includes("ai/ml student researcher") || (titleLower.includes("ai/ml") && titleLower.includes("researcher"))) {
    return [
      { src: "/logos/SRM.png", alt: "SRM Institute of Science and Technology" },
    ];
  }
  if (titleLower.includes("embedded firmware engineer")) {
    return [
      { src: "/logos/Protechme.png", alt: "Protechme" },
    ];
  }

  // Then check org
  if (orgLower.includes("srm")) return [
    { src: "/logos/SRM.png", alt: "SRM Institute of Science and Technology" },
  ];
  if (orgLower.includes("protechme")) return [
    { src: "/logos/Protechme.png", alt: "Protechme" },
  ];
  if (orgLower.includes("independent") || orgLower.includes("open source") || orgLower.includes("open-source")) return [
    { src: "https://cdn.simpleicons.org/github", alt: "GitHub" },
    { src: "https://cdn.simpleicons.org/git", alt: "Git" },
  ];
  if (orgLower.includes("aicte")) return [
    { src: "https://logo.clearbit.com/aicte-india.org", alt: "AICTE" },
  ];
  if (orgLower.includes("android")) return [
    { src: "https://logo.clearbit.com/android.com", alt: "Android" },
    { src: "https://cdn.simpleicons.org/android", alt: "Android" },
  ];
  if (orgLower.includes("altair")) return [
    { src: "https://logo.clearbit.com/altair.com", alt: "ALTAIR" },
  ];
  return [
    { src: "https://cdn.simpleicons.org/briefcase", alt: org },
  ];
}

function OrgLogo({ title, org, size = 40 }: { title: string; org: string; size?: number }) {
  const candidates = getOrgLogoCandidates(title, org);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const boxStyle = { width: size, height: size } as React.CSSProperties;

  if (exhausted) {
    return (
      <div
        className="flex-none flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
        style={boxStyle}
        aria-label={org}
      >
        <span className="text-[11px] leading-none select-none">
          {org.split(" ").map((w) => w[0]).join("").slice(0, 3)}
        </span>
      </div>
    );
  }

  const { src, alt } = candidates[index];

  // AWS logo using mask (SVG icon) - matches Honors section pattern
  if (src.includes("cdn.jsdelivr.net/npm/simple-icons@latest")) {
    const slug = src.split("/").pop()?.replace(".svg", "") ?? "";
    const color = slug === "amazonaws" ? "#FF9900" : "#6b7280";
    return (
      <div
        className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden flex items-center justify-center"
        style={boxStyle}
      >
        <span
          role="img"
          aria-label={alt}
          className="block"
          style={{
            width: `${size * 0.85}px`,
            height: `${size * 0.85}px`,
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            backgroundColor: color,
          }}
        />
      </div>
    );
  }

  // Theme-adaptive GitHub icon: black in light, white in dark
  if (src.includes("simpleicons.org/github")) {
    return (
      <div
        className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden"
        style={boxStyle}
        aria-label={alt}
      >
        <Image
          src="https://cdn.simpleicons.org/github/000000"
          alt={alt}
          className="w-full h-full object-contain select-none dark:hidden"
          loading="lazy"
          decoding="async"
          width={size}
          height={size}
          unoptimized
        />
        <Image
          src="https://cdn.simpleicons.org/github/ffffff"
          alt={alt}
          className="w-full h-full object-contain select-none hidden dark:block"
          loading="lazy"
          decoding="async"
          width={size}
          height={size}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden"
      style={boxStyle}
    >
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1); else setExhausted(true);
        }}
        className="w-full h-full object-contain select-none"
        width={size}
        height={size}
        unoptimized
      />
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Roles and impact">Experience</SectionHeading>
      {experiences.length === 0 ? (
        <div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No experience to display.</div>
      ) : (
        <div className="relative grid gap-5 sm:gap-6 pl-6 md:pl-8">
          {/* timeline spine */}
          <span aria-hidden className="pointer-events-none absolute left-2 top-0 h-full w-px bg-zinc-200 dark:bg-white/10" />
          {experiences.map((x, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="relative pl-4 md:pl-6">
                {/* timeline node */}
                <span aria-hidden className="absolute -left-[22px] top-5 h-3 w-3 rounded-full bg-zinc-400 ring-2 ring-white/80 shadow dark:bg-white/30 dark:ring-zinc-900/80" />
                <div className="">
                  <Card className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30">
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-none">
                          <OrgLogo title={x.title} org={x.org} size={40} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{x.title}</CardTitle>
                          <div className="mt-1.5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">{x.org}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {x.location && (
                              <span className="inline-flex items-center gap-1 rounded-full border-2 border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
                                <MapPin className="h-3.5 w-3.5" />
                                {x.location}
                              </span>
                            )}
                            {(x.start || x.end) && (
                              <span className="inline-flex items-center gap-1 rounded-full border-2 border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
                                <Clock className="h-3.5 w-3.5" />
                                {[x.start, x.end].filter(Boolean).join(" — ")}
                              </span>
                            )}
                          </div>
                          {x.bullets?.length ? (
                            <ul className="mt-3 sm:mt-4 list-disc space-y-1.5 sm:space-y-2 pl-5 sm:pl-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                              {x.bullets.map((b, j) => (
                                <li key={j}>{b}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}


