"use client";

import Image from "next/image";
import { useState } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

import { experiences } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type LogoCandidate = {
  src: string;
  alt: string;
  /** "mask" = monochrome SVG painted with currentColor.
   *  "plate" = raster/colored logo on a forced-light tile. */
  kind: "mask" | "plate";
};

function getOrgLogoCandidates(title: string, org: string): LogoCandidate[] {
  const titleLower = title.toLowerCase();
  const orgLower = org.toLowerCase();

  if (
    titleLower.includes("internship") ||
    titleLower.includes("virtual program") ||
    titleLower.includes("internships") ||
    titleLower.includes("virtual programs")
  ) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg",
        alt: "AWS",
        kind: "mask",
      },
    ];
  }
  if (
    titleLower.includes("ai/ml student researcher") ||
    (titleLower.includes("ai/ml") && titleLower.includes("researcher"))
  ) {
    return [{ src: "/logos/SRM.png", alt: "SRM", kind: "plate" }];
  }
  if (titleLower.includes("embedded firmware engineer")) {
    return [{ src: "/logos/Protechme.png", alt: "Protechme", kind: "plate" }];
  }
  if (orgLower.includes("srm")) {
    return [{ src: "/logos/SRM.png", alt: "SRM", kind: "plate" }];
  }
  if (orgLower.includes("protechme")) {
    return [{ src: "/logos/Protechme.png", alt: "Protechme", kind: "plate" }];
  }
  if (
    orgLower.includes("independent") ||
    orgLower.includes("open source") ||
    orgLower.includes("open-source")
  ) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg",
        alt: "GitHub",
        kind: "mask",
      },
    ];
  }
  if (orgLower.includes("aicte")) {
    return [
      {
        src: "https://logo.clearbit.com/aicte-india.org",
        alt: "AICTE",
        kind: "plate",
      },
    ];
  }
  if (orgLower.includes("android")) {
    return [
      {
        src: "https://logo.clearbit.com/android.com",
        alt: "Android",
        kind: "plate",
      },
    ];
  }
  if (orgLower.includes("altair")) {
    return [
      {
        src: "https://logo.clearbit.com/altair.com",
        alt: "ALTAIR",
        kind: "plate",
      },
    ];
  }
  return [];
}

function OrgLogo({ title, org, size = 56 }: { title: string; org: string; size?: number }) {
  const candidates = getOrgLogoCandidates(title, org);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const boxStyle = { width: size, height: size };

  if (exhausted) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-secondary"
        style={boxStyle}
      >
        <Briefcase className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  const candidate = candidates[index];
  if (candidate.kind === "mask") {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background"
        style={boxStyle}
      >
        <span
          aria-label={candidate.alt}
          role="img"
          className="icon-mask block text-foreground"
          style={{
            width: size * 0.55,
            height: size * 0.55,
            maskImage: `url(${candidate.src})`,
            WebkitMaskImage: `url(${candidate.src})`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="logo-plate relative flex items-center justify-center overflow-hidden rounded-md p-2"
      style={boxStyle}
    >
      <Image
        src={candidate.src}
        alt={candidate.alt}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1);
          else setExhausted(true);
        }}
        unoptimized
      />
    </div>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="05" subtitle="Experience — Where I've shipped">
        From <em className="italic">firmware</em> to{" "}
        <em className="italic">applied AI</em>.
      </SectionHeading>

      <p className="-mt-6 mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A condensed timeline of where I&apos;ve shipped real software — from
        embedded firmware on ESP32 devices to AI/ML student research and
        production-grade open-source work. Each role below pairs a clear
        outcome with the practices that made it repeatable.
      </p>

      <div className="border-t border-foreground/10">
        {experiences.map((exp, i) => {
          const isPresent = exp.end?.toLowerCase().includes("present");
          return (
            <article
              key={`${exp.title}-${i}`}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 py-10 sm:py-14",
                i !== experiences.length - 1 && "border-b border-foreground/10",
              )}
            >
              {/* Index + meta column */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                  {isPresent && (
                    <span className="chip-mono border-foreground/40 text-foreground">
                      <span className="status-dot" /> Active
                    </span>
                  )}
                </div>
                {(exp.start || exp.end) && (
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground tabular-nums">
                    <Calendar className="h-3.5 w-3.5" />
                    {[exp.start, exp.end].filter(Boolean).join(" — ")}
                  </div>
                )}
                {exp.location && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </div>
                )}
              </div>

              {/* Title + body column */}
              <div className="lg:col-span-9 flex gap-5 sm:gap-7">
                <OrgLogo title={exp.title} org={exp.org} size={64} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-3xl sm:text-4xl leading-tight">
                    <span className="italic">{exp.title}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    {exp.org}
                  </p>

                  {exp.bullets && (
                    <ul className="mt-6 space-y-3 max-w-2xl">
                      {exp.bullets.map((b, idx) => (
                        <li
                          key={idx}
                          className="grid grid-cols-[auto_1fr] gap-3 text-sm sm:text-base leading-relaxed text-foreground/85"
                        >
                          <span className="font-mono text-muted-foreground tabular-nums pt-[3px] text-xs">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
