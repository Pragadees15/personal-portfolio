"use client";

import { isMobileDevice } from "@/lib/utils";
import { motion, type MotionStyle, useInView, useReducedMotion } from "framer-motion";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  variant?: "fadeUp" | "fadeScale";
};

export function Reveal({ children, delay = 0, className, style, variant = "fadeUp" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" }); // Larger margin for earlier trigger
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    setIsMobile(isMobileDevice());
  }, []);

  const shouldDisable = hasHydrated ? prefersReducedMotion || isMobile : false;
  const initialState = variant === "fadeScale" ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: 12 };
  const animatedState = variant === "fadeScale" ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };
  const resolvedAnimate = hasHydrated && inView ? animatedState : initialState;

  if (shouldDisable) {
    return (
      <div ref={ref} className={className} style={style as CSSProperties | undefined}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={resolvedAnimate}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


