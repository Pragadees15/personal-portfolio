"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { FlowRibbon } from "@/components/motion/FlowRibbon";
import { useEffect, useState } from "react";

export function Background() {
  const { scrollYProgress } = useScroll(); // Already optimized internally by framer-motion
  const reduceMotion = useReducedMotion();
  // Smaller parallax ranges to reduce variability across devices - simplified
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 6 : 16]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? -6 : -16]);

  // Pointer-follow glow (disabled on touch devices) - throttled for performance
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>({ x: 0, y: 0 });
  useEffect(() => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      setPointer(null);
      return;
    }
    let raf = 0;
    let lastUpdate = 0;
    const throttleMs = 50; // Throttle to 20fps for better performance
    
    function onMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        lastUpdate = now;
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
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ position: 'fixed' }}>
      {/* Minimal: hide ribbon unless hyper mode */}
      {!reduceMotion && (
        <div 
          className={typeof window !== "undefined" && document?.documentElement?.dataset?.hyper === "1" ? "relative block" : "hidden"}
          style={{ position: 'relative' }} // Explicit position for Framer Motion useScroll
        >
          <FlowRibbon />
        </div>
      )}
      {/* grid removed as requested */}

      {/* top spotlight - static for better performance */}
      <div className="absolute -top-24 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(600px_300px_at_50%_50%,rgba(99,102,241,0.06),transparent_72%)] blur-2xl dark:bg-[radial-gradient(600px_300px_at_50%_50%,rgba(99,102,241,0.12),transparent_72%)]"
      />

      {/* animated gradient blobs (very subtle) - optimized blur */}
      {!reduceMotion && (
      <motion.div
        initial={{ opacity: 0.0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 32, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{ y: yBlob1, willChange: "transform, opacity" }}
        className="hidden sm:block absolute left-[-10%] top-1/3 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.06),transparent_70%)] blur-2xl transform-gpu will-change-transform dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent_70%)]"
      />
      )}
      {!reduceMotion && (
      <motion.div
        initial={{ opacity: 0.0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 32, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.6 }}
        style={{ y: yBlob2, willChange: "transform, opacity" }}
        className="hidden sm:block absolute right-[-6%] top-[18%] h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.05),transparent_70%)] blur-2xl transform-gpu will-change-transform dark:bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent_70%)]"
      />
      )}

      {/* pointer-follow glow; intensify a bit in hyper mode - optimized */}
      {pointer && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: (typeof window !== "undefined" && document?.documentElement?.dataset?.hyper === "1")
              ? `radial-gradient(240px 240px at ${pointer.x}px ${pointer.y}px, rgba(99,102,241,0.12), transparent 60%)`
              : `radial-gradient(180px 180px at ${pointer.x}px ${pointer.y}px, rgba(99,102,241,0.08), transparent 60%)`,
            mixBlendMode: "screen",
            willChange: "background",
            transform: "translateZ(0)",
          }}
          className="hidden md:block"
        />
      )}
    </div>
  );
}
 
 
