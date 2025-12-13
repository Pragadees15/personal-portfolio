"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/motion/Marquee";
import { useState } from "react";

type Logo = { alt: string; kind: "mask" | "img"; src: string | string[] };

const logos: Logo[] = [
  { kind: "mask", alt: "AWS", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg" },
  { kind: "mask", alt: "Oracle", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg" },
  {
    kind: "img",
    alt: "NPTEL",
    src: "/logos/nptel.jpeg"
  },
  {
    kind: "img",
    alt: "SRMIST",
    src: "/logos/SRM.png"
  },
  { kind: "mask", alt: "Vercel", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg" },
  { kind: "mask", alt: "GitHub", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg" },
];

function MaskLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className="block h-8 w-8 sm:h-10 sm:w-10"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "currentColor",
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
      <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300">
        <span className="text-xs font-semibold">{alt.slice(0, 2)}</span>
      </div>
    );
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      width={40}
      height={40}
      loading="lazy"
      className="h-8 w-8 sm:h-10 sm:w-10 object-contain dark:invert"
      onError={() => {
        if (index + 1 < sources.length) {
          setIndex(index + 1);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

export default function SocialProof() {
  return (
    <section className="site-container py-12 sm:py-16 md:py-20">
      <SectionHeading subtitle="Places, platforms and programs">Social Proof</SectionHeading>
      <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-lg dark:border-white/10 dark:bg-zinc-900/60">
        <Marquee
          items={logos.map((l) => (
            <span key={l.alt} className="inline-flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-200">
              {l.kind === "mask" ? (
                <MaskLogo src={l.src as string} alt={l.alt} />
              ) : (
                <ImageLogo src={l.src} alt={l.alt} />
              )}
              <span className="text-sm sm:text-base">{l.alt}</span>
            </span>
          ))}
        />
      </div>
    </section>
  );
}


