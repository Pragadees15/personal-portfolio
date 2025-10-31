"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/motion/TiltCard";
import BeforeAfter from "@/components/BeforeAfter";
import Modal from "@/components/Modal";

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
    if (host.includes("githubusercontent.com") || host.includes("github.com")) {
      if (!u.searchParams.has("v") && !u.searchParams.has("t")) {
        u.searchParams.set("v", String(cacheBuster));
      }
      return u.toString();
    }
    return src;
  } catch (_) {
    const join = src.includes("?") ? "&" : "?";
    return `${src}${join}${cacheBuster}`;
  }
}

export default function ProjectsClient({ projects, wantedKeys, cacheBuster }: ProjectsClientProps) {
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
      <div className="mb-4">
        <Marquee items={highlights} />
      </div>
      <div className="mx-auto mb-4 grid max-w-6xl gap-2 sm:grid-cols-[1fr_auto_auto] items-start">
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or tech…"
            aria-label="Search projects"
            className="w-full rounded-lg border border-zinc-200/70 bg-white/70 px-3 py-2 pr-8 text-sm text-zinc-800 outline-none placeholder-zinc-400 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100"
          />
          {query && (
            <button
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              onClick={() => setQuery("")}
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setSortAsc((v) => !v)}
          className="rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1.5 text-xs text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
          aria-label="Toggle sort order"
          title="Sort A↕"
        >
          Sort {sortAsc ? "A→Z" : "Z→A"}
        </button>
        <div className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-right">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
      </div>
      <div className="mx-auto mb-4 flex max-w-6xl flex-wrap gap-2">
        {allTags.map((t) => {
          const active = selectedTags.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={("rounded-full border px-3 py-1 text-xs transition " + (active
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-200"
                : "border-zinc-200/70 bg-white/60 text-zinc-700 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"))}
              aria-pressed={active}
            >
              {t}
            </button>
          );
        })}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs text-zinc-700 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p: AnyProject, i: number) => {
          const repoName = (p.repoName ?? p.title ?? "").toLowerCase();
          const normalized = repoName.replaceAll(" ", "-");
          const isFeatured = wantedKeys.some((w) => repoName.includes(w.replaceAll("-", " ")) || repoName.includes(w));
          const showLive = normalized.includes("seat-finder");
          const showReleases = normalized.includes("acadion") || normalized.includes("acadion-mobile");
          return (
            <Reveal key={(p.title ?? String(i)) + "-card"} delay={i * 0.05}>
              <div className="block" role="group">
                <TiltCard>
                  <div className="">
                    <Card className="group relative rounded-2xl border border-zinc-200 bg-white transition will-change-transform hover:-translate-y-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                      {p.repo && (
                        <a
                          href={p.repo as string}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${p.title} repository`}
                          className="absolute inset-0 z-10"
                        />
                      )}
                      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                        {isFeatured && (
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">Featured</span>
                        )}
                        {i === 0 ? (
                          <BeforeAfter
                            srcBefore={withCacheBuster((p.image as string) ?? "/window.svg", cacheBuster) as string}
                            srcAfter={withCacheBuster((p.image as string) ?? "/window.svg", cacheBuster) as string}
                            beforeClassName="grayscale contrast-90"
                            afterClassName=""
                            alt={p.title ?? "preview"}
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40" />
                            {p.image ? (
                              <Image
                                src={withCacheBuster(p.image as string, cacheBuster) as string}
                                alt="preview"
                                fill
                                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="object-cover opacity-90 mix-blend-multiply dark:mix-blend-normal"
                              />
                            ) : null}
                          </>
                        )}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/30" />
                      </div>
                      <CardContent className="space-y-3">
                        <CardTitle className="text-zinc-900 dark:text-zinc-50">{p.title}</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          {(p.stack as string[]).slice(0, 6).map((t) => (
                            <span key={t} className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {showLive && (p.demo || (p as any).homepage) && (
                            <a
                              href={(p.demo ?? (p as any).homepage) as string}
                              target="_blank"
                              rel="noreferrer"
                              className="relative z-20 rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 text-zinc-700 backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
                            >
                              Live
                            </a>
                          )}
                          {showReleases && p.repo && (
                            <a
                              href={`${p.repo}/releases` as string}
                              target="_blank"
                              rel="noreferrer"
                              className="relative z-20 rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 text-zinc-700 backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
                            >
                              Releases
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setOpenIdx(i)}
                            className="relative z-20 rounded-md border border-zinc-200/70 bg-white/60 px-2.5 py-1 text-zinc-700 backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
                          >
                            Preview
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TiltCard>
              </div>
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
          <div className="grid gap-3">
            {filtered[openIdx!].image && (
              <div className="relative h-48 w-full overflow-hidden rounded-xl">
                <Image
                  src={withCacheBuster(filtered[openIdx!].image as string, cacheBuster) as string}
                  alt="preview"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {(filtered[openIdx!].stack ?? []).map((t) => (
                <span key={t} className="rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-xs text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {filtered[openIdx!].repo && (
                <a
                  href={filtered[openIdx!].repo as string}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
                >
                  Open Repo
                </a>
              )}
              {(filtered[openIdx!].demo || (filtered[openIdx!] as any).homepage) && (
                <a
                  href={(filtered[openIdx!].demo ?? (filtered[openIdx!] as any).homepage) as string}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}


