"use client";

import Image from "next/image";
import { Mail, MapPin, Briefcase, GraduationCap, Download, Github, Linkedin, ArrowUpRight } from "lucide-react";
import { profile, projects, education, researchInterests } from "@/data/resume";
import { SectionHeading, SectionSubHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

type AboutProps = {
  avatarUrl: string;
};

// --- Helper Components ---

function BentoCard({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl transition duration-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 dark:border-white/5 dark:bg-white/5 h-full ${className}`}
    >
      {children}
    </div>
  );
}

function StatItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
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
  const shortSummary = "AI/ML engineer shipping usable ML pipelines in vision & RL.";

  const [vCardUrl, setVCardUrl] = useState("");

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
    setVCardUrl(url);

    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <section id="about" className="site-container py-20 sm:py-28 scroll-mt-24">
      <SectionHeading subtitle="Profile & Focus">About Me</SectionHeading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
        {/* 1. Main Profile Card (2x2 on Desktop) */}
        <BentoCard className="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col min-h-[320px]">
          <div className="absolute top-0 right-0 -m-4 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 h-full">
            <div className="flex items-start justify-between">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-4 ring-white dark:ring-white/10 shadow-lg shrink-0">
                <Image src={avatarUrl} alt={profile.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 backdrop-blur-md h-fit">
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
        <BentoCard className="col-span-1 lg:col-span-1 flex flex-col justify-center gap-6 min-h-[160px]" delay={0.1}>
          <StatItem label="Projects" value={`${projectCount}+`} icon={Briefcase} />
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <StatItem label="CGPA" value={cgpaValue} icon={GraduationCap} />
        </BentoCard>

        {/* 3. Location/Map Card (1x1) - Updates: FREE OSM Map */}
        <BentoCard className="col-span-1 lg:col-span-1 relative group min-h-[160px] p-0 overflow-hidden" delay={0.2}>
          {/* OpenStreetMap Iframe (Free & Creative Grayscale Look) */}
          <div className="absolute inset-0 z-0 bg-zinc-200 dark:bg-zinc-800 pointer-events-none">
            <iframe
              width="100%"
              height="100%"
              className="h-full w-full opacity-60 grayscale contrast-[1.1] invert-[.1] dark:invert-[.85] transition-opacity duration-500 group-hover:opacity-100"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://www.openstreetmap.org/export/embed.html?bbox=79.04,12.20,79.10,12.26&layer=mapnik&marker=12.2289,79.0746"
              title="Tiruvannamalai Location"
              loading="lazy"
            />
          </div>

          {/* Overlay Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent dark:from-black/95 dark:via-black/50 pointer-events-none" />

          <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 animate-pulse">
                <MapPin size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Location</span>
            </div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{profile.location || "Tiruvannamalai, India"}</p>
          </div>
        </BentoCard>

        {/* 4. Connect/Socials (Wide 2x1) */}
        <BentoCard className="col-span-1 sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[160px]" delay={0.3}>
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Let's Connect</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              I'm open to discussing new AI/ML projects and opportunities.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a href={profile.github} target="_blank" className="text-zinc-400 transition hover:text-zinc-900 dark:hover:text-zinc-100"><Github size={20} /></a>
              <a href={profile.linkedin} target="_blank" className="text-zinc-400 transition hover:text-[#0077b5]"><Linkedin size={20} /></a>
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
