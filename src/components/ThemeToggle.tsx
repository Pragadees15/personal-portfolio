"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleToggle = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      disabled={!mounted}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white dark:bg-zinc-900 shadow-sm transition hover:shadow-md dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed", className)}
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


