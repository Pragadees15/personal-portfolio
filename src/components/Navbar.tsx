"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/resume";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const firstDesktopItemRef = useRef<HTMLAnchorElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navItems: [string, string][] = [
    ["hero", "Home"],
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
  ];
  // Track scroll state for navbar styling - throttled for performance
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = document.documentElement.scrollTop;
          setScrolled(y > 8);
          ticking = false;
        });
        ticking = true;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdown on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (desktopOpen && desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDesktopOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [desktopOpen]);

  // Focus first item when desktop menu opens
  useEffect(() => {
    if (desktopOpen) {
      requestAnimationFrame(() => firstDesktopItemRef.current?.focus());
    }
  }, [desktopOpen]);

  const activeLabel = (() => {
    const map = new Map(navItems);
    if (activeId && map.has(activeId)) return map.get(activeId)!;
    return "Navigate";
  })();

  useEffect(() => {
    const sectionIds = [
      "hero",
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

    let rafId: number | null = null;
    let lastActiveId: string | null = null;

    // Helper function to determine active section based on scroll position
    const getActiveSection = (): string => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // If at the very top, hero is active
      if (scrollY < 50) {
        return "hero";
      }

      // Find the section that's most visible in the viewport
      let activeSection = sectionIds[0];
      let maxScore = -Infinity;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        // Skip if section is completely above or below viewport
        if (rect.bottom < 0 || rect.top > windowHeight) {
          continue;
        }

        // Calculate visibility score
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / Math.max(rect.height, 1);

        // Score based on:
        // 1. How much is visible (0-1)
        // 2. How close to top of viewport (prefer sections near top)
        // 3. Prefer sections that are at least partially in upper viewport
        const distanceFromTop = Math.max(0, rect.top);
        const score = visibilityRatio * 100 - distanceFromTop * 0.1;

        // Prefer sections in the upper portion of viewport
        if (rect.top <= windowHeight * 0.4 && score > maxScore) {
          maxScore = score;
          activeSection = section.id;
        }
      }

      return activeSection;
    };

    // Initial check
    const initialActive = getActiveSection();
    setActiveId(initialActive);
    lastActiveId = initialActive;

    const io = new IntersectionObserver(
      (entries) => {
        // Cancel any pending scroll-based updates
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        // Find all intersecting sections
        const intersecting = entries.filter((e) => e.isIntersecting);

        if (intersecting.length === 0) {
          // No sections intersecting, use scroll-based detection
          rafId = requestAnimationFrame(() => {
            const active = getActiveSection();
            if (active !== lastActiveId) {
              setActiveId(active);
              lastActiveId = active;
            }
            rafId = null;
          });
          return;
        }

        // Sort by position in viewport (top to bottom) and intersection ratio
        const sorted = intersecting.sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;

          // If both are in upper viewport, prefer the one with more intersection
          if (aTop >= 0 && aTop < window.innerHeight * 0.4 &&
            bTop >= 0 && bTop < window.innerHeight * 0.4) {
            return b.intersectionRatio - a.intersectionRatio;
          }

          // Otherwise prefer the one closer to top
          return aTop - bTop;
        });

        const newActiveId = sorted[0]?.target?.id;
        if (newActiveId && newActiveId !== lastActiveId) {
          setActiveId(newActiveId);
          lastActiveId = newActiveId;
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach((el) => io.observe(el));

    // Throttled scroll handler as fallback (only when IntersectionObserver doesn't fire)
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          const active = getActiveSection();
          if (active !== lastActiveId) {
            setActiveId(active);
            lastActiveId = active;
          }
          isScrolling = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      io.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full">
      <div className="site-container py-3 sm:py-4">
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-transparent to-fuchsia-500/30 dark:from-indigo-400/20 dark:via-transparent dark:to-fuchsia-400/20">
          <div className={`flex items-center justify-between rounded-[calc(1rem-1px)] border border-zinc-200/70 px-2 sm:px-4 py-2.5 sm:py-3 backdrop-blur-md dark:border-white/10 ${scrolled ? "bg-white/90 shadow-md dark:bg-zinc-950/70" : "bg-white/80 shadow-sm dark:bg-zinc-950/50"}`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="#" className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-fuchsia-700 dark:from-indigo-300 dark:to-fuchsia-300 truncate">
                {profile.name}
              </Link>
              {profile.role && (
                <span className="hidden items-center gap-1 rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-[9px] sm:text-[10px] text-zinc-700 md:inline-flex dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                  {profile.role}
                </span>
              )}
            </div>
            <div className="flex-1" />
            {/* desktop dropdown menu */}
            <div
              ref={desktopMenuRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                onClick={() => setDesktopOpen((v) => !v)}
                onBlur={(e) => {
                  // close if focus leaves the dropdown container
                  if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                    setDesktopOpen(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                aria-haspopup="menu"
                aria-expanded={desktopOpen}
                aria-controls="desktop-dropdown"
              >
                {activeLabel}
                <ChevronDown className={`h-4 w-4 transition-transform ${desktopOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              {desktopOpen && (
                <div
                  role="menu"
                  tabIndex={-1}
                  id="desktop-dropdown"
                  className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-zinc-200/70 bg-white/95 p-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/80"
                >
                  <nav className="grid gap-1">
                    {navItems.map(([id, label], idx) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        ref={idx === 0 ? firstDesktopItemRef : null}
                        onClick={() => setDesktopOpen(false)}
                        aria-current={activeId === id ? "page" : undefined}
                        className={
                          "rounded-md px-3 py-2 text-sm transition text-zinc-800 hover:bg-zinc-100/80 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus:outline-none dark:text-zinc-100 dark:hover:bg-zinc-800/70 " +
                          (activeId === id ? "bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10" : "")
                        }
                        role="menuitem"
                      >
                        {label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
            <div aria-hidden className="hidden sm:block h-6 w-px mx-2 sm:mx-3 bg-zinc-200/70 dark:bg-white/10" />
            <div className="flex items-center gap-3 sm:gap-4">
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
                  ["hero", "Home"],
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
                    aria-current={activeId === id ? "page" : undefined}
                    className={
                      "rounded-md px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus:outline-none dark:text-zinc-100 dark:hover:bg-zinc-800 " +
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


