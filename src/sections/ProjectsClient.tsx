"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { Search, X, Github, ExternalLink, ArrowUpRight, ChevronRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/resume";
import { cn } from "@/lib/utils";

// --- Constants ---

const HIGHLIGHTS = [
  "End-to-End Builds", "DX Focus", "Micro-interactions", "Accessibility",
  "Performance", "Edge", "Open Source", "AI/ML", "Creative Engineering"
];

// Matches the structure in resume.ts
type AnyProject = {
  title?: string;
  repoName?: string;
  image?: string;
  repo?: string;
  demo?: string;
  homepage?: string;
  stack?: string[];
  bullets?: string[];
};

type ProjectsClientProps = {
  projects: AnyProject[];
  wantedKeys: string[];
};

// --- Image Component ---
function ProjectImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    // Fallback Pattern if image fails or is missing
    return (
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <Layers className="w-12 h-12 text-zinc-300 dark:text-zinc-700 opacity-50" />
      </div>
    );
  }

  const isGithubOg = src.includes("opengraph.githubassets.com") || src.startsWith("/api/github-og");

  return (
    <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-900">
      {loading && <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          "object-cover transition-opacity duration-500",
          loading ? "opacity-0" : "opacity-100"
        )}
        onError={() => { setError(true); setLoading(false); }}
        onLoad={() => setLoading(false)}
        unoptimized={isGithubOg}
      />
      {/* Subtle inner border for contrast */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
    </div>
  );
}

// --- Helper: GitHub Image URL ---
function getRemoteProjectImage(project: AnyProject): string | undefined {
  if (project.image && typeof project.image === "string" && project.image.trim()) {
    return project.image;
  }
  const candidateUrl = (project.repo || project.homepage || project.demo) as string | undefined;
  if (candidateUrl && candidateUrl.includes("github.com")) {
    try {
      const url = new URL(candidateUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `/api/github-og?owner=${parts[0]}&repo=${parts[1]}`;
    } catch { }
  }
  if (project.repoName) {
    return `/api/github-og?owner=Pragadees15&repo=${project.repoName}`;
  }
  return undefined;
}

// --- Main Component ---

export default function ProjectsClient({ projects, wantedKeys }: ProjectsClientProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 1. Prepare Data
  const normalizedProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      image: getRemoteProjectImage(project),
    }));
  }, [projects]);

  // 2. Setup Filters
  const allTags = useMemo(() => {
    const s = new Set<string>();
    normalizedProjects.forEach(p => p.stack?.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [normalizedProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorter = (a: AnyProject, b: AnyProject) => {
      const an = (a.repoName ?? a.title ?? "").toLowerCase();
      const bn = (b.repoName ?? b.title ?? "").toLowerCase();
      return sortAsc ? an.localeCompare(bn) : bn.localeCompare(an);
    };

    if (!q && !selectedTags.length) return [...normalizedProjects].sort(sorter);

    const selectedTagsLower = selectedTags.map(t => t.toLowerCase());
    return normalizedProjects.filter(p => {
      const name = (p.repoName ?? p.title ?? "").toLowerCase();
      const tags = (p.stack ?? []).map(t => t.toLowerCase());
      const qMatch = !q || name.includes(q) || tags.some(t => t.includes(q));
      const tMatch = !selectedTagsLower.length || selectedTagsLower.every(t => tags.includes(t));
      return qMatch && tMatch;
    }).sort(sorter);
  }, [normalizedProjects, query, selectedTags, sortAsc]);

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  // 3. Command Events
  useEffect(() => {
    const onFocus = () => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => inputRef.current?.focus(), 250);
    };
    const onSetQuery = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setQuery(detail);
    };
    window.addEventListener("focus-projects-search", onFocus);
    window.addEventListener("projects:set-query", onSetQuery);
    return () => {
      window.removeEventListener("focus-projects-search", onFocus);
      window.removeEventListener("projects:set-query", onSetQuery);
    };
  }, []);

  return (
    <>
      {/* Search Header */}
      <div className="relative z-10 mx-auto max-w-5xl mb-12">
        <div className="mb-8 opacity-90">
          <Marquee items={HIGHLIGHTS} />
        </div>

        {/* Minimalist Search Bar */}
        <div className="sticky top-6 z-30 mx-auto max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
            <div className="relative flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl p-2 pl-4 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/10">
              <Search className="h-5 w-5 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter projects..."
                className="flex-1 bg-transparent text-base sm:text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                </button>
              )}
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {sortAsc ? "A-Z" : "Z-A"}
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border",
                  selectedTags.includes(tag)
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-105 dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-white/50 text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-white dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
                )}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button onClick={() => setSelectedTags([])} className="px-3 py-1 text-xs font-medium text-red-500 hover:underline">Reset</button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map((project, i) => {
          const href = project.repo || project.homepage || project.demo;

          return (
            <div
              key={(project.title ?? i) + "-card"}
              className="group flex flex-col bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* 1. Feature Image Area (16:9 Aspect Ratio) */}
              <a
                href={href}
                target="_blank"
                className="block relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5 cursor-pointer"
              >
                <ProjectImage src={project.image} alt={project.title ?? "Project Preview"} />

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  {project.repo && (
                    <div className="p-2.5 bg-white text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Github size={20} />
                    </div>
                  )}
                  {(project.demo || project.homepage) && (
                    <div className="p-2.5 bg-white text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      <ExternalLink size={20} />
                    </div>
                  )}
                </div>
              </a>

              {/* 2. Content Area */}
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight">
                    {project.title ?? project.repoName}
                  </h3>
                  {/* Simple Arrow purely visual */}
                  <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                </div>

                {/* Description / bullets fallback */}
                <div className="flex-1 mb-6">
                  {project.bullets && project.bullets.length > 0 ? (
                    <ul className="space-y-1.5">
                      {project.bullets.slice(0, 2).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                          <span className="line-clamp-2">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      A comprehensive solution built with {project.stack?.[0]} to solve complex problems in the {project.stack?.[1] || "tech"} domain.
                    </p>
                  )}
                </div>

                {/* Footer: Tags */}
                <div className="pt-4 border-t border-zinc-100 dark:border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {(project.stack ?? []).slice(0, 4).map(t => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 rounded-md text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                    {(project.stack?.length ?? 0) > 4 && (
                      <span className="px-2 py-1 text-[11px] text-zinc-400 font-medium">
                        +{(project.stack?.length ?? 0) - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {
        filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">No projects found.</p>
            <button
              onClick={() => { setQuery(""); setSelectedTags([]); }}
              className="mt-2 text-indigo-500 font-medium hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )
      }
    </>
  );
}
