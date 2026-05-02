"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "fadeScale";
};

/**
 * Lightweight reveal — uses pure CSS animation. Mounts immediately and lets
 * the browser handle entry without IntersectionObserver bookkeeping.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
