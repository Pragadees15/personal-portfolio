"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Download,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";

import { profile, projects, education, researchInterests } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

type AboutProps = {
  avatarUrl: string;
};

export function About({ avatarUrl }: AboutProps) {
  const projectCount = projects?.length ?? 0;
  const eduCgpaMatch = education?.[0]?.meta?.match(/CGPA\s*([0-9.]+)/i);
  const summaryCgpaMatch = profile.summary.match(/CGPA\s*([0-9.]+)/i);
  const cgpaValue = (eduCgpaMatch?.[1] || summaryCgpaMatch?.[1]) || "9.33";

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
    const blob = new Blob([lines.join("\n")], {
      type: "text/x-vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const id = requestAnimationFrame(() => setVCardUrl(url));
    return () => {
      cancelAnimationFrame(id);
      URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <section
      id="about"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="01" subtitle="About — A short profile">
        Notebook to <em className="italic">production</em>,<br />
        with a designer&apos;s eye.
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-6">
        {/* PROFILE — large card */}
        <article className="lg:col-span-7 lg:row-span-2 card-flat hover-lift p-7 sm:p-9 flex flex-col gap-7">
          <header className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-foreground/15">
                <Image
                  src={avatarUrl}
                  alt={`${profile.name} — ${profile.role} profile picture`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display italic text-2xl leading-tight">
                  {profile.name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  {profile.role}
                </p>
              </div>
            </div>
            <span className="chip-mono">
              <span className="status-dot" />
              Open to work
            </span>
          </header>

          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-xl">
            Hello, I&apos;m Pragadeeswaran K — an AI/ML engineer building
            human-centered AI products. I ship reliable machine learning
            systems with clean, production-ready UX, turning quick research
            experiments into stable products that
            {" "}<span className="lime-underline">people actually use</span>.
            My focus is computer vision, agentic systems, and efficient ML
            on the edge and in the cloud.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            Currently a final-year B.Tech AI student at SRM Institute of
            Science and Technology with a CGPA of 9.33/10. I love taking
            research-grade ideas — diffusion models, deep reinforcement
            learning agents, vision transformers — and pairing them with
            thoughtful design so they feel obvious to use.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {researchInterests.slice(0, 6).map((tag) => (
              <span key={tag} className="chip-mono">
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* STATS */}
        <aside className="lg:col-span-5 grid grid-cols-2 gap-6">
          <div className="card-flat hover-lift p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="section-label">Projects</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-display text-5xl tabular-nums leading-none">
              {projectCount}+
            </div>
          </div>
          <div className="card-flat hover-lift p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="section-label">CGPA</span>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-display text-5xl tabular-nums leading-none">
              {cgpaValue}
            </div>
          </div>

          {/* LOCATION */}
          <div className="col-span-2 card-flat hover-lift p-6 flex items-center gap-5 min-h-[120px]">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="section-label">Based in</p>
              <p className="font-display italic text-2xl leading-tight mt-1">
                {profile.location}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              12.22°N
              <br />
              79.07°E
            </span>
          </div>
        </aside>

        {/* CONNECT */}
        <article className="lg:col-span-12 card-flat hover-lift p-7 sm:p-9 grid grid-cols-1 sm:grid-cols-12 gap-y-6 gap-x-8 items-center">
          <div className="sm:col-span-7 flex flex-col gap-3">
            <span className="section-label">/ Connect</span>
            <p className="font-display italic text-3xl sm:text-4xl leading-tight">
              Want to <span className="lime-mark">build</span> something?
            </p>
            {/* The display-size lime-mark stays — it's the right register for big text. */}
            <p className="text-muted-foreground max-w-md">
              I&apos;m open to AI/ML projects, research collaborations and
              full-stack engineering — say hi.
            </p>
            <div className="flex items-center gap-5 pt-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`Visit ${profile.name}'s GitHub profile`}
                className="link-underline inline-flex items-center gap-2 text-sm"
              >
                <Github className="h-4 w-4" />
                GitHub — open source
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`Visit ${profile.name}'s LinkedIn profile`}
                className="link-underline inline-flex items-center gap-2 text-sm"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn — work history
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label={`Send an email to ${profile.name}`}
                className="link-underline inline-flex items-center gap-2 text-sm"
              >
                <Mail className="h-4 w-4" />
                Email — say hi
              </a>
            </div>
          </div>

          <div className="sm:col-span-5 flex flex-col gap-3 sm:items-end">
            <a
              href={vCardUrl || "#"}
              download="pragadeeswaran.vcf"
              className="btn-lime"
            >
              <Download className="h-3.5 w-3.5" />
              Save Contact
            </a>
            <a
              href="#contact"
              className="btn-ghost-mono"
            >
              Send a message
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
