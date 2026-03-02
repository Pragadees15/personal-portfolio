"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/resume";
import { useAvatarUrl } from "@/hooks/useAvatarUrl";
import { useEffect, useState, useRef, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { getGithubUsernameFromUrl } from "@/lib/github";
import {
  Menu,
  X,
  Home,
  User,
  Sparkles,
  Code,
  GraduationCap,
  Briefcase,
  Layers,
  FileText,
  Award,
  Globe,
  Mail,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "hero", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "interests", label: "Interests", icon: Sparkles },
  { id: "skills", label: "Skills", icon: Code },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "certifications", label: "Certifications", icon: FileText },
  { id: "honors", label: "Honors", icon: Award },
  { id: "leadership", label: "Leadership", icon: Globe },
  { id: "contact", label: "Contact", icon: Mail },
];

// --- Scramble Text Component ---
function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      const frameId = window.requestAnimationFrame(() => {
        setDisplay(text);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    let iteration = 0;
    const interval = window.setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        window.clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => window.clearInterval(interval);
  }, [text, reduceMotion]);

  return <span className={className}>{display}</span>;
}

export function Navbar() {
  const [activeId, setActiveId] = useState<string | null>("hero");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const githubUsername = useMemo(() => {
    return getGithubUsernameFromUrl(profile.github);
  }, []);

  const avatarUrl = useAvatarUrl(githubUsername, 80);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active section detection logic
  useEffect(() => {
    const sectionIds = items.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const visibleSections = new Map<string, HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.target as HTMLElement);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const visible = Array.from(visibleSections.values());
        if (visible.length === 0) return;

        const sorted = visible.sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return aRect.top - bRect.top;
        });

        const newActiveId = sorted[0]?.id;
        if (newActiveId) {
          setActiveId(newActiveId);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    sections.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        ref={menuRef}
        className={cn(
          "pointer-events-auto relative bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-white/5 shadow-2xl shadow-zinc-500/10 dark:shadow-black/70 overflow-hidden transition-all duration-200 ease-out",
          isOpen ? "rounded-3xl p-4 sm:p-5 ring-1 ring-zinc-900/5 dark:ring-white/5" : "rounded-full px-2 py-2"
        )}
      >
        {/* Static subtle border accent */}
        {!isOpen && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent 20%, rgba(99,102,241,0.08) 50%, transparent 80%)',
            }}
          />
        )}

        <div className="flex items-center gap-2 relative z-10">
          {/* Logo / Profile */}
          <div className="relative shrink-0">
            <Link
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden ring-2 ring-zinc-200/50 dark:ring-white/10 shadow-lg shadow-zinc-500/10 dark:shadow-black/70"
            >
              <Image
                src={avatarUrl}
                alt={profile.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </Link>
            {!isOpen && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-zinc-950 ring-2 ring-white dark:ring-zinc-950">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            )}
          </div>

          {/* Collapsed State Info */}
          {!isOpen && (
            <div
              className="flex flex-col ml-1 min-w-[100px] sm:min-w-[120px] cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-none mb-0.5 font-mono">
                System Active
              </span>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <ScrambleText
                  text={activeItem.label}
                  className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate"
                />
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />
              </div>
            </div>
          )}

          {/* Spacer */}
          {!isOpen && <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1" />}

          {/* Actions */}
          <div className="flex items-center gap-1">
            <div className={isOpen ? "bg-zinc-100 dark:bg-zinc-900 rounded-full" : ""}>
              <ThemeToggle className={cn(
                "rounded-full w-10 h-10 transition-transform duration-200 hover:scale-105 active:scale-95",
                !isOpen && "border-0 bg-transparent shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              )} />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95",
                isOpen
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-900/20 dark:shadow-white/20"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200"
              )}
              aria-label="Toggle Menu"
            >
              <div className={cn("transition-transform duration-200", isOpen && "rotate-90")}>
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="pt-4 overflow-hidden relative animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header in Expanded Mode */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">Navigation Hub</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 relative z-10">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex flex-col gap-3 p-3 rounded-2xl transition-colors duration-150 group/item border relative overflow-hidden",
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-200/50 dark:hover:border-zinc-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150",
                        isActive
                          ? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <div>
                      <span className={cn(
                        "block text-sm font-medium transition-colors duration-150",
                        isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-200"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer in Expanded Mode */}
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between px-1 relative z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Available</span>
              </div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
                {new Date().getFullYear()} © PRAGADEES
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
