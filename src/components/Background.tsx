"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

export function Background() {
  const reduceMotion = useReducedMotion();

  const glowRef = useRef<HTMLDivElement>(null);
  const [hyperMode, setHyperMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const updateHyper = () => setHyperMode(root.dataset.hyper === "1");
    updateHyper();
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "data-hyper")) updateHyper();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-hyper"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only enable on non-touch devices
    if (matchMedia("(pointer: coarse)").matches) return;

    function onMove(e: MouseEvent) {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* React Three Fiber 3D Background */}
      {!reduceMotion && <ThreeBackground />}

      {/* Overlay effects layer */}
      <div aria-hidden className="pointer-events-none fixed top-0 left-0 w-full h-[100lvh] -z-10">
        {/* top spotlight */}
        <div className="hidden md:block absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.04),transparent)] dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),transparent)]"
        />

        {/* Optimized pointer-follow glow using transform */}
        <div
          ref={glowRef}
          className="hidden md:block fixed top-0 left-0 w-[500px] h-[500px] -mt-[250px] -ml-[250px] rounded-full pointer-events-none mix-blend-screen will-change-transform"
          style={{
            background: hyperMode
              ? "radial-gradient(closest-side, rgba(99,102,241,0.15), transparent)"
              : "radial-gradient(closest-side, rgba(99,102,241,0.10), transparent)",
            transform: "translate3d(-1000px, -1000px, 0)", // Initially off-screen
          }}
        />
      </div>
    </>
  );
}


