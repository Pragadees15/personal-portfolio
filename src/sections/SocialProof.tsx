"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/motion/Marquee";
type Logo = { alt: string; kind: "mask" | "img"; src: string };
const logos: Logo[] = [
  { kind: "mask", alt: "AWS", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg" },
  { kind: "mask", alt: "Oracle", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg" },
  { kind: "img", alt: "NPTEL", src: "https://logo.clearbit.com/nptel.ac.in" },
  { kind: "img", alt: "SRMIST", src: "https://logo.clearbit.com/srmist.edu.in" },
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

export default function SocialProof() {
  return (
    <section className="site-container py-12 sm:py-16 md:py-20">
      <SectionHeading subtitle="Places, platforms and programs">Social Proof</SectionHeading>
      <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-lg dark:border-white/10 dark:bg-zinc-900/60">
        <Marquee
          items={logos.map((l) => (
            <span key={l.alt} className="inline-flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-200">
              {l.kind === "mask" ? (
                <MaskLogo src={l.src} alt={l.alt} />
              ) : (
                <img
                  src={l.src}
                  alt={l.alt}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain dark:invert"
                />
              )}
              <span className="text-sm sm:text-base">{l.alt}</span>
            </span>
          ))}
        />
      </div>
    </section>
  );
}


