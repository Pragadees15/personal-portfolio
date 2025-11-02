"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/resume";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";

export function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Reading progress bar - throttled for performance
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const h = document.documentElement;
          const docHeight = h.scrollHeight - h.clientHeight;
          const y = h.scrollTop;
          const p = docHeight > 0 ? Math.min(100, Math.max(0, (y / docHeight) * 100)) : 0;
          setProgress(p);
          ticking = false;
        });
        ticking = true;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "about",
      "interests",
      "skills",
      "education",
      "experience",
      "projects",
      "certifications",
      "honors",
      "leadership",
      "contact",
    ];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.5, 1] } // Reduced thresholds for better performance
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full">
      {/* reading progress */}
      <div aria-hidden className="absolute left-0 right-0 top-0 h-0.5">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-[width] duration-150 ease-out"
        />
      </div>
      <div className="site-container py-3 sm:py-4">
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-transparent to-fuchsia-500/30 dark:from-indigo-400/20 dark:via-transparent dark:to-fuchsia-400/20">
          <div className="flex items-center justify-between rounded-[calc(1rem-1px)] border border-zinc-200/70 bg-white/70 px-2 sm:px-4 py-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Link href="#" className="text-xs sm:text-sm font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-fuchsia-700 dark:from-indigo-300 dark:to-fuchsia-300 truncate">
                {profile.name}
              </Link>
              {profile.role && (
                <span className="hidden items-center gap-1 rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-[9px] sm:text-[10px] text-zinc-700 md:inline-flex dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                  {profile.role}
                </span>
              )}
            <a
              href="https://drive.google.com/file/d/1qblXImKORbM32TFAvQnMRZd7dE8kxsFB/view?usp=drive_link"
              className="hidden sm:inline-flex rounded-md border border-zinc-200/70 bg-white/60 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 whitespace-nowrap"
              target="_blank" rel="noreferrer"
            >
              Resume
            </a>
            </div>
            <nav className="hidden items-center gap-1 sm:flex">
              {[
                ["about", "About"],
                ["interests", "Interests"],
                ["skills", "Skills"],
                ["education", "Education"],
                ["experience", "Experience"],
                ["projects", "Projects"],
                ["certifications", "Certifications"],
                ["honors", "Honors"],
                ["leadership", "Leadership"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300 " +
                    (activeId === id
                      ? "bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300 dark:ring-indigo-500/30 scale-105"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/50 hover:scale-105 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50")
                  }
                >
                  {label}
                  {activeId === id && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                  )}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-2 sm:px-2.5 py-1.5 text-xs text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 active:bg-white/90 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:active:bg-zinc-800/80"
                aria-label="Open command palette"
                title="Search (⌘/Ctrl K)"
              >
                <Search className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                <span className="hidden xs:inline sm:inline">Search</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200/70 bg-white/60 p-2 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 active:bg-white/90 sm:hidden dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:active:bg-zinc-800/80"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      {/* mobile nav */}
      {mobileOpen && (
        <>
          {/* Backdrop - click anywhere to close */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div id="mobile-nav" className="site-container -mt-2 pb-3 sm:hidden relative z-50">
            <div className="rounded-xl border border-zinc-200/70 bg-white/80 p-2 shadow-md backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
              <nav className="grid">
              {[
                ["about", "About"],
                ["interests", "Interests"],
                ["skills", "Skills"],
                ["education", "Education"],
                ["experience", "Experience"],
                ["projects", "Projects"],
                ["certifications", "Certifications"],
                ["honors", "Honors"],
                ["leadership", "Leadership"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMobileOpen(false)}
                  className={
                    "rounded-md px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 " +
                    (activeId === id ? "bg-zinc-900/5 dark:bg-white/5" : "")
                  }
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new Event("open-command-palette"));
                }}
                className="mt-1 inline-flex items-center justify-between rounded-md px-3 py-2 text-left text-sm text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Open command palette"
              >
                <span>Search</span>
                <Search className="h-3.5 w-3.5" />
              </button>
            </nav>
          </div>
        </div>
        </>
      )}
      {/* Command palette is mounted globally in layout */}
    </header>
  );
}


