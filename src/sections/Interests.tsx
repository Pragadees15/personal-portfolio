"use client";

import { researchInterests } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Brain, Lightbulb, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const interestIcons = [
  Brain,
  Lightbulb,
  Target,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  Sparkles,
];

export function Interests() {
  return (
    <section id="interests" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Topics I'm actively exploring and researching">Research Interests</SectionHeading>
      
      <div className="mt-8 sm:mt-10">
        {/* Mobile: Simple tag layout */}
        <div className="flex flex-wrap gap-3 sm:hidden">
          {researchInterests.map((interest, i) => (
            <Reveal key={interest} delay={i * 0.03}>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/80 backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-fuchsia-50 hover:shadow-md hover:text-indigo-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-indigo-500/50 dark:hover:from-indigo-950/40 dark:hover:to-fuchsia-950/40 dark:hover:text-indigo-300">
                {interest}
              </span>
            </Reveal>
          ))}
        </div>
        
        {/* Desktop: Card grid layout */}
        <div className="hidden sm:grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {researchInterests.map((interest, i) => {
            const Icon = interestIcons[i % interestIcons.length];
            return (
              <Reveal key={interest} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group relative h-full"
                >
                  <div className="relative h-full rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-fuchsia-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-fuchsia-500/10 group-hover:to-cyan-500/10 transition-all duration-300 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-start gap-4">
                      <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 p-3 shadow-sm dark:from-indigo-950/40 dark:to-fuchsia-950/40">
                        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {interest}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out pointer-events-none" />
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}


