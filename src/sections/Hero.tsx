"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import { Github, MapPin, FileText, ArrowRight, Sparkles, Terminal, Cpu, Globe, Code2, GraduationCap } from "lucide-react";
import { profile } from "@/data/resume";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, MouseEvent } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/Reveal";
import Modal from "@/components/Modal";
import { ResumeViewer } from "@/components/ResumeViewer";
import { isMobileDevice } from "@/lib/utils";

type HeroProps = {
  avatarUrl: string;
};

// --- Creative Components ---

function Badge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-zinc-200/80 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:scale-105 group">
      <Icon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" />
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{text}</span>
    </div>
  );
}

function HeroStat({ icon: Icon, value, label, color, delay }: { icon: any; value: string; label: string; color: string; delay: number }) {
  const colorStyles = {
    indigo: "from-indigo-500/20 to-indigo-500/0 text-indigo-500 shadow-indigo-500/20",
    pink: "from-pink-500/20 to-pink-500/0 text-pink-500 shadow-pink-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-500 shadow-emerald-500/20",
    cyan: "from-cyan-500/20 to-cyan-500/0 text-cyan-500 shadow-cyan-500/20",
  }[color] || "from-zinc-500/20 to-zinc-500/0 text-zinc-500 shadow-zinc-500/20";

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br rounded-2xl opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40",
        colorStyles.split(" ")[0] // Extract gradient colors
      )} />
      <div className="relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-white/10 backdrop-blur-xl hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-lg hover:shadow-xl">
        <div className={cn(
          "p-2 rounded-xl bg-white dark:bg-white/10 shadow-sm transition-colors",
          colorStyles.split(" ").find(c => c.startsWith("text-"))
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight">{value}</span>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Tilt rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
        willChange: "transform", // Hint to browser to optimize
      }}
      className="relative w-[250px] sm:w-[300px] lg:w-[350px] aspect-square mx-auto lg:mx-0"
    >
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl shadow-indigo-500/20 group cursor-pointer p-2 sm:p-3"
      >
        {/* Geometric Corner Accents */}
        <div className="absolute -top-px -left-px w-16 h-16 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-[2rem] z-20 transition-all duration-500 group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
        <div className="absolute -bottom-px -right-px w-16 h-16 border-b-2 border-r-2 border-fuchsia-500/50 rounded-br-[2rem] z-20 transition-all duration-500 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_20px_rgba(232,121,249,0.3)]" />

        {/* Inner Frame */}
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/5 bg-zinc-900/50">
          {children}
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30 mix-blend-overlay"
          style={{
            background: useMotionTemplate`radial-gradient(
                    600px circle at ${useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])}, 
                    rgba(255,255,255,0.15), 
                    transparent 40%
                )`
          }}
        />
      </div>
    </motion.div>
  );
}

// Scramble text hook
function useScramble(text: string) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((c, i) => {
        if (i < iteration) return text[i];
        return "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
      }).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return display;
}

function ScrambleText({ text, className }: { text: string; className?: string }) {
  const display = useScramble(text);
  return <span className={className}>{display}</span>;
}

export function Hero({ avatarUrl }: HeroProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleOpen = () => setIsResumeOpen(true);
    window.addEventListener("open-resume-viewer", handleOpen);
    return () => window.removeEventListener("open-resume-viewer", handleOpen);
  }, []);

  // const roleText = useScramble("Full Stack Developer"); // Moved to component

  return (
    <section ref={ref} id="hero" className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-28 pb-12 lg:py-20">

      {/* Content Wrapper */}
      <div
        className="site-container relative z-10 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Column: Text & Actions */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">

            {/* Top Tags/Badges */}
            <Reveal>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Badge icon={Terminal} text="Full-Stack" />
                <Badge icon={Cpu} text="AI Engineer" />
                <Badge icon={Globe} text="Creative Dev" />
              </div>
            </Reveal>

            {/* Main Headline */}
            <div className="space-y-4">
              <Reveal delay={0.1}>
                <h2 className="text-xl sm:text-2xl font-light text-indigo-400 font-mono tracking-wide">
                  Hello, I&apos;m
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-tight whitespace-nowrap">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-500">
                    {profile.name.split(" ")[0]}
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ml-3 sm:ml-4 drop-shadow-lg shadow-indigo-500/50">
                    {profile.name.split(" ").slice(1).join(" ")}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                  <ScrambleText text="Full Stack Developer" className="font-mono text-indigo-500 dark:text-indigo-400 font-medium" /> crafting specific digital experiences.
                  Turning complex problems into elegant, scalable solutions.
                </p>
              </Reveal>
            </div>

            {/* CTA Buttons */}
            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Magnetic>
                  <button
                    onClick={() => setIsResumeOpen(true)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full px-6 py-6 text-base shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 w-full sm:w-auto"
                    )}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </button>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "rounded-full px-6 py-6 text-base border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all backdrop-blur-md bg-transparent w-full sm:w-auto"
                    )}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Magnetic>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-8">
                <HeroStat
                  icon={Code2}
                  value="5+"
                  label="Projects"
                  color="indigo"
                  delay={0.6}
                />
                <HeroStat
                  icon={GraduationCap}
                  value="9.3"
                  label="CGPA"
                  color="pink"
                  delay={0.7}
                />
                {profile.location && (
                  <HeroStat
                    icon={MapPin}
                    value={profile.location}
                    label="Based in"
                    color="emerald"
                    delay={0.8}
                  />
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Creative Visual */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
            <Reveal delay={0.3} variant="fadeScale">
              <TiltCard>

                <Image
                  src={avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-white font-medium text-sm tracking-wide">Open to work</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>


          </div>

        </div>
      </div>



      {/* Resume Modal */}
      <Modal open={isResumeOpen} onClose={() => setIsResumeOpen(false)} className="p-0">
        <ResumeViewer pdfUrl="/resume.pdf" onClose={() => setIsResumeOpen(false)} isMobile={isMobile} />
      </Modal>
    </section>
  );
}
