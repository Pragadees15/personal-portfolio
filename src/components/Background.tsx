"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

export function Background() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* React Three Fiber 3D Background */}
      {!reduceMotion && <ThreeBackground />}
    </>
  );
}
