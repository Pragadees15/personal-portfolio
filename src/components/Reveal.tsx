"use client";

import type { MotionStyle } from "framer-motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  variant?: "fadeUp" | "fadeScale";
};

export function Reveal({ children, className, style }: Props) {
  return (
    <div className={className} style={style as React.CSSProperties}>
      {children}
    </div>
  );
}


