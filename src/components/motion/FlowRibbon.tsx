"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";

export function FlowRibbon() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  // Base horizontal drift across the whole page
  const baseX = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? -80 : -240]);
  // React to instantaneous scroll speed for that "flow" feel
  const v = useVelocity(scrollYProgress);
  const smoothV = useSpring(v, { stiffness: 60, damping: 24, mass: 0.5 });
  const velocityX = useTransform(smoothV, (vv) => vv * (reduceMotion ? 60 : 140));
  const velocityRot = useTransform(smoothV, (vv) => vv * (reduceMotion ? 2 : 6));

  // Two layers moving at slightly different speeds
  const layer1X = useTransform([baseX, velocityX], ([b, vx]: number[]) => b + vx * 0.6);
  const layer2X = useTransform([baseX, velocityX], ([b, vx]: number[]) => b * 1.2 + vx * 0.3);

  return (
    <div aria-hidden className="pointer-events-none relative hidden lg:block">
      <motion.div
        style={{ x: layer1X, rotate: velocityRot, willChange: "transform" }}
        transition={{ type: "spring", stiffness: 50, damping: 24 }}
        className="absolute left-[-30%] top-[20%] h-[220px] w-[1100px] -translate-y-1/2 rounded-[999px] bg-[linear-gradient(90deg,rgba(99,102,241,0.10),rgba(139,92,246,0.10),rgba(99,102,241,0.10))] blur-3xl dark:bg-[linear-gradient(90deg,rgba(99,102,241,0.16),rgba(139,92,246,0.16),rgba(99,102,241,0.16))]"
      />
      <motion.div
        style={{ x: layer2X, rotate: velocityRot, willChange: "transform" }}
        transition={{ type: "spring", stiffness: 50, damping: 24 }}
        className="absolute right-[-30%] bottom-[10%] h-[200px] w-[1100px] rounded-[999px] bg-[linear-gradient(90deg,rgba(99,102,241,0.18),rgba(56,189,248,0.16),rgba(99,102,241,0.18))] blur-3xl dark:bg-[linear-gradient(90deg,rgba(99,102,241,0.26),rgba(56,189,248,0.24),rgba(99,102,241,0.26))]"
      />
    </div>
  );
}


