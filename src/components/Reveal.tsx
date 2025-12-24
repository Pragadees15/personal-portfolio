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

export function Reveal({ children, className, style }: Props) {
  return (
    <div className={className} style={style as React.CSSProperties}>
      {children}
    </div>
  );
}


