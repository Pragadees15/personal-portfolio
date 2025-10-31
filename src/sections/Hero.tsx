"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { profile } from "@/data/resume";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/Pragadees15.png?size=280");
  useEffect(() => {
    setAvatarUrl((prev) => `${prev}&t=${Date.now()}`);
  }, []);
  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="site-container">
        <div className="grid items-center gap-10 md:gap-14 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <Reveal style={{ y: titleY }}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                AI/ML Engineer
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-fuchsia-700 dark:from-indigo-300 dark:to-fuchsia-300 sm:text-5xl lg:text-7xl">
                {profile.name}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 max-w-3xl text-base text-zinc-600 dark:text-zinc-400 md:text-lg lg:text-xl">
                {(profile as any).tagline ?? (profile.summary?.split(/\.(\s|$)/)[0] + ".")}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-6 flex items-center gap-3">
              <Magnetic>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "md" }),
                    "group relative overflow-hidden gap-2"
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-indigo-500/0 transition group-hover:ring-8 group-hover:ring-indigo-500/10" />
                  <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100 dark:via-white/10" />
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "md" }),
                    "group relative overflow-hidden gap-2"
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-indigo-500/0 transition group-hover:ring-8 group-hover:ring-indigo-500/10" />
                  <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100 dark:via-white/10" />
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">Open Source</span>
                <span className="rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">Computer Vision</span>
                <span className="rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">LLMs & RAG</span>
              </div>
            </Reveal>
          </div>
          <Reveal variant="fadeScale" delay={0.15} style={{ scale: imageScale }}>
            <div className="relative mx-auto aspect-square w-56 sm:w-64">
              <div className="absolute -inset-4 -z-10 rounded-[1.6rem] bg-[radial-gradient(closest-side,theme(colors.indigo.400/.25),transparent)] blur-xl dark:bg-[radial-gradient(closest-side,theme(colors.indigo.500/.25),transparent)]" />
              <div className="absolute inset-0 rounded-[1.1rem] p-[1px] bg-gradient-to-br from-cyan-500/40 via-transparent to-fuchsia-500/40">
                <div className="relative h-full w-full overflow-hidden rounded-[1rem] border border-white/20 bg-white/60 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 640px) 14rem, 16rem"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


