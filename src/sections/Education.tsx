"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendar, MapPin, School, Sparkles } from "lucide-react";

import { education } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type LogoCandidate = { src: string; alt: string };

function getInstitutionLogoCandidates(name: string): LogoCandidate[] {
  const k = name.toLowerCase();
  if (k.includes("srm")) {
    return [
      { src: "/logos/SRM.png", alt: "SRM Institute of Science and Technology" },
    ];
  }
  if (k.includes("jeeva velu")) {
    return [
      { src: "/logos/jeevavelu.jpg", alt: "Jeeva Velu International School" },
    ];
  }
  if (k.includes("sri siksha kendra")) {
    return [
      {
        src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgfcMB4n-Bg8Q5MSPK57hROjLUsCZ35Y1LSwTnbGLgI4OisDnn-SP41GyKjRjpU0RG4jOIaKE_LnW_gLYuibzdFjEaH2QlSqUUdmZp_UdukBj-GcDz6x9L-iBBaRW2fwTPNV32OXOURTWA/w113-h113/Sri+Siksha+Kendra+International+School+logo.png",
        alt: "Sri Siksha Kendra International School",
      },
    ];
  }
  return [];
}

function InstitutionLogo({ name, size = 56 }: { name: string; size?: number }) {
  const candidates = getInstitutionLogoCandidates(name);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);

  if (exhausted) {
    return (
      <div
        className="logo-plate flex items-center justify-center rounded-md"
        style={{ width: size, height: size }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
          {name.slice(0, 2)}
        </span>
      </div>
    );
  }

  const { src, alt } = candidates[index];
  return (
    <div
      className="logo-plate relative overflow-hidden rounded-md p-2"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
        unoptimized
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1);
          else setExhausted(true);
        }}
      />
    </div>
  );
}

function getGradeInfo(meta?: string) {
  if (!meta) return null;
  const cgpaMatch = meta.match(/CGPA\s*(\d+(\.\d+)?)\/(\d+(\.\d+)?)/i);
  if (cgpaMatch) {
    return { value: cgpaMatch[1], max: cgpaMatch[3], label: "CGPA" };
  }
  const pctMatch = meta.match(/(\d+(\.\d+)?)%/);
  if (pctMatch) {
    return { value: pctMatch[1], max: "100", label: "Score" };
  }
  return null;
}

function EducationRow({
  item,
  index,
  isLast,
}: {
  item: (typeof education)[0];
  index: number;
  isLast: boolean;
}) {
  const grade = getGradeInfo(item.meta);
  const isPursuing = item.meta?.toLowerCase().includes("expected");

  return (
    <article
      className={cn(
        "grid grid-cols-1 sm:grid-cols-12 gap-x-6 gap-y-4 py-8 sm:py-10",
        !isLast && "border-b border-foreground/10",
      )}
    >
      <div className="sm:col-span-1 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
          0{index + 1}
        </span>
        {isPursuing && (
          <span className="status-dot animate-pulse-soft sm:mt-2" />
        )}
      </div>

      <div className="sm:col-span-7 flex items-start gap-5">
        <InstitutionLogo name={item.institution} size={64} />
        <div className="flex-1">
          <h3 className="font-display text-2xl sm:text-3xl leading-tight">
            <span className="italic">{item.degree}</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <School className="h-3.5 w-3.5" />
              {item.institution}
            </span>
            {item.location && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </span>
              </>
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip-mono">
              <Calendar className="h-3 w-3" />
              {item.meta?.includes("Expected")
                ? "2022 — 2026"
                : item.meta?.match(/\b20\d{2}\b/)?.[0] || "Present"}
            </span>
            {isPursuing && (
              <span className="chip-mono text-foreground border-foreground/40">
                <Sparkles className="h-3 w-3" />
                Currently pursuing
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="sm:col-span-4 flex items-end justify-start sm:justify-end">
        {grade ? (
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl sm:text-7xl tabular-nums leading-none">
              {grade.value}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                / {grade.max}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {grade.label}
              </span>
            </div>
          </div>
        ) : (
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.16em]">
            Completed
          </span>
        )}
      </div>
    </article>
  );
}

export function Education() {
  return (
    <section
      id="education"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="04" subtitle="Education — Academic foundation">
        Where I learned to <em className="italic">think</em>.
      </SectionHeading>

      <div className="border-t border-foreground/10">
        {education.map((item, index) => (
          <EducationRow
            key={item.degree}
            item={item}
            index={index}
            isLast={index === education.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
