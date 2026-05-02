"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { profile } from "@/data/resume";

type Action = {
  id: string;
  label: string;
  keywords?: string;
  onRun: () => void;
  kbd?: string;
};

function useKey(handler: (e: KeyboardEvent) => void) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      handlerRef.current(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // External open trigger (e.g. from the navbar's ⌘K button).
  useEffect(() => {
    function onOpen() {
      setOpen(true);
      setQuery("");
    }
    window.addEventListener("open-command-palette", onOpen as EventListener);
    return () =>
      window.removeEventListener("open-command-palette", onOpen as EventListener);
  }, []);

  // Whenever the palette opens/closes, kick the entry transition on the
  // next frame. rAF avoids React 19's "setState in effect" lint and lets the
  // browser commit the initial styles before applying the transition.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateIn(open));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const actions: Action[] = useMemo(() => {
    const jump = (id: string) => () => {
      setOpen(false);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return [
      { id: "go-terminal", label: "Go to Developer Terminal", keywords: "terminal console", onRun: jump("terminal") },
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
        id: "toggle-contrast",
        label: "Toggle High Contrast",
        keywords: "contrast accessibility a11y",
        onRun: () => {
          setOpen(false);
          const root = document.documentElement;
          const isOn = root.dataset.contrast === "1";
          root.dataset.contrast = isOn ? "0" : "1";
        },
      },
      {
        id: "toggle-reduce-motion",
        label: "Toggle Motion Preview (reduce)",
        keywords: "motion reduce accessibility a11y",
        onRun: () => {
          setOpen(false);
          const root = document.documentElement;
          const isOn = root.dataset.rm === "1";
          root.dataset.rm = isOn ? "0" : "1";
          // notify listeners (optional)
          window.dispatchEvent(new Event("motion-preview:toggle"));
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
          const ids = ["about", "interests", "skills", "education", "experience", "projects", "certifications", "honors", "leadership", "contact"];
          const id = ids[Math.floor(Math.random() * ids.length)];
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      },
      {
        id: "download-resume",
        label: "Open Resume Viewer",
        keywords: "resume cv pdf",
        onRun: () => {
          setOpen(false);
          window.dispatchEvent(new Event("open-resume-viewer"));
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

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if ((meta && e.key.toLowerCase() === "k") || e.key === "/") {
        e.preventDefault();
        setOpen((v) => !v);
        setIndex(0);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown" || e.key === "Tab") {
        e.preventDefault();
        setIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const action = filtered[index];
        action?.onRun();
      }
    },
    [filtered, index, open],
  );

  useKey(handleKey);

  // ensure active option stays in view
  useEffect(() => {
    if (!open) return;
    const el = itemRefs.current[index];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [index, filtered.length, open]);

  if (!open) return null;

  function closePalette() {
    setAnimateIn(false);
    // allow transition to play
    setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity"
        onClick={closePalette}
      />
      <div className="site-container mt-8 sm:mt-16 md:mt-24 relative z-[71] px-2 sm:px-4">
        <div
          className={
            "rounded-md border border-foreground/15 bg-background p-3 sm:p-4 shadow-2xl transition-all duration-150 " +
            (animateIn
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-1 scale-[0.99]")
          }
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <input
            autoFocus
            id="command-palette-search"
            name="command-palette-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions…"
            className="w-full bg-transparent border-b border-foreground/15 px-1 py-3 text-base sm:text-lg font-display italic text-foreground outline-none placeholder-muted-foreground/50 focus:border-foreground transition"
          />
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 px-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground tabular-nums">
            <span>
              {String(filtered.length).padStart(2, "0")} result{filtered.length === 1 ? "" : "s"}
            </span>
            <span className="hidden sm:inline">↑/↓ navigate · ⏎ run · esc close</span>
            <span className="sm:hidden text-[10px]">Tap to select</span>
          </div>
          <ul
            ref={listRef}
            className="mt-3 max-h-[50vh] sm:max-h-72 overflow-y-auto overscroll-contain"
            role="listbox"
            aria-label="Commands"
          >
            {filtered.map((a, i) => (
              <li key={a.id} role="option" aria-selected={i === index}>
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={a.onRun}
                  className={
                    "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm text-foreground transition outline-none touch-manipulation border border-transparent " +
                    (i === index
                      ? "bg-secondary border-foreground/15"
                      : "hover:bg-secondary/60")
                  }
                >
                  <span className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{a.label}</span>
                  </span>
                  {a.kbd && (
                    <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border border-foreground/15 px-1.5 py-0.5 rounded-sm">
                      {a.kbd}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results found
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;


