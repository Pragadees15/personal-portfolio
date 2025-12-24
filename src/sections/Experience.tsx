"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { experiences } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// --- Logo Logic ---

type LogoCandidate = { src: string; alt: string };

function getOrgLogoCandidates(title: string, org: string): LogoCandidate[] {
  const titleLower = title.toLowerCase();
  const orgLower = org.toLowerCase();

  if (titleLower.includes("internship") || titleLower.includes("virtual program") || titleLower.includes("internships") || titleLower.includes("virtual programs")) {
    return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" }];
  }
  if (titleLower.includes("ai/ml student researcher") || (titleLower.includes("ai/ml") && titleLower.includes("researcher"))) {
    return [{ src: "/logos/SRM.png", alt: "SRM" }];
  }
  if (titleLower.includes("embedded firmware engineer")) {
    return [{ src: "/logos/Protechme.png", alt: "Protechme" }];
  }

  if (orgLower.includes("srm")) return [{ src: "/logos/SRM.png", alt: "SRM" }];
  if (orgLower.includes("protechme")) return [{ src: "/logos/Protechme.png", alt: "Protechme" }];
  if (orgLower.includes("independent") || orgLower.includes("open source") || orgLower.includes("open-source")) return [
    { src: "https://cdn.simpleicons.org/github", alt: "GitHub" },
    { src: "https://cdn.simpleicons.org/git", alt: "Git" },
  ];
  if (orgLower.includes("aicte")) return [{ src: "https://logo.clearbit.com/aicte-india.org", alt: "AICTE" }];
  if (orgLower.includes("android")) return [
    { src: "https://logo.clearbit.com/android.com", alt: "Android" },
    { src: "https://cdn.simpleicons.org/android", alt: "Android" },
  ];
  if (orgLower.includes("altair")) return [{ src: "https://logo.clearbit.com/altair.com", alt: "ALTAIR" }];

  return [{ src: "https://cdn.simpleicons.org/briefcase", alt: org }];
}

function OrgLogo({ title, org, size = 40 }: { title: string; org: string; size?: number }) {
  const candidates = getOrgLogoCandidates(title, org);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const boxStyle = { width: size, height: size };

  if (exhausted) {
    return (
      <div className="flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 ring-2 ring-white dark:ring-zinc-900" style={boxStyle}>
        <Briefcase className="w-1/2 h-1/2" />
      </div>
    );
  }

  const { src, alt } = candidates[index];
  const isSimpleIcon = src.includes("cdn.jsdelivr.net/npm/simple-icons");

  return (
    <div className="flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 p-1.5 ring-2 ring-white dark:ring-zinc-800 shadow-sm overflow-hidden" style={boxStyle}>
      {isSimpleIcon ? (
        <img src={src} alt={alt} className="w-full h-full object-contain dark:invert" />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={cn("w-full h-full object-contain", src.includes("simpleicons.org/github") && "dark:invert")}
          onError={() => {
            if (index + 1 < candidates.length) setIndex(index + 1);
            else setExhausted(true);
          }}
          unoptimized
        />
      )}
    </div>
  );
}

// --- Main Component ---

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" ref={containerRef} className="site-container py-24 sm:py-32 scroll-mt-24 relative overflow-hidden">
      <SectionHeading subtitle="My Journey">Professional Experience</SectionHeading>

      <div className="mt-20 relative px-4 sm:px-0">
        {/* Animated Central Spine (Desktop) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800/50">
          <div
            className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 w-full h-full"
          />
        </div>

        {/* Mobile Left Spine */}
        <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800/50 transform -translate-x-1/2">
          <div
            className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 w-full h-full"
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {experiences.map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-8 md:gap-0",
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* 1. Date/Meta Column (Desktop) */}
                <div className={cn("hidden md:flex w-1/2 px-12", isEven ? "justify-end" : "justify-start")}>
                  <div className={cn("flex flex-col gap-2", isEven ? "items-end text-right" : "items-start text-left")}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-sm font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50 shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      {[exp.start, exp.end].filter(Boolean).join(" — ")}
                    </div>
                    {exp.location && (
                      <div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Center Timeline Node */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    <div className="relative transform transition-transform duration-300 group-hover:scale-110">
                      <OrgLogo title={exp.title} org={exp.org} size={56} />
                      {/* Ping animation for latest item */}
                      {i === 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Content Card */}
                <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12">
                  <div className={cn(
                    "group relative p-6 sm:p-8 rounded-2xl border border-white/20 dark:border-white/5 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 dark:shadow-black/20 overflow-hidden",
                    "hover:border-indigo-500/20 dark:hover:border-indigo-500/20"
                  )}>
                    {/* Hover Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Mobile Date Header */}
                    <div className="md:hidden mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                        <Calendar className="h-3 w-3" />
                        {[exp.start, exp.end].filter(Boolean).join(" — ")}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        {exp.title}
                      </h3>
                      <div className="mt-2 text-base font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        {exp.org}
                      </div>

                      {exp.bullets && (
                        <ul className="mt-6 space-y-3">
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors duration-300" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
