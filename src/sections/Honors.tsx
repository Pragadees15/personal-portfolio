"use client";

import { useState } from "react";
import { ArrowUpRight, Award, Calendar, Trophy } from "lucide-react";

import { honors } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
/* eslint-disable @next/next/no-img-element */

type LogoCandidate = {
  src: string;
  alt: string;
  /** "mask" = monochrome SVG, painted with `currentColor`. Adapts to theme.
   *  "plate" = raster/colored logo on a forced light tile (always legible). */
  kind: "mask" | "plate";
};

function getHonorLogoCandidates(...parts: Array<string | undefined>): LogoCandidate[] {
  const k = parts.filter(Boolean).join(" ").toLowerCase();
  if (!k) return [];

  if (k.includes("srm") || k.includes("cgpa")) {
    return [{ src: "/logos/SRM.png", alt: "SRMIST", kind: "plate" }];
  }
  if (k.includes("nptel")) {
    return [{ src: "/logos/nptel.jpeg", alt: "NPTEL", kind: "plate" }];
  }
  if (k.includes("aws")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg",
        alt: "AWS",
        kind: "mask",
      },
    ];
  }
  if (k.includes("oracle")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg",
        alt: "Oracle",
        kind: "mask",
      },
    ];
  }
  if (k.includes("aicte")) {
    return [
      { src: "https://logo.clearbit.com/aicte-india.org", alt: "AICTE", kind: "plate" },
    ];
  }
  if (
    k.includes("hackathon") ||
    k.includes("hackstreet") ||
    k.includes("webathon") ||
    k.includes("digithon")
  ) {
    return [{ src: "/logos/SRM.png", alt: "SRMIST", kind: "plate" }];
  }
  if (k.includes("experience kits") || k.includes("github")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg",
        alt: "GitHub",
        kind: "mask",
      },
    ];
  }
  return [];
}

function HonorLogo({
  title,
  issuer,
  size = 56,
}: {
  title: string;
  issuer?: string;
  size?: number;
}) {
  const candidates = getHonorLogoCandidates(title, issuer);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const boxStyle = { width: size, height: size };

  if (exhausted) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background text-foreground shrink-0"
        style={boxStyle}
      >
        <Trophy className="h-1/2 w-1/2" strokeWidth={1.5} />
      </div>
    );
  }

  const candidate = candidates[index];
  if (!candidate) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background text-foreground shrink-0"
        style={boxStyle}
      >
        <Trophy className="h-1/2 w-1/2" strokeWidth={1.5} />
      </div>
    );
  }

  if (candidate.kind === "mask") {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background shrink-0"
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
      className={cn("logo-plate flex items-center justify-center rounded-md overflow-hidden p-2 shrink-0")}
      style={boxStyle}
    >
      <img
        src={candidate.src}
        alt={candidate.alt}
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1);
          else setExhausted(true);
        }}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function HonorCard({
  honor,
  index,
}: {
  honor: (typeof honors)[0];
  index: number;
}) {
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <article className="card-flat hover-lift group p-7 sm:p-8 flex flex-col gap-6 min-h-[320px]">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <HonorLogo title={honor.title} issuer={honor.issuer} size={56} />
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
              No. {numeral}
            </span>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl leading-tight">
              <span className="italic">{honor.title}</span>
            </h3>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {honor.issuer && (
          <span className="chip-mono">
            <Award className="h-3 w-3" />
            {honor.issuer}
          </span>
        )}
        {honor.date && (
          <span className="chip-mono">
            <Calendar className="h-3 w-3" />
            {honor.date}
          </span>
        )}
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-prose">
        {honor.description}
      </p>

      {honor.highlights && honor.highlights.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-foreground/10 pt-4">
          {honor.highlights.map((h) => (
            <div key={h.label} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {h.label}
              </span>
              <span className="font-display text-xl">{h.value}</span>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-auto flex items-center justify-between gap-4 border-t border-foreground/10 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {honor.tags?.map((tag, i) => (
            <span key={i} className="chip-mono">
              {tag}
            </span>
          ))}
        </div>
        {honor.link && (
          <a
            href={honor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground link-underline"
          >
            View proof
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </footer>
    </article>
  );
}

export function Honors() {
  return (
    <section
      id="honors"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="08" subtitle="Honors — Recognition">
        Small <em className="italic">badges</em>
        {" & big lessons."}
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {honors.map((honor, index) => (
          <HonorCard key={honor.title} honor={honor} index={index} />
        ))}
      </div>
    </section>
  );
}
