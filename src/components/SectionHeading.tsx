"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  subtitle?: string;
};

export function SectionHeading({ children, subtitle }: Props) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12 group">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        {children}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400"
        >
          {subtitle}
        </motion.p>
      ) : null}
      <div className="mt-4 sm:mt-5 h-px w-full bg-zinc-200 dark:bg-white/10" />
    </div>
  );
}


