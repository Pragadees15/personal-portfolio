"use client";

import { useState } from "react";
import { ArrowUpRight, Code, Share2, Trophy, Users } from "lucide-react";

import { leadership } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
/* eslint-disable @next/next/no-img-element */

type LogoCandidate = {
  src: string;
  alt: string;
  kind: "mask" | "plate";
};

function getActivityLogoCandidates(...parts: Array<string | undefined>): LogoCandidate[] {
  const k = parts.filter(Boolean).join(" ").toLowerCase();
  if (!k) return [];
  if (
    k.includes("hackathon") ||
    k.includes("hackstreet") ||
    k.includes("webathon") ||
    k.includes("digithon")
  ) {
    return [{ src: "/logos/SRM.png", alt: "SRMIST", kind: "plate" }];
  }
  if (k.includes("open-source") || k.includes("open source") || k.includes("oss")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg",
        alt: "GitHub",
        kind: "mask",
      },
    ];
  }
  if (k.includes("mentor") || k.includes("mentoring") || k.includes("community")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/discord.svg",
        alt: "Community",
        kind: "mask",
      },
    ];
  }
  if (k.includes("python")) {
    return [
      {
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg",
        alt: "Python",
        kind: "mask",
      },
    ];
  }
  return [];
}

function ActivityLogo({
  title,
  role,
  org,
  size = 56,
}: {
  title: string;
  role?: string;
  org?: string;
  size?: number;
}) {
  const candidates = getActivityLogoCandidates(title, role, org);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const boxStyle = { width: size, height: size };

  if (exhausted) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background text-foreground"
        style={boxStyle}
      >
        <Users className="h-1/2 w-1/2" strokeWidth={1.5} />
      </div>
    );
  }

  const candidate = candidates[index];
  if (!candidate) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-foreground/15 bg-background text-foreground"
        style={boxStyle}
      >
        <Users className="h-1/2 w-1/2" strokeWidth={1.5} />
      </div>
    );
  }

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
      className="logo-plate relative flex items-center justify-center rounded-md overflow-hidden p-2"
      style={boxStyle}
    >
      <img
        src={candidate.src}
        alt={candidate.alt}
        loading="lazy"
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1);
          else setExhausted(true);
        }}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function getIconForActivity(index: number) {
  if (index === 0) return Trophy;
  if (index === 1) return Code;
  return Share2;
}

export function Leadership() {
  return (
    <section
      id="leadership"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="09" subtitle="Leadership — Impact & community">
        Building <em className="italic">with</em>
        {" people, not just for them."}
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 auto-rows-fr">
        {leadership.map((activity, i) => {
          const Icon = getIconForActivity(i);
          const numeral = String(i + 1).padStart(2, "0");
          const span =
            i === 0 ? "md:col-span-2" : i === 1 ? "md:col-span-1" : "md:col-span-3";

          return (
            <article
              key={activity.title}
              className={cn(
                "card-flat hover-lift group p-7 sm:p-8 flex flex-col gap-6",
                span,
              )}
            >
              <header className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <ActivityLogo
                    title={activity.title}
                    role={activity.role}
                    org={activity.org}
                    size={56}
                  />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums inline-flex items-center gap-2">
                      No. {numeral}
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl leading-tight">
                      <span className="italic">{activity.title}</span>
                    </h3>
                    {activity.org && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.org}
                      </p>
                    )}
                  </div>
                </div>
                {activity.timeframe && (
                  <span className="chip-mono shrink-0">
                    {activity.timeframe}
                  </span>
                )}
              </header>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-prose">
                {activity.description}
              </p>

              <footer className="mt-auto pt-4 border-t border-foreground/10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                {activity.impact?.length ? (
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {activity.impact.map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <span className="font-display text-2xl tabular-nums leading-none">
                          {stat.value}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {activity.link && (
                  <a
                    href={activity.link}
                    target={activity.link.startsWith("http") ? "_blank" : undefined}
                    rel={activity.link.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground link-underline"
                  >
                    See proof
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
