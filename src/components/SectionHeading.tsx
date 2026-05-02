"use client";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: React.ReactNode;
  subtitle?: string;
  number?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Editorial section heading.
 *
 * Layout: hairline rule → numbered label + eyebrow → display serif headline.
 * Uses CSS-only entrance animations (no observers, no framer overhead) so
 * stacking many sections stays cheap.
 */
export function SectionHeading({
  children,
  subtitle,
  number,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("relative mb-12 md:mb-16", className)}>
      <div className="rule-h" />

      <div
        className={cn(
          "mt-6 flex flex-col gap-6 reveal-stagger",
          align === "center" && "items-center text-center",
        )}
      >
        <div
          className={cn(
            "flex w-full items-baseline justify-between gap-4",
            align === "center" && "justify-center",
          )}
        >
          <div className="flex items-baseline gap-3">
            {number && (
              <span className="section-number tabular-nums">{number}</span>
            )}
            {subtitle && <span className="section-label">/ {subtitle}</span>}
          </div>
          {align === "left" && number && (
            <span className="section-number text-muted-foreground/60 tabular-nums hidden sm:inline">
              §
            </span>
          )}
        </div>

        <h2
          className={cn(
            "display-serif text-balance",
            "text-[clamp(2.25rem,5.4vw,5rem)] leading-[0.96]",
            align === "center" && "max-w-3xl mx-auto",
          )}
        >
          {children}
        </h2>
      </div>
    </header>
  );
}

export function SectionSubHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "display-serif text-2xl md:text-3xl text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}
