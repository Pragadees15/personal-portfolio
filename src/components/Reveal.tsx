"use client";

import { motion, type MotionStyle, useInView } from "framer-motion";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  variant?: "fadeUp" | "fadeScale";
};

export function Reveal({ children, delay = 0, className, style, variant = "fadeUp" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={variant === "fadeScale" ? { opacity: 0, scale: 0.96 } : { opacity: 0, y: 16 }}
      animate={inView ? (variant === "fadeScale" ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }) : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


