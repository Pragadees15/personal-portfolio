"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  FileText,
  MapPin,
} from "lucide-react";

import { profile } from "@/data/resume";
import Modal from "@/components/Modal";
import { ResumeViewer } from "@/components/ResumeViewer";
import { isMobileDevice } from "@/lib/utils";

type HeroProps = {
  avatarUrl: string;
};

const ROLES = [
  "Computer Vision",
  "Reinforcement Learning",
  "Agentic Systems",
  "Generative Models",
];

export function Hero({ avatarUrl }: HeroProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileDevice());
    const open = () => setIsResumeOpen(true);

    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now),
      );
    };

    const raf = requestAnimationFrame(() => {
      setIsMobile(isMobileDevice());
      updateTime();
    });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("open-resume-viewer", open);
    const id = window.setInterval(updateTime, 60_000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("open-resume-viewer", open);
      window.clearInterval(id);
    };
  }, []);

  const [first, ...rest] = profile.name.split(" ");

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-end pb-12 sm:pb-16 lg:pb-24 pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="site-container relative w-full">
        {/* TOP META — masthead */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-y-4 gap-x-6 mb-12 sm:mb-16 reveal-stagger">
          <div className="col-span-1 sm:col-span-3 flex flex-col gap-1">
            <span className="section-label">Vol. 26 / Edition I</span>
            <span className="font-mono text-xs text-foreground tabular-nums">
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="col-span-1 sm:col-span-6 flex flex-col gap-1 sm:items-center sm:text-center">
            <span className="section-label">A portfolio by</span>
            <span className="font-display italic text-base">
              Pragadeeswaran K
            </span>
          </div>

          <div className="col-span-2 sm:col-span-3 flex flex-col gap-1 sm:items-end sm:text-right">
            <span className="section-label">
              {profile.location} · {time || "—"}
            </span>
            <span className="font-mono text-xs text-foreground inline-flex items-center gap-2 sm:justify-end">
              <span className="status-dot" />
              Available for work
            </span>
          </div>
        </div>

        <div className="rule-h" />

        {/* MAIN GRID — editorial 12-col */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          {/* Eyebrow + headline column */}
          <div className="lg:col-span-8 flex flex-col gap-8 reveal-stagger">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                §  Hello
              </span>
              <span className="h-px w-8 bg-foreground/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
                I&apos;m an engineer
              </span>
            </div>

            <h1 className="display-serif text-[clamp(3rem,11vw,9rem)] leading-[0.92] tracking-[-0.035em]">
              <span className="block">{first}</span>
              <span className="block italic">
                <span className="lime-mark">{rest.join(" ")}</span>
              </span>
              <span className="block text-muted-foreground/80">
                building <span className="italic">human-</span>
                <br className="hidden sm:block" />
                centered AI.
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              I&apos;m <span className="text-foreground">Pragadeeswaran K</span>
              {" "}— an AI/ML engineer building human-centered AI products.
              I take machine learning ideas from notebook to production with
              fast experiments, clean engineering, and interfaces people
              actually want to use.
              <span className="text-foreground"> CGPA 9.39 / 10.</span>
            </p>

            {/* CTA cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="btn-lime"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Read the Résumé</span>
              </button>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-mono"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Source code</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-foreground link-underline px-2 py-2"
              >
                View work
                <ArrowDownRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Portrait + meta column */}
          <div className="lg:col-span-4 flex flex-col gap-6 reveal-stagger">
            <figure className="relative aspect-[4/5] w-full max-w-sm self-end overflow-hidden rounded-sm border border-foreground/15 bg-secondary">
              <Image
                src={avatarUrl}
                alt={`Portrait of ${profile.name}, ${profile.role} based in ${profile.location}`}
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 360px"
                className="object-cover grayscale-[0.18] contrast-[1.02] transition duration-700 hover:grayscale-0"
              />
              {/* Corner brackets — always white with shadow so they read on any photo */}
              <span className="absolute top-2.5 left-2.5 h-3 w-3 border-l-2 border-t-2 border-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute top-2.5 right-2.5 h-3 w-3 border-r-2 border-t-2 border-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute bottom-2.5 left-2.5 h-3 w-3 border-l-2 border-b-2 border-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute bottom-2.5 right-2.5 h-3 w-3 border-r-2 border-b-2 border-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

              {/* Caption sits inside a soft gradient so it's legible over any photo */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                  fig. 01 — author
                </span>
                <span className="font-display italic text-sm">est. 2004</span>
              </figcaption>
            </figure>

            {/* Coordinates / location */}
            <div className="self-end max-w-sm w-full flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                12.22°N · 79.07°E
              </span>
              <span className="text-foreground">IST · UTC+5:30</span>
            </div>
          </div>
        </div>

        {/* BOTTOM marquee of focus areas */}
        <div className="mt-16 sm:mt-24 reveal-stagger">
          <div className="rule-h" />
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden mask-fade-x py-5">
            <div className="flex shrink-0 animate-scroll-left gap-3 sm:gap-6 will-change-transform" style={{ animationDuration: "44s" }}>
              {[...ROLES, ...ROLES, ...ROLES, ...ROLES].map((role, idx) => (
                <span
                  key={`${role}-${idx}`}
                  className="inline-flex items-center gap-3 whitespace-nowrap font-display italic text-3xl sm:text-4xl text-muted-foreground/70"
                >
                  {role}
                  <span className="h-1 w-1 rounded-full bg-foreground" />
                </span>
              ))}
            </div>
          </div>
          <div className="rule-h" />
        </div>
      </div>

      {/* Resume Modal */}
      <Modal
        open={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        className="p-0"
      >
        <ResumeViewer
          pdfUrl="/resume.pdf"
          onClose={() => setIsResumeOpen(false)}
          isMobile={isMobile}
        />
      </Modal>
    </section>
  );
}
