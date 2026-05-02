"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
/* eslint-disable @next/next/no-img-element */

type Logo = {
  alt: string;
  /** "mask" = monochrome SVG painted with currentColor (great for both themes).
   *  "plate" = raster/full-color logo on a forced-white plate (legible on any bg). */
  kind: "mask" | "plate";
  src: string | string[];
};

const logos: Logo[] = [
  {
    kind: "mask",
    alt: "AWS",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg",
  },
  {
    kind: "mask",
    alt: "Oracle",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg",
  },
  { kind: "plate", alt: "NPTEL", src: "/logos/nptel.jpeg" },
  { kind: "plate", alt: "SRMIST", src: "/logos/SRM.png" },
  {
    kind: "mask",
    alt: "Vercel",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg",
  },
  {
    kind: "mask",
    alt: "GitHub",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg",
  },
  {
    kind: "mask",
    alt: "Google",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg",
  },
];

function MaskLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className="icon-mask block h-9 w-9 sm:h-10 sm:w-10 text-foreground/65 transition-colors duration-300 group-hover:text-foreground"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  );
}

function PlateLogo({ src, alt }: { src: string | string[]; alt: string }) {
  const sources = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  return (
    <span
      className={cn(
        "logo-plate inline-flex h-12 w-14 sm:h-12 sm:w-16 items-center justify-center overflow-hidden rounded-md p-1.5",
        "transition-transform duration-300 group-hover:-translate-y-0.5",
      )}
    >
      {hasError || index >= sources.length ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
          {alt}
        </span>
      ) : (
        <img
          src={sources[index]}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => {
            if (index + 1 < sources.length) setIndex(index + 1);
            else setHasError(true);
          }}
        />
      )}
    </span>
  );
}

export default function SocialProof() {
  return (
    <section className="relative">
      <div className="site-container">
        <div className="rule-h" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8 py-12 lg:py-16 items-center">
          <div className="lg:col-span-3 flex flex-col gap-2">
            <span className="section-label">/ Affiliations & trust</span>
            <p className="font-display italic text-2xl leading-tight">
              Programs &amp;
              <br />
              institutions
            </p>
          </div>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-y-8 gap-x-6 items-center justify-items-center">
              {logos.map((logo) => (
                <div
                  key={logo.alt}
                  className="group flex items-center justify-center"
                  title={logo.alt}
                >
                  {logo.kind === "mask" ? (
                    <MaskLogo src={logo.src as string} alt={logo.alt} />
                  ) : (
                    <PlateLogo src={logo.src} alt={logo.alt} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rule-h" />
      </div>
    </section>
  );
}
