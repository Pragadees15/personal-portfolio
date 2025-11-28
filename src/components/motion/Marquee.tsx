"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  durationSec?: number;
};

export function Marquee({ items, durationSec = 18 }: Props) {
  return (
    <div className="overflow-hidden rounded-full border border-zinc-200/70 bg-white/60 py-2 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">
      <div className="relative">
        <motion.div
          className="flex min-w-max gap-6 px-4 text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: durationSec, ease: "linear" }}
        >
          {[...items, ...items].map((t, i) => (
            <span key={i} className="whitespace-nowrap flex items-center">{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


