"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { FlowRibbon } from "@/components/motion/FlowRibbon";
import { useEffect, useState } from "react";

export function Background() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  // Smaller parallax ranges to reduce variability across devices
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 8 : 24]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? -8 : -24]);
  const yBlob3 = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 6 : 20]);

  // Pointer-follow glow (disabled on touch devices)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>({ x: 0, y: 0 });
  useEffect(() => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      setPointer(null);
      return;
    }
    let raf = 0;
    function onMove(e: MouseEvent) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPointer({ x: e.clientX, y: e.clientY });
      });
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Minimal: hide ribbon unless hyper mode */}
      {!reduceMotion && (
        <div className={typeof window !== "undefined" && document?.documentElement?.dataset?.hyper === "1" ? "relative block" : "hidden"}>
          <FlowRibbon />
        </div>
      )}
      {/* grid removed as requested */}

      {/* top spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute -top-24 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(600px_300px_at_50%_50%,rgba(99,102,241,0.06),transparent_72%)] blur-3xl dark:bg-[radial-gradient(600px_300px_at_50%_50%,rgba(99,102,241,0.12),transparent_72%)]"
      />

      {/* animated gradient blobs (very subtle) */}
      {!reduceMotion && (
      <motion.div
        initial={{ opacity: 0.0, x: -60, y: -40 }}
        animate={{ opacity: 0.18, x: 24, y: 12 }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{ y: yBlob1, willChange: "transform" }}
        className="hidden sm:block absolute left-[-10%] top-1/3 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.06),transparent_70%)] blur-3xl transform-gpu will-change-transform dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent_70%)]"
      />
      )}
      {!reduceMotion && (
      <motion.div
        initial={{ opacity: 0.0, x: 50, y: 30 }}
        animate={{ opacity: 0.16, x: -20, y: -14 }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.2 }}
        style={{ y: yBlob2, willChange: "transform" }}
        className="hidden sm:block absolute right-[-6%] top-[18%] h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.05),transparent_70%)] blur-3xl transform-gpu will-change-transform dark:bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent_70%)]"
      />
      )}
      {!reduceMotion && (
      <motion.div
        initial={{ opacity: 0.0, x: 0, y: 40 }}
        animate={{ opacity: 0.14, x: 0, y: -12 }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2.4 }}
        style={{ y: yBlob3, willChange: "transform" }}
        className="hidden sm:block absolute left-1/3 bottom-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(109,40,217,0.04),transparent_70%)] blur-3xl transform-gpu will-change-transform dark:bg-[radial-gradient(closest-side,rgba(109,40,217,0.08),transparent_70%)]"
      />
      )}

      {/* pointer-follow glow; intensify a bit in hyper mode */}
      {pointer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: (typeof window !== "undefined" && document?.documentElement?.dataset?.hyper === "1") ? 1 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: (typeof window !== "undefined" && document?.documentElement?.dataset?.hyper === "1")
              ? `radial-gradient(240px 240px at ${pointer.x}px ${pointer.y}px, rgba(99,102,241,0.16), transparent 60%)`
              : `radial-gradient(200px 200px at ${pointer.x}px ${pointer.y}px, rgba(99,102,241,0.10), transparent 60%)`,
            mixBlendMode: "screen",
          }}
          className="hidden md:block"
        />
      )}
    </div>
  );
}
 
 
