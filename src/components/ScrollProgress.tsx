"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}


