"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, MapPin, GraduationCap, Sparkles, ArrowDown, FileText } from "lucide-react";
import { profile, education } from "@/data/resume";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/Reveal";
import { useAvatarUrl } from "@/hooks/useAvatarUrl";
import dynamic from "next/dynamic";

const HeroParticles = dynamic(() => import("@/components/particles/HeroParticles"), { ssr: false });

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = reduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [0, -30]);
  const imageScale = reduceMotion ? 1 : useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = reduceMotion ? 1 : useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const githubUsername = profile.github?.split("/").pop() || "Pragadees15";
  const avatarUrl = useAvatarUrl(githubUsername, 512);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section 
      ref={ref} 
      className="relative overflow-hidden min-h-[calc(100vh-4rem)] sm:min-h-[85vh] flex items-center pt-20 sm:pt-0"
      style={{ position: 'relative' }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute left-[-20%] top-[-20%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,theme(colors.indigo.400/.2),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,theme(colors.indigo.500/.2),transparent_70%)] will-change-transform transform-gpu"
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute right-[-20%] bottom-[-20%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,theme(colors.fuchsia.400/.2),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,theme(colors.fuchsia.500/.2),transparent_70%)] will-change-transform transform-gpu"
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      {/* reactive particles (Hyper Mode only) */}
      <div className="absolute inset-0 -z-10">
        <HeroParticles />
      </div>

      <div className="site-container w-full">
        <div className="grid items-center gap-8 sm:gap-10 md:gap-14 md:grid-cols-[1.2fr_.8fr] lg:grid-cols-[1.3fr_.7fr]">
          <div className="text-center md:text-left min-w-0 overflow-visible">
            <Reveal style={{ y: titleY, opacity }}>
              {/* Subtle role label */}
              <div className="mb-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-zinc-500/90 dark:text-zinc-400/90">
                AI/ML Engineer
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight overflow-visible">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-400 animate-gradient">
                  {profile.name}
                </span>
              </h1>
              {/* Small gradient divider */}
              <div className="mt-3 h-1 w-20 rounded-full mx-auto md:mx-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500" />
            </Reveal>
            <Reveal delay={0.1}>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-3 sm:mt-4 max-w-2xl mx-auto md:mx-0 text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {(profile as any).tagline ?? (profile.summary?.split(/\.(\s|$)/)[0] + ".")}
              </motion.p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3"
              >
                <Magnetic>
                  <a
                    href="/resume"
                    aria-label="Open Resume"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "group relative overflow-hidden gap-2 w-full sm:w-auto px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-fuchsia-500/0 transition group-hover:ring-8 group-hover:ring-fuchsia-500/20" />
                    <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100" />
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Resume
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub profile in a new tab"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "group relative overflow-hidden gap-2 w-full sm:w-auto px-4 sm:px-6 border-2 hover:border-indigo-400 transition-all duration-300"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-indigo-500/0 transition group-hover:ring-8 group-hover:ring-indigo-500/20" />
                    <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100" />
                    <Github className="h-4 w-4 sm:h-5 sm:w-5" /> GitHub
                  </a>
                </Magnetic>
              </motion.div>
            </Reveal>
            <Reveal delay={0.25}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm"
              >
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3 py-1.5 shadow-sm dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    {profile.location}
                  </span>
                )}
              </motion.div>
            </Reveal>
          </div>
          <Reveal variant="fadeScale" delay={0.15} style={{ scale: imageScale }}>
            <div className="relative mx-auto aspect-square w-48 sm:w-56 md:w-72 lg:w-80 mt-8 md:mt-0">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle,theme(colors.indigo.400/.25),transparent_60%)] blur-xl transform-gpu dark:bg-[radial-gradient(circle,theme(colors.indigo.500/.25),transparent_60%)]" />
              <div className="absolute -inset-8 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle,theme(colors.fuchsia.400/.15),transparent_70%)] blur-xl transform-gpu dark:bg-[radial-gradient(circle,theme(colors.fuchsia.500/.15),transparent_70%)]" />
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="absolute inset-0 rounded-[1.4rem] p-[2px] bg-gradient-to-br from-cyan-500/50 via-indigo-500/50 via-fuchsia-500/50 to-purple-500/50 animate-gradient-xy"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[calc(1.4rem-2px)] border-2 border-white/30 bg-white/70 shadow-2xl ring-2 ring-black/5 backdrop-blur-xl dark:border-white/20 dark:bg-zinc-900/60">
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    priority
                    quality={100}
                    loading="eager"
                    sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 20rem"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToAbout}
        className="group pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:shadow-md dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300"
        aria-label="Scroll to About"
      >
        <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        Scroll
      </button>
    </section>
  );
}


