"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, MapPin, GraduationCap, Sparkles, ArrowDown, FileText } from "lucide-react";
import { profile, education } from "@/data/resume";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/Reveal";
import { useAvatarUrl } from "@/hooks/useAvatarUrl";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -30]); // Reduced movement
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]); // Reduced scale
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const githubUsername = profile.github?.split("/").pop() || "Pragadees15";
  // Use higher resolution (512px) for better quality on retina displays (display size is 224-256px)
  const avatarUrl = useAvatarUrl(githubUsername, 512);
  // Attempt to derive CGPA from profile summary
  const cgpaMatch = profile.summary?.match(/CGPA\s*[^|)\n]+/);
  const cgpaText = cgpaMatch ? cgpaMatch[0] : null;
  const primaryEdu = Array.isArray(education) && education.length > 0 ? education[0] : null;
  const degreeText = primaryEdu?.degree ?? null;
  const gradYearMatch = primaryEdu?.meta?.match(/(\b\d{4}\b)/);
  const gradYear = gradYearMatch ? gradYearMatch[1] : null;

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section 
      ref={ref} 
      className="relative overflow-hidden min-h-[calc(100vh-4rem)] sm:min-h-[85vh] flex items-center pt-20 sm:pt-0"
      style={{ position: 'relative' }} // Explicit position for Framer Motion useScroll target
    >
      {/* Enhanced animated background gradients - optimized for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute left-[-20%] top-[-20%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,theme(colors.indigo.400/.2),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,theme(colors.indigo.500/.2),transparent_70%)] will-change-transform transform-gpu"
          animate={{
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute right-[-20%] bottom-[-20%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,theme(colors.fuchsia.400/.2),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,theme(colors.fuchsia.500/.2),transparent_70%)] will-change-transform transform-gpu"
          animate={{
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="site-container w-full">
        <div className="grid items-center gap-10 sm:gap-12 md:gap-16 md:grid-cols-[1.2fr_.8fr] lg:grid-cols-[1.3fr_.7fr]">
          <div className="text-center md:text-left min-w-0 overflow-visible">
            <Reveal style={{ y: titleY, opacity }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-300/50 dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-indigo-400/50 group"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <motion.span 
                  className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                AI/ML Engineer
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight overflow-visible">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-400 animate-gradient">
                  {profile.name}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-4 sm:mt-5 max-w-3xl mx-auto md:mx-0 text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {(profile as any).tagline ?? (profile.summary?.split(/\.(\s|$)/)[0] + ".")}
              </motion.p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3"
              >
                <Magnetic>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "group relative overflow-hidden gap-2 w-full sm:w-auto px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-indigo-500/0 transition group-hover:ring-8 group-hover:ring-indigo-500/20" />
                    <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100" />
                    <Github className="h-4 w-4 sm:h-5 sm:w-5" /> GitHub
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "group relative overflow-hidden gap-2 w-full sm:w-auto px-4 sm:px-6 border-2 hover:border-indigo-400 transition-all duration-300"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-indigo-500/0 transition group-hover:ring-8 group-hover:ring-indigo-500/20" />
                    <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100" />
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" /> LinkedIn
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://drive.google.com/file/d/1qblXImKORbM32TFAvQnMRZd7dE8kxsFB/view?usp=drive_link"
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "group relative overflow-hidden gap-2 w-full sm:w-auto px-4 sm:px-6 border-2 hover:border-fuchsia-400 bg-gradient-to-r from-fuchsia-50 to-indigo-50 hover:from-fuchsia-100 hover:to-indigo-100 dark:from-fuchsia-950/20 dark:to-indigo-950/20 dark:hover:from-fuchsia-950/30 dark:hover:to-indigo-950/30 transition-all duration-300"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-fuchsia-500/0 transition group-hover:ring-8 group-hover:ring-fuchsia-500/20" />
                    <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-100" />
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Resume
                  </a>
                </Magnetic>
              </motion.div>
            </Reveal>
            <Reveal delay={0.25}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm"
              >
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    {profile.location}
                  </span>
                )}
                {cgpaText && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300">
                    <GraduationCap className="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
                    {cgpaText}
                  </span>
                )}
                {degreeText && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300">
                    <GraduationCap className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    {degreeText}
                  </span>
                )}
                {gradYear && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-white/20 dark:bg-zinc-900/60 dark:text-zinc-300">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Grad {gradYear}
                  </span>
                )}
                <span className="rounded-full border border-indigo-200/70 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-indigo-500/30 dark:from-indigo-950/40 dark:to-fuchsia-950/40">Open Source</span>
                <span className="rounded-full border border-cyan-200/70 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-cyan-500/30 dark:from-cyan-950/40 dark:to-blue-950/40">Computer Vision</span>
                <span className="rounded-full border border-fuchsia-200/70 bg-gradient-to-r from-fuchsia-50 to-purple-50 px-3 py-1.5 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-fuchsia-500/30 dark:from-fuchsia-950/40 dark:to-purple-950/40">LLMs & RAG</span>
              </motion.div>
            </Reveal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 hidden md:flex items-center justify-start"
            >
              <button
                onClick={scrollToAbout}
                className="group flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <span>Explore my work</span>
                <ArrowDown className="h-4 w-4 animate-bounce group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>
          </div>
          <Reveal variant="fadeScale" delay={0.15} style={{ scale: imageScale }}>
            <div className="relative mx-auto aspect-square w-48 sm:w-56 md:w-72 lg:w-80 mt-8 md:mt-0">
              {/* Enhanced glow effect - static for performance */}
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
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


