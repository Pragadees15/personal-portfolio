"use client";

import Image from "next/image";
import { Mail, MapPin, Briefcase, GraduationCap, Download, Github, Linkedin, ArrowUpRight, type LucideIcon } from "lucide-react";
import { profile, projects, education, researchInterests } from "@/data/resume";
import { SectionHeading, SectionSubHeading } from "@/components/SectionHeading";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Map, MapMarker, MapTileLayer } from "@/components/ui/map";
import type { LatLngExpression } from "leaflet";

type AboutProps = {
  avatarUrl: string;
};

// --- Helper Components ---

type BentoCardProps = {
  children: ReactNode;
  className?: string;
};

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/95 dark:bg-zinc-900/95 p-6 shadow-sm transition duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 dark:border-white/5 h-full will-change-transform ${className}`}
      >
        {children}
      </div>
    );
  }
);

BentoCard.displayName = "BentoCard";

function StatItem({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
    </div>
  );
}

// --- Main Component ---

export function About({ avatarUrl }: AboutProps) {
  const projectCount = projects?.length ?? 0;
  const eduCgpaMatch = education?.[0]?.meta?.match(/CGPA\s*([0-9.]+)/i);
  const summaryCgpaMatch = profile.summary.match(/CGPA\s*([0-9.]+)/i);
  const cgpaValue = (eduCgpaMatch?.[1] || summaryCgpaMatch?.[1]) || "9.3";
  const shortSummary = "AI/ML engineer turning computer vision, RL, and agentic ideas into reliable products with clear UX.";
  const TIRUVANNAMALAI = [12.2289, 79.0746] satisfies LatLngExpression;
  const PLACES = [
    {
      name: "Tiruvannamalai",
      coordinates: TIRUVANNAMALAI,
      icon: (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
          <span className="text-base leading-none" aria-hidden>
            🐶
          </span>
        </span>
      ),
    },
  ] as const;

  const [vCardUrl, setVCardUrl] = useState("");
  const mapCardRef = useRef<HTMLDivElement | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      `TITLE:${profile.role}`,
      profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
      "END:VCARD",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/x-vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const id = requestAnimationFrame(() => setVCardUrl(url));

    return () => {
      cancelAnimationFrame(id);
      URL.revokeObjectURL(url);
    };
  }, []);

  useEffect(() => {
    const target = mapCardRef.current;
    if (!target || showMap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.2,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [showMap]);

  return (
    <section id="about" className="site-container py-20 sm:py-28 scroll-mt-24">
      <SectionHeading subtitle="Profile & Focus">About Me</SectionHeading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
        {/* 1. Main Profile Card (2x2 on Desktop) */}
        <BentoCard className="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col min-h-[320px]">

          <div className="relative z-10 flex flex-col gap-4 h-full">
            <div className="flex items-start justify-between">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-4 ring-white dark:ring-white/10 shadow-lg shrink-0">
                <Image src={avatarUrl} alt={profile.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="rounded-full border border-indigo-200/50 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300 h-fit">
                Open for Work
              </div>
            </div>

            <div>
              <SectionSubHeading className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profile.name}</SectionSubHeading>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{profile.role}</p>
            </div>

            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              {shortSummary} Passionate about bridging the gap between research and production-grade software.
            </p>

            {/* Tags stack naturally now with valid gap, no forced 'mt-auto' spacing */}
            <div className="flex flex-wrap gap-2 pt-2">
              {researchInterests?.slice(0, 5).map((tag, i) => (
                <span key={i} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 2. Stats Card (1x1) */}
        <BentoCard className="col-span-1 lg:col-span-1 flex flex-col justify-center gap-6 min-h-[160px]">
          <StatItem label="Projects" value={`${projectCount}+`} icon={Briefcase} />
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <StatItem label="CGPA" value={cgpaValue} icon={GraduationCap} />
        </BentoCard>

        {/* 3. Location/Map Card (1x1) */}
        <BentoCard
          ref={mapCardRef}
          className="col-span-1 lg:col-span-1 relative group min-h-[160px] p-0 overflow-hidden"
        >
          {/* Leaflet map */}
          <div className="absolute inset-0 z-0 bg-zinc-200 dark:bg-zinc-800 pointer-events-none">
            {showMap && (
              <Map
                center={PLACES[0].coordinates}
                zoom={13}
                className="h-full w-full min-h-0 rounded-none opacity-80 transition-opacity duration-500 group-hover:opacity-100 dark:brightness-[0.92]"
              >
                <MapTileLayer />
                {PLACES.map((place) => (
                  <MapMarker
                    key={place.name}
                    position={place.coordinates}
                    icon={place.icon}
                  />
                ))}
              </Map>
            )}
          </div>

          {/* Overlay Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent dark:from-black/95 dark:via-black/50 pointer-events-none" />

          <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                <MapPin size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Location
              </span>
            </div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {profile.location || "Tiruvannamalai, India"}
            </p>
          </div>
        </BentoCard>

        {/* 4. Connect/Socials (Wide 2x1) */}
        <BentoCard className="col-span-1 sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[160px]">
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Let&apos;s Connect</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              I&apos;m open to discussing new AI/ML projects and opportunities.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-zinc-400 transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <Github size={20} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-zinc-400 transition hover:text-[#0077b5]"
              >
                <Linkedin size={20} />
              </a>
              <a href={`mailto:${profile.email}`} className="text-zinc-400 transition hover:text-indigo-500"><Mail size={20} /></a>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <a href={vCardUrl} download="pragadeeswaran.vcf" className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
              <Download size={16} /> Save Contact
            </a>
            <a href="#contact" className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">
              Contact Me <ArrowUpRight size={16} />
            </a>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
