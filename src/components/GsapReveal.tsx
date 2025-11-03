"use client";

import { useLayoutEffect, useRef } from "react";

type GsapRevealProps = {
  children: React.ReactNode;
  className?: string;
  // Delay before animation starts (seconds)
  delay?: number;
  // Stagger children inside this wrapper (seconds between)
  stagger?: number;
  // Once means it won't reverse when scrolling back up
  once?: boolean;
  // Variant presets
  variant?: "fadeUp" | "fadeScale" | "fadeIn";
};

export function GsapReveal({
  children,
  className,
  delay = 0,
  stagger = 0,
  once = true,
  variant = "fadeUp",
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    let ctx: any;
    let isMounted = true;

    // Dynamically import to avoid type and SSR issues before dependency is installed
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!isMounted) return;

      if (!(gsap as any).core.globals()["ScrollTrigger"]) {
        (gsap as any).registerPlugin(ScrollTrigger);
      }

      const element = ref.current;
      if (!element) return;

      const baseFrom =
        variant === "fadeScale"
          ? { opacity: 0, scale: 0.98 }
          : variant === "fadeIn"
          ? { opacity: 0 }
          : { opacity: 0, y: 16 };

      const baseTo = { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", delay } as any;

      const childItems = Array.from(element.children) as HTMLElement[];
      if (stagger > 0 && childItems.length > 1) {
        ctx = (gsap as any).context(() => {
          (gsap as any).set(childItems, baseFrom);
          (gsap as any).to(childItems, {
            ...baseTo,
            stagger,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: once ? "play none none none" : "play none none reverse",
            },
          });
        }, element);
        return;
      }

      ctx = (gsap as any).context(() => {
        (gsap as any).fromTo(
          element,
          baseFrom,
          {
            ...baseTo,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: once ? "play none none none" : "play none none reverse",
            },
          }
        );
      }, element);
    })();

    return () => {
      isMounted = false;
      if (ctx) ctx.revert();
    };
  }, [delay, once, stagger, variant]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default GsapReveal;


