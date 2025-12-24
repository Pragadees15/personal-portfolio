"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ children, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("relative mb-16 md:mb-24 pt-10", className)}>
      {/* Abstract Background Elements */}
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -z-10 opacity-0 md:opacity-100 transition-opacity" />

      <div className="flex flex-col items-start gap-3">
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 group"
          >
            <span className="h-[2px] w-6 bg-gradient-to-r from-indigo-500 to-indigo-500/0 rounded-full group-hover:w-10 transition-all duration-300" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-indigo-500/80 dark:text-indigo-400 font-mono">
              {subtitle}
            </span>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 break-words max-w-full"
        >
          {/* Text Content */}
          <span className="relative z-10 inline-block bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500">
            {children}
          </span>

          {/* Decorative Dot */}
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}
            className="inline-block ml-1 w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-500 align-baseline mb-1 md:mb-2"
          />
        </motion.h2>
      </div>
    </div>
  );
}

export function SectionSubHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h3
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={cn("text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2", className)}
    >
      {children}
    </motion.h3>
  );
}
