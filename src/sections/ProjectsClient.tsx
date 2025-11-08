"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/motion/TiltCard";
import Modal from "@/components/Modal";
import { Search, X, Github, Globe, Code2 } from "lucide-react";
import { motion } from "framer-motion";

// ProjectImage component with error handling and fallback
function ProjectImage({ src, alt, title }: { src: string; alt: string; title?: string }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);
  const errorRef = useRef(false);
  const currentSrcRef = useRef(src);

  // Reset state when src changes
  useEffect(() => {
    if (currentSrcRef.current !== src) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Reset state for new image
      currentSrcRef.current = src;
      hasLoadedRef.current = false;
      errorRef.current = false;
      setImgError(false);
      setImgLoading(true);
    }
  }, [src]);

  // Set timeout when component mounts or src changes
  useEffect(() => {
    // Only set timeout if we haven't loaded and haven't errored
    if (!hasLoadedRef.current && !errorRef.current) {
      timeoutRef.current = setTimeout(() => {
        // Double-check we still haven't loaded/errored
        if (!hasLoadedRef.current && !errorRef.current) {
          errorRef.current = true;
          setImgError(true);
          setImgLoading(false);
        }
      }, 8000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [src]); // Re-run when src changes

  const handleError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      errorRef.current = true;
      setImgError(true);
      setImgLoading(false);
    }
  };

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!errorRef.current) {
      hasLoadedRef.current = true;
      setImgLoading(false);
    }
  };

  if (imgError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-fuchsia-950/40">
        <div className="flex flex-col items-center gap-3 text-center p-6">
          <div className="rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-4">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {title ?? "Project Preview"}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Preview unavailable
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {imgLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-fuchsia-950/40 z-0" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        quality={75}
        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-opacity duration-300 group-hover:scale-110 z-10 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={src.includes('opengraph.githubassets.com')}
      />
    </>
  );
}

type AnyProject = {
  title?: string;
  repoName?: string;
  image?: string;
  repo?: string;
  demo?: string;
  homepage?: string;
  stack?: string[];
};

type ProjectsClientProps = {
  projects: AnyProject[];
  wantedKeys: string[];
  cacheBuster: string;
};

function withCacheBuster(src: string | undefined, cacheBuster: string) {
  if (!src) return src as any;
  try {
    const u = new URL(src);
    const host = u.hostname.toLowerCase();
    // Handle GitHub URLs including opengraph.githubassets.com
    // Only add cache buster if not already present to avoid too many unique requests
    if (host.includes("githubusercontent.com") || host.includes("github.com") || host.includes("githubassets.com")) {
      // Use a stable cache buster (hash of repo name) instead of timestamp to reduce rate limiting
      // Only update if no v parameter exists
      if (!u.searchParams.has("v")) {
        u.searchParams.set("v", cacheBuster.slice(0, 10)); // Use first 10 chars for stability
      }
      return u.toString();
    }
    return src;
  } catch (_) {
    // If URL parsing fails, return as-is to avoid breaking
    return src;
  }
}

