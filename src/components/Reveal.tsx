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

  // Avoid opacity/position jumps between server and client, especially on mobile.
  // On the very first render (before hydration), render elements in their final
  // "visible" state so there is no flash when React hydrates or when we decide
  // to disable animations on mobile.
  const baseInitialState =
    variant === "fadeScale" ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: 12 };
  const animatedState =
    variant === "fadeScale" ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };

  const isPreHydration = !hasHydrated;
  const initialState = isPreHydration ? animatedState : baseInitialState;
  const resolvedAnimate =
    isPreHydration || (hasHydrated && inView) ? animatedState : initialState;

  // Always render the same element type to avoid React swapping
  // between <motion.div> and <div>, which can cause flicker on mobile.
  const motionProps = shouldDisable
    ? {
      initial: animatedState,
      animate: animatedState,
      transition: { duration: 0, delay: 0 },
    }
    : {
      initial: initialState,
      animate: resolvedAnimate,
      // Use a simple transition without custom ease to avoid Framer Motion
      // typing incompatibilities between versions.
      transition: { duration: 0.5, delay },
    };

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


