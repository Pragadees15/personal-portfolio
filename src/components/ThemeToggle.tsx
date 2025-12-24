"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    if (isToggling || !mounted) return;

    setIsToggling(true);
    const isDark = (theme ?? resolvedTheme) === "dark";
    setTheme(isDark ? "light" : "dark");

    // Reset toggle lock after a short delay
    setTimeout(() => {
      setIsToggling(false);
    }, 300);
  };

  const isDark = mounted && (theme ?? resolvedTheme) === "dark";

  return (
    <button
      aria-label="Toggle theme"
      disabled={!mounted || isToggling}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background/60 backdrop-blur-md shadow-sm transition hover:shadow-md dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed", className)}
      onClick={handleToggle}
    >
      {!mounted ? (
        <div className="h-5 w-5" />
      ) : isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}


