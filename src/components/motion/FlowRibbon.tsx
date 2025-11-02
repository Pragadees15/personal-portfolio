"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export function FlowRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use window/document scroll explicitly by not providing a target
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  // Base horizontal drift across the whole page - reduced for performance
  const baseX = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? -60 : -180]);
  // React to instantaneous scroll speed for that "flow" feel - optimized
  const v = useVelocity(scrollYProgress);
  const smoothV = useSpring(v, { stiffness: 40, damping: 30, mass: 0.6 }); // Lower stiffness for smoother, less CPU
  const velocityX = useTransform(smoothV, (vv) => vv * (reduceMotion ? 40 : 100)); // Reduced multiplier
  const velocityRot = useTransform(smoothV, (vv) => vv * (reduceMotion ? 1.5 : 4)); // Reduced rotation

  // Two layers moving at slightly different speeds
  const layer1X = useTransform([baseX, velocityX], ([b, vx]: number[]) => b + vx * 0.6);
  const layer2X = useTransform([baseX, velocityX], ([b, vx]: number[]) => b * 1.2 + vx * 0.3);

  // Ensure container and document root have explicit positioning before useScroll measures
  useEffect(() => {
    if (containerRef.current) {
      const style = window.getComputedStyle(containerRef.current);
      if (style.position === 'static') {
        containerRef.current.style.position = 'relative';
      }
    }
    // Ensure document root has positioning for window scroll tracking
    if (typeof document !== 'undefined') {
      const htmlStyle = window.getComputedStyle(document.documentElement);
      if (htmlStyle.position === 'static') {
        document.documentElement.style.setProperty('position', 'relative', 'important');
      }
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.position === 'static') {
        document.body.style.setProperty('position', 'relative', 'important');
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      aria-hidden 
      className="pointer-events-none relative hidden lg:block"
      style={{ position: 'relative' }} // Explicit position for Framer Motion useScroll
    >
      <motion.div
        style={{ x: layer1X, rotate: velocityRot, willChange: "transform" }}
        transition={{ type: "spring", stiffness: 50, damping: 24 }}
        className="absolute left-[-30%] top-[20%] h-[220px] w-[1100px] -translate-y-1/2 rounded-[999px] bg-[linear-gradient(90deg,rgba(99,102,241,0.10),rgba(139,92,246,0.10),rgba(99,102,241,0.10))] blur-2xl transform-gpu dark:bg-[linear-gradient(90deg,rgba(99,102,241,0.16),rgba(139,92,246,0.16),rgba(99,102,241,0.16))]"
      />
      <motion.div
        style={{ x: layer2X, rotate: velocityRot, willChange: "transform" }}
        transition={{ type: "spring", stiffness: 50, damping: 24 }}
        className="absolute right-[-30%] bottom-[10%] h-[200px] w-[1100px] rounded-[999px] bg-[linear-gradient(90deg,rgba(99,102,241,0.18),rgba(56,189,248,0.16),rgba(99,102,241,0.18))] blur-2xl transform-gpu dark:bg-[linear-gradient(90deg,rgba(99,102,241,0.26),rgba(56,189,248,0.24),rgba(99,102,241,0.26))]"
      />
    </div>
  );
}


