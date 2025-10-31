"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/resume";

type Action = {
  id: string;
  label: string;
  keywords?: string;
  onRun: () => void;
  kbd?: string;
};

function useKey(handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      handler(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler]);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useKey((e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const meta = isMac ? e.metaKey : e.ctrlKey;
    if ((meta && e.key.toLowerCase() === "k") || e.key === "/") {
      e.preventDefault();
      setOpen((v) => !v);
      setIndex(0);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (open && (e.key === "ArrowDown" || e.key === "Tab")) {
      e.preventDefault();
      setIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (open && e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((prev) => Math.max(prev - 1, 0));
    } else if (open && e.key === "Enter") {
      e.preventDefault();
      const a = filtered[index];
      if (a) a.onRun();
    }
  });

  // Listen for external open trigger
  useEffect(() => {
    function onOpen() {
      setOpen(true);
      setQuery("");
      setTimeout(() => setAnimateIn(true), 10);
    }
    window.addEventListener("open-command-palette", onOpen as EventListener);
    return () => window.removeEventListener("open-command-palette", onOpen as EventListener);
  }, []);

  const actions: Action[] = useMemo(() => {
    const jump = (id: string) => () => {
      setOpen(false);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return [
      { id: "go-terminal", label: "Go to Developer Terminal", keywords: "terminal console", onRun: jump("terminal") },
      
      { id: "open-achievements", label: "Open Achievements", keywords: "achievements badges", onRun: () => { setOpen(false); window.dispatchEvent(new Event("achievements:open")); } },
      { id: "go-about", label: "Go to About", keywords: "about summary", onRun: jump("about") },
      { id: "go-skills", label: "Go to Skills", keywords: "skills tech stack", onRun: jump("skills") },
      { id: "go-projects", label: "Go to Projects", keywords: "projects work", onRun: jump("projects") },
      { id: "go-experience", label: "Go to Experience", keywords: "experience timeline", onRun: jump("experience") },
      { id: "go-education", label: "Go to Education", keywords: "education school", onRun: jump("education") },
      { id: "go-contact", label: "Go to Contact", keywords: "contact email", onRun: jump("contact") },
      {
        id: "copy-email",
        label: "Copy Email Address",
        keywords: "email clipboard",
        kbd: "Enter",
        onRun: () => {
          navigator.clipboard.writeText(profile.email);
          setOpen(false);
        },
      },
      {
        id: "toggle-theme",
        label: "Toggle Theme (Light/Dark)",
        keywords: "theme dark light",
        onRun: () => {
          setOpen(false);
          const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Toggle theme"]');
          btn?.click();
        },
      },
      {
        id: "toggle-hyper",
        label: "Toggle Hyper Mode",
        keywords: "konami hyper background effects",
        onRun: () => {
          setOpen(false);
          const root = document.documentElement;
          const isOn = root.dataset.hyper === "1";
          root.dataset.hyper = isOn ? "0" : "1";
        },
      },
      {
        id: "projects-search",
        label: "Focus Projects Search",
        keywords: "search filter projects",
        onRun: () => {
          setOpen(false);
          window.dispatchEvent(new Event("focus-projects-search"));
        },
      },
      {
        id: "open-github",
        label: "Open GitHub Profile",
        keywords: "github profile",
        onRun: () => {
          setOpen(false);
          window.open(profile.github, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "open-linkedin",
        label: "Open LinkedIn Profile",
        keywords: "linkedin profile",
        onRun: () => {
          setOpen(false);
          window.open(profile.linkedin, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "email-me",
        label: "Email Me (Prefilled)",
        keywords: "contact email",
        onRun: () => {
          setOpen(false);
          const subj = encodeURIComponent("Hello Pragadeeswaran — from your portfolio");
          const body = encodeURIComponent("Hi Pragadeeswaran,\n\nI came across your portfolio and ...\n\nRegards,\n");
          window.location.href = `mailto:${profile.email}?subject=${subj}&body=${body}`;
        },
      },
      {
        id: "random-section",
        label: "Go to a Random Section",
        keywords: "navigate random",
        onRun: () => {
          setOpen(false);
          const ids = ["about","interests","skills","education","experience","projects","certifications","honors","leadership","contact"];
          const id = ids[Math.floor(Math.random() * ids.length)];
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      },
      {
        id: "download-resume",
        label: "Open Resume (PDF)",
        keywords: "resume cv pdf",
        onRun: () => {
          setOpen(false);
          window.open("https://drive.google.com/file/d/1qblXImKORbM32TFAvQnMRZd7dE8kxsFB/view?usp=drive_link", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "random-project-preview",
        label: "Open Random Project Preview",
        keywords: "projects random preview",
        onRun: () => {
          setOpen(false);
          window.dispatchEvent(new Event("open-random-project-preview"));
        },
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query, actions]);

  if (!open) return null;

  // ensure active option stays in view
  useEffect(() => {
    const el = itemRefs.current[index];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [index, filtered.length]);

  function closePalette() {
    setAnimateIn(false);
    // allow transition to play
    setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closePalette} />
      <div className="site-container mt-24 relative z-[71]">
        <div className={("rounded-2xl border border-zinc-200/70 bg-white p-3 shadow-2xl ring-1 ring-black/5 transition-all duration-150 dark:border-white/10 dark:bg-zinc-950 " + (animateIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-[0.98]"))} role="dialog" aria-modal="true" aria-label="Command palette">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions… (⌘/Ctrl K)"
            className="w-full rounded-md border border-zinc-200/70 bg-white/70 px-3 py-2 text-sm text-zinc-800 outline-none placeholder-zinc-400 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100"
          />
          <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
            <span>↑/↓ to navigate • Enter to run • Esc to close</span>
          </div>
          <ul ref={listRef} className="mt-2 max-h-72 overflow-y-auto" role="listbox" aria-label="Commands">
            {filtered.map((a, i) => (
              <li key={a.id} role="option" aria-selected={i === index}>
                <button
                  ref={(el) => { itemRefs.current[i] = el; }}
                  onClick={a.onRun}
                  className={("flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-zinc-800 transition outline-none dark:text-zinc-100 " + (i === index ? "bg-zinc-100 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:ring-zinc-700" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"))}
                >
                  <span>{a.label}</span>
                  {a.kbd && (
                    <span className="rounded-md border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-700 shadow-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100">{a.kbd}</span>
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">No results</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;


