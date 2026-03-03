"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

export function Background() {
  const reduceMotion = useReducedMotion();
  const [enableThree, setEnableThree] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;

    const mediaQuery = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = (event: MediaQueryList | MediaQueryListEvent) => {
      setEnableThree(event.matches);
    };

    update(mediaQuery);
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [reduceMotion]);

  return (
    <>
      {/* React Three Fiber 3D Background */}
      {!reduceMotion && enableThree && <ThreeBackground />}
    </>
  );
}
