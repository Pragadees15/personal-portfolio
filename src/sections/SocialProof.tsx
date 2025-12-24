"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useRef, MouseEvent } from "react";

type Logo = { alt: string; kind: "mask" | "img"; src: string | string[] };

const logos: Logo[] = [
  { kind: "mask", alt: "AWS", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg" },
  { kind: "mask", alt: "Oracle", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg" },
  { kind: "img", alt: "NPTEL", src: "/logos/nptel.jpeg" },
  { kind: "img", alt: "SRMIST", src: "/logos/SRM.png" },
  { kind: "mask", alt: "Vercel", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg" },
  { kind: "mask", alt: "GitHub", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg" },
];

function MaskLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className="block h-full w-full bg-zinc-400/80 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-zinc-500/80 dark:group-hover:bg-indigo-400"
      style={{
        maskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

function ImageLogo({ src, alt }: { src: string | string[]; alt: string }) {
  const sources = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (hasError || index >= sources.length) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
        <span className="text-xs font-bold">{alt.substring(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:invert-[.85] dark:group-hover:invert-0"
      onError={() => {
        if (index + 1 < sources.length) setIndex(index + 1);
        else setHasError(true);
      }}
    />
  );
}

function SpotlightCard({ logo }: { logo: Logo }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-24 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:h-32 sm:w-56"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.1), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.4), transparent 40%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-10 w-10 sm:h-14 sm:w-14 transition-transform duration-300 group-hover:scale-110">
        {logo.kind === "mask" ? (
          <MaskLogo src={logo.src as string} alt={logo.alt} />
        ) : (
          <ImageLogo src={logo.src} alt={logo.alt} />
        )}
      </div>
    </div>
  );
}

function MovingRow({ items, direction = "left", speed = 20 }: { items: Logo[]; direction?: "left" | "right"; speed?: number }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {items.map((logo, i) => (
          <SpotlightCard key={`${logo.alt}-${i}`} logo={logo} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-4 sm:gap-6 pr-4 sm:pr-6"
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
          repeatType: "loop",
        }}
      >
        {[...items, ...items, ...items, ...items].map((logo, i) => (
          <SpotlightCard key={`${logo.alt}-${i}`} logo={logo} />
        ))}
      </motion.div>
    </div>
  );
}

export default function SocialProof() {
  const row1 = logos;
  const row2 = [...logos].reverse();

  return (
    <section className="site-container relative overflow-hidden py-24 sm:py-32">

      <SectionHeading subtitle="Trusted by and learned from top institutions">
        Social Proof
      </SectionHeading>

      <div className="mt-12 flex flex-col gap-6 sm:mt-20 sm:gap-8">
        <MovingRow items={row1} direction="left" speed={40} />
        <MovingRow items={row2} direction="right" speed={45} />
      </div>
    </section>
  );
}
