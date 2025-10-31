"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  subtitle?: string;
};

export function SectionHeading({ children, subtitle }: Props) {
  return (
    <div className="mb-6 group">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        {children}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {subtitle}
        </motion.p>
      ) : null}
      <div className="mt-3 h-px w-full bg-zinc-200 dark:bg-white/10" />
    </div>
  );
}


