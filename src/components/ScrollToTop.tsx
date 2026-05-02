"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-5 right-5 z-[70] inline-flex h-11 w-11 items-center justify-center",
        "rounded-full border border-foreground/15 bg-background/80 backdrop-blur-md text-foreground",
        "shadow-[0_2px_24px_-8px_rgba(0,0,0,0.18)]",
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
        "hover:bg-foreground hover:text-background hover:border-foreground",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
