"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Command } from "lucide-react";

import { profile } from "@/data/resume";
import { useAvatarUrl } from "@/hooks/useAvatarUrl";
import { getGithubUsernameFromUrl } from "@/lib/github";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string; index: string };

const items: Item[] = [
  { id: "about", label: "About", index: "01" },
  { id: "interests", label: "Interests", index: "02" },
  { id: "skills", label: "Stack", index: "03" },
  { id: "education", label: "Education", index: "04" },
  { id: "experience", label: "Experience", index: "05" },
  { id: "projects", label: "Work", index: "06" },
  { id: "certifications", label: "Credentials", index: "07" },
  { id: "honors", label: "Honors", index: "08" },
  { id: "leadership", label: "Leadership", index: "09" },
  { id: "contact", label: "Contact", index: "10" },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const githubUsername = useMemo(
    () => getGithubUsernameFromUrl(profile.github),
    [],
  );
  const avatarUrl = useAvatarUrl(githubUsername, 80);

  // Lock scroll while sheet is open (mobile UX)
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on outside click + Esc
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Track scroll progress for nav blur state
  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScrolled(window.scrollY > 24);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Active section detection — single observer
  useEffect(() => {
    const sectionIds = ["hero", ...items.map((i) => i.id)];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        });
        if (visible.size) {
          const [topId] = Array.from(visible.entries()).sort(
            (a, b) => b[1] - a[1],
          )[0];
          setActiveId(topId);
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const activeIndex =
    items.find((i) => i.id === activeId)?.index ??
    (activeId === "hero" ? "00" : "—");
  const activeLabel =
    items.find((i) => i.id === activeId)?.label ??
    (activeId === "hero" ? "Index" : "—");

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-foreground/10"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="site-container flex items-center justify-between h-16">
        {/* Logo / wordmark */}
        <Link
          href="#hero"
          className="group inline-flex items-center gap-3"
          aria-label="Pragadeeswaran K — back to top"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-foreground/15">
            <Image
              src={avatarUrl}
              alt={`${profile.name} — back to homepage`}
              width={36}
              height={36}
              className="h-full w-full object-cover"
              unoptimized
              priority
            />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Pragadeeswaran K
            </span>
            <span className="font-display text-base italic -mt-0.5">
              AI/ML Engineer
            </span>
          </span>
        </Link>

        {/* Active section indicator (centered, only when scrolled) */}
        <div
          className={cn(
            "hidden md:flex items-center gap-3 transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {activeIndex}
          </span>
          <span className="font-display italic text-base text-foreground">
            {activeLabel}
          </span>
        </div>

        {/* Right cluster — command, theme, menu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-3 h-9 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <span>⌘K</span>
          </button>
          <ThemeToggle />
          <button
            ref={(el) => {
              if (el && !menuRef.current) {
                menuRef.current = el.parentElement as HTMLDivElement;
              }
            }}
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            aria-label="Toggle navigation menu"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
              isOpen
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 hover:border-foreground/40",
            )}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Slide-down sheet */}
      <div
        id="primary-navigation"
        ref={menuRef}
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden bg-background border-b border-foreground/10",
          "transition-[max-height,opacity] duration-400 ease-out",
          isOpen
            ? "max-h-[80vh] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="site-container py-10">
          <div className="grid gap-x-6 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-baseline gap-4 py-3 border-b border-foreground/10 transition-colors",
                    "hover:border-foreground/30",
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums w-6 shrink-0">
                    {item.index}
                  </span>
                  <span
                    className={cn(
                      "font-display italic text-2xl md:text-3xl transition-transform duration-300 group-hover:translate-x-1",
                      isActive && "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && <span className="status-dot ml-auto" />}
                </Link>
              );
            })}
          </div>

          {/* Bottom row — meta */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-muted-foreground uppercase tracking-[0.16em]">
            <div className="flex items-center gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`${profile.name} on GitHub (opens in new tab)`}
                className="link-underline"
              >
                Open GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`${profile.name} on LinkedIn (opens in new tab)`}
                className="link-underline"
              >
                Open LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label={`Email ${profile.name}`}
                className="link-underline"
              >
                Direct email
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot" />
              <span>Available · {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
