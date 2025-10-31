"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type BadgeKey =
  | "visit_about"
  | "visit_skills"
  | "visit_projects"
  | "visit_experience"
  | "terminal_help"
  | "terminal_whoami";

type Badge = {
  key: BadgeKey;
  title: string;
  description: string;
  emoji: string;
};

export const BADGES: Badge[] = [
  { key: "visit_about", title: "Explorer: About", description: "You found the About section.", emoji: "🧭" },
  { key: "visit_skills", title: "Toolsmith", description: "You checked out Skills.", emoji: "🧰" },
  { key: "visit_projects", title: "Maker", description: "You viewed Projects.", emoji: "🛠️" },
  { key: "visit_experience", title: "Trail", description: "You viewed Experience.", emoji: "🥾" },
  { key: "terminal_help", title: "CLI: help", description: "You asked the terminal for help.", emoji: "❓" },
  { key: "terminal_whoami", title: "CLI: whoami", description: "Identity confirmed.", emoji: "🪪" },
];

type AchState = Record<BadgeKey, boolean>;

type Ctx = {
  state: AchState;
  total: number;
  unlocked: number;
  unlock: (key: BadgeKey) => void;
  openShelf: () => void;
  setOpenShelf: (v: boolean) => void;
  isShelfOpen: boolean;
};

const AchievementsContext = createContext<Ctx | null>(null);

const LS_KEY = "achievements:v1";

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const base: AchState = useMemo(() => (Object.fromEntries(BADGES.map((b) => [b.key, false])) as AchState), []);
  // Important: start from base for both SSR and first client render to avoid hydration mismatch
  const [state, setState] = useState<AchState>(base);
  const [isShelfOpen, setOpenShelf] = useState(false);

  const unlock = useCallback((key: BadgeKey) => {
    setState((s) => (s[key] ? s : { ...s, [key]: true }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // After mount, hydrate from localStorage to keep SSR/client initial markup identical
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<AchState>;
        setState((s) => ({ ...s, ...saved }));
      }
    } catch {}
  }, []);

  // Observe key sections for visit-* badges
  useEffect(() => {
    const map: Record<string, BadgeKey | undefined> = {
      about: "visit_about",
      skills: "visit_skills",
      projects: "visit_projects",
      experience: "visit_experience",
    };
    const ids = Object.keys(map);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            const key = map[id];
            if (key) unlock(key);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [unlock]);

  // Listen for terminal commands for terminal-* badges
  useEffect(() => {
    function onRun(e: Event) {
      const ce = e as CustomEvent<{ cmd: string }>;
      const cmd = (ce.detail?.cmd ?? "").toLowerCase();
      if (cmd === "help") unlock("terminal_help");
      if (cmd === "whoami") unlock("terminal_whoami");
    }
    window.addEventListener("terminal:ran-command", onRun as EventListener);
    window.addEventListener("achievements:open", () => setOpenShelf(true));
    return () => {
      window.removeEventListener("terminal:ran-command", onRun as EventListener);
      window.removeEventListener("achievements:open", () => setOpenShelf(true));
    };
  }, [unlock]);

  const unlocked = Object.values(state).filter(Boolean).length;
  const total = BADGES.length;

  const value: Ctx = {
    state,
    total,
    unlocked,
    unlock,
    openShelf: () => setOpenShelf(true),
    setOpenShelf,
    isShelfOpen,
  };

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements must be used inside AchievementsProvider");
  return ctx;
}