export default function ProjectsClient({ projects, wantedKeys, cacheBuster: serverCacheBuster }: ProjectsClientProps) {
  // Use server-provided cache buster to avoid rate limiting
  // The cache buster changes daily, providing balance between freshness and rate limits
  const cacheBuster = serverCacheBuster;
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // focus via custom event from command palette
  useEffect(() => {
    function onFocus() {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
    window.addEventListener("focus-projects-search", onFocus as EventListener);
    return () => window.removeEventListener("focus-projects-search", onFocus as EventListener);
  }, []);

  // prefill query from events (SkillMap)
  useEffect(() => {
    function onSetQuery(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail) {
        setQuery(detail);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
    window.addEventListener("projects:set-query", onSetQuery as EventListener);
    return () => window.removeEventListener("projects:set-query", onSetQuery as EventListener);
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => (p.stack ?? []).forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const highlights = [
    "End-to-End Builds",
    "DX Focus",
    "Micro-interactions",
    "Accessibility",
    "Performance",
    "Edge",
    "Open Source",
    "AI/ML",
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = projects.filter((p) => {
      const name = (p.repoName ?? p.title ?? "").toLowerCase();
      const tags = (p.stack ?? []).map((t) => t.toLowerCase());
      const qMatch = !q || name.includes(q) || tags.some((t) => t.includes(q));
      const tagsMatch = !selectedTags.length || selectedTags.every((t) => tags.includes(t.toLowerCase()));
      return qMatch && tagsMatch;
    });
    result.sort((a, b) => {
      const an = (a.repoName ?? a.title ?? "").toLowerCase();
      const bn = (b.repoName ?? b.title ?? "").toLowerCase();
      return sortAsc ? an.localeCompare(bn) : bn.localeCompare(an);
    });
    return result;
  }, [projects, query, selectedTags, sortAsc]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  // random preview trigger via command palette
  const pendingTitleRef = useRef<string | null>(null);
  useEffect(() => {
    function onRandom() {
      // Prefer current filtered pool; if empty, clear filters and pick from all
      if (filtered.length > 0) {
        const idx = Math.floor(Math.random() * filtered.length);
        setOpenIdx(idx);
      } else {
        // choose from all projects and then open after filters clear
        const allIdx = Math.floor(Math.random() * projects.length);
        const chosen = projects[allIdx];
        const key = (chosen.title ?? chosen.repoName ?? "");
        pendingTitleRef.current = key;
        setQuery("");
        setSelectedTags([]);
        // open will be handled in effect below when filtered updates
      }
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.addEventListener("open-random-project-preview", onRandom as EventListener);
    return () => window.removeEventListener("open-random-project-preview", onRandom as EventListener);
  }, [filtered]);

  // If we scheduled a specific project to open after clearing filters
  useEffect(() => {
    if (pendingTitleRef.current) {
      const key = pendingTitleRef.current.toLowerCase();
      const idx = filtered.findIndex((p) => ((p.title ?? p.repoName ?? "").toLowerCase() === key));
      if (idx >= 0) {
        setOpenIdx(idx);
        pendingTitleRef.current = null;
      }
    }
  }, [filtered]);

  return (
    <>
      <div className="mb-6 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/60">
        <div className="mb-4">
          <Marquee items={highlights} />
        </div>
        <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto_auto] items-start">
        <div className="relative col-span-full sm:col-span-1">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 sm:h-4 sm:w-4 -translate-y-1/2 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or tech…"
            aria-label="Search projects"
            className="w-full rounded-lg border border-zinc-200/70 bg-white/70 pl-9 sm:pl-8 pr-9 sm:pr-8 py-2.5 sm:py-2 text-base sm:text-sm text-zinc-800 outline-none placeholder-zinc-400 focus:ring-2 focus:ring-indigo-200 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:ring-indigo-900/40"
          />
          {query && (
            <button
              aria-label="Clear search"
              className="absolute right-2.5 sm:right-2 top-1/2 -translate-y-1/2 rounded p-1.5 sm:p-1 text-zinc-500 hover:text-zinc-800 active:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 touch-manipulation dark:text-zinc-400 dark:hover:text-zinc-200 dark:active:text-zinc-100 dark:focus:ring-indigo-900/40"
              onClick={() => setQuery("")}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setSortAsc((v) => !v)}
          className="rounded-md border border-zinc-200/70 bg-white/60 px-3 sm:px-2.5 py-2 sm:py-1.5 text-xs text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 active:bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-200 touch-manipulation dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:active:bg-zinc-700/60 dark:focus:ring-indigo-900/40 whitespace-nowrap"
          aria-label="Toggle sort order"
          title="Sort A↕"
        >
          Sort {sortAsc ? "A→Z" : "Z→A"}
        </button>
          <div className="text-xs sm:text-xs text-zinc-600 dark:text-zinc-400 sm:text-right col-span-full sm:col-span-1 text-left sm:text-right font-medium">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
        </div>
        <div className="flex flex-wrap gap-2">
        {allTags.map((t) => {
          const active = selectedTags.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={("rounded-full border-2 px-3 sm:px-3 py-1.5 sm:py-1 text-xs transition focus:outline-none focus:ring-2 focus:ring-indigo-200 touch-manipulation dark:focus:ring-indigo-900/40 " + (active
                ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700 shadow-sm active:bg-indigo-100 dark:border-indigo-600 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-200"
                : "border-zinc-200/70 bg-white/70 text-zinc-700 hover:bg-white/90 active:bg-white/95 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:active:bg-zinc-700/60"))}
              aria-pressed={active}
            >
              {t}
            </button>
          );
        })}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="rounded-full border-2 border-zinc-200/70 bg-white/70 px-3 sm:px-3 py-1.5 sm:py-1 text-xs text-zinc-700 hover:bg-white/90 active:bg-white/95 focus:outline-none focus:ring-2 focus:ring-indigo-200 touch-manipulation dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:active:bg-zinc-700/60 dark:focus:ring-indigo-900/40"
          >
            Clear
          </button>
        )}
        </div>
      </div>

      {/* Empty state when no results */}
      {filtered.length === 0 ? (
        <div>
          <div className="flex items-center justify-center rounded-2xl border border-zinc-200/70 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
            <div>
              <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">No projects found</div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Try a different search or clear filters to see all projects.</p>
              <div className="mt-4 flex justify-center gap-2">
                {(query || selectedTags.length > 0) && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setSelectedTags([]); }}
                    className="rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 backdrop-blur transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:focus:ring-indigo-900/40"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p: AnyProject, i: number) => {
          const repoName = (p.repoName ?? p.title ?? "").toLowerCase();
          const normalized = repoName.replaceAll(" ", "-");
          const isFeatured = wantedKeys.some((w) => repoName.includes(w.replaceAll("-", " ")) || repoName.includes(w));
          const tagsLower = (p.stack ?? []).map((t) => t.toLowerCase());
          const hasAI = tagsLower.some((t) => t.includes("ai") || t.includes("ml"));
          const hasOpenSource = tagsLower.some((t) => t.includes("open source") || t.includes("oss") || t.includes("open-source"));
          const hasEdge = tagsLower.some((t) => t.includes("edge"));
          const hasRag = tagsLower.some((t) => t.includes("rag") || t.includes("retrieval-augmented") || t.includes("retrieval augmented"));
          const hasCV = tagsLower.some((t) => t.includes("cv") || t.includes("computer vision") || t.includes("vision"));
          const href = (p.repo || p.homepage || p.demo) as string | undefined;
          return (
            <Reveal key={(p.title ?? String(i)) + "-card"} delay={i * 0.05}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.title ?? p.repoName ?? "project"}`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-2xl"
                >
                  <TiltCard>
                    <div className="">
                      <Card className="group relative cursor-pointer rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 will-change-transform hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 overflow-hidden">
                        <div className="relative w-full overflow-hidden rounded-t-2xl aspect-[16/9] min-h-[10rem]">
                          {(hasOpenSource || hasEdge || hasRag || hasCV) && (
                            <div aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
                              {hasOpenSource && (
                                <motion.span 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: i * 0.1 + 0.2 }}
                                  className="select-none rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">Open Source</motion.span>
                              )}
                              {hasEdge && (
                                <motion.span 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: i * 0.1 + 0.25 }}
                                  className="select-none rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">Edge</motion.span>
                              )}
                              {hasRag && (
                                <motion.span 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: i * 0.1 + 0.3 }}
                                  className="select-none rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">RAG</motion.span>
                              )}
                              {hasCV && (
                                <motion.span 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: i * 0.1 + 0.35 }}
                                  className="select-none rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">CV</motion.span>
                              )}
                            </div>
                          )}
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-fuchsia-950/40" />
                            {p.image ? (
                              <ProjectImage
                                src={withCacheBuster(p.image as string, cacheBuster) as string}
                                alt={p.title ?? "preview"}
                                title={p.title}
                              />
                            ) : null}
                          </>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-1000 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/20 mix-blend-overlay"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent dark:from-black/40" />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/10 group-hover:to-fuchsia-500/10 transition-all duration-300" />
                        </div>
                        <CardContent className="space-y-3 sm:space-y-4 min-h-[6.5rem]">
                          <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{p.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 sm:gap-2.5">
                            {(p.stack as string[]).slice(0, 6).map((t, ti) => (
                              <motion.span 
                                key={t}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 + ti * 0.02 }}
                                whileHover={{ scale: 1.1 }}
                                className="rounded-full border border-zinc-200/70 bg-white/90 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                              >
                                {t}
                              </motion.span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TiltCard>
                </a>
              ) : (
                <div className="block" role="group">
                  <TiltCard>
                    <div className="">
                      <Card className="group relative rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 will-change-transform hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 overflow-hidden">
                      <div className="relative w-full overflow-hidden rounded-t-2xl aspect-[16/9] min-h-[10rem]">
                        {(hasOpenSource || hasEdge || hasRag || hasCV) && (
                          <div aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
                            {hasOpenSource && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                                className="select-none rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">Open Source</motion.span>
                            )}
                            {hasEdge && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 + 0.25 }}
                                className="select-none rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">Edge</motion.span>
                            )}
                            {hasRag && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                className="select-none rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">RAG</motion.span>
                            )}
                            {hasCV && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 + 0.35 }}
                                className="select-none rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">CV</motion.span>
                            )}
                          </div>
                        )}
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-fuchsia-950/40" />
                          {p.image ? (
                            <ProjectImage
                              src={withCacheBuster(p.image as string, cacheBuster) as string}
                              alt={p.title ?? "preview"}
                              title={p.title}
                            />
                          ) : null}
                        </>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-1000 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/20 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent dark:from-black/40" />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/10 group-hover:to-fuchsia-500/10 transition-all duration-300" />
                      </div>
                      <CardContent className="space-y-3 sm:space-y-4 min-h-[6.5rem]">
                        <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{p.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                          {(p.stack as string[]).slice(0, 6).map((t, ti) => (
                            <motion.span 
                              key={t}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 + ti * 0.02 }}
                              whileHover={{ scale: 1.1 }}
                              className="rounded-full border border-zinc-200/70 bg-white/90 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                        {/* Action buttons removed as requested */}
                      </CardContent>
                    </Card>
                  </div>
                </TiltCard>
              </div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* Quick Preview Modal */}
      <Modal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={openIdx !== null ? (filtered[openIdx!].title ?? filtered[openIdx!].repoName ?? "Project") : undefined}
      >
        {openIdx !== null && (
          <div className="mx-auto max-w-2xl grid gap-3">
            {filtered[openIdx!].image && (
              <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9] min-h-[10rem]">
                <Image
                  src={withCacheBuster(filtered[openIdx!].image as string, cacheBuster) as string}
                  alt="preview"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {(filtered[openIdx!].stack ?? []).map((t) => (
                <span key={t} className="rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-xs text-zinc-700 backdrop-blur shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                  {t}
                </span>
              ))}
            </div>
            {/* Modal action buttons removed as requested */}
          </div>
        )}
      </Modal>
    </>
  );
}


