"use client";

import { Code, Brain, Wrench, Cloud, Database, Sparkles } from "lucide-react";
import { skillsGrouped } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { useState } from "react";

const iconMap: Record<string, typeof Code> = {
  languages: Code,
  aiMl: Brain,
  cloudDevops: Cloud,
  dataScience: Database,
};

export function Skills() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  return (
    <section id="skills" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Tools and technologies I use">Skills</SectionHeading>
      <div className="grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(skillsGrouped).map(([group, items], gi) => {
          const Icon = iconMap[group] || Wrench;
          const isHovered = hoveredGroup === group;
          
          return (
            <Reveal key={group} delay={gi * 0.05}>
              <motion.div
                onHoverStart={() => setHoveredGroup(group)}
                onHoverEnd={() => setHoveredGroup(null)}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <div className="relative h-full rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:border-indigo-300/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 group overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 pointer-events-none"
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-fuchsia-100 p-2 shadow-sm dark:from-indigo-950/40 dark:to-fuchsia-950/40">
                        <Icon className={`h-4 w-4 transition-colors ${isHovered ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                        {group.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {items.map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: gi * 0.05 + i * 0.03, duration: 0.3 }}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          className="relative rounded-full border border-zinc-200/70 bg-white/90 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    initial={{ x: '-100%', rotate: -45 }}
                    animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    style={{ width: '50%', height: '100%' }}
                  />
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
      
      {/* Additional visual element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400 inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Continuously learning and exploring new technologies
        </p>
      </motion.div>
    </section>
  );
}


