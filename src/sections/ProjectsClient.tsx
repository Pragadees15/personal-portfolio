"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Layers,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { cn } from "@/lib/utils";

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

type ProjectsClientProps = { projects: AnyProject[] };

function ProjectImage({
  src,
  alt,
  loading = "lazy",
}: {
  src?: string;
  alt: string;
  loading?: "lazy" | "eager";
}) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || errored) {
    return (
      <div className="grid h-full w-full place-items-center bg-secondary">
        <Layers className="h-10 w-10 text-muted-foreground/30" />
      </div>
    );
  }

  const isGithubOg =
    src.includes("opengraph.githubassets.com") ||
    src.startsWith("/api/github-og");

  return (
    <div className="relative h-full w-full bg-secondary">
      {!loaded && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-image-shimmer bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          "grayscale-[0.15] group-hover:grayscale-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        unoptimized={isGithubOg}
        loading={loading}
      />
    </div>
  );
}

function getRemoteProjectImage(project: AnyProject): string | undefined {
  if (project.image && typeof project.image === "string" && project.image.trim()) {
    return project.image;
  }
  const candidateUrl = (project.repo || project.homepage || project.demo) as
    | string
    | undefined;
  if (candidateUrl && candidateUrl.includes("github.com")) {
    try {
      const url = new URL(candidateUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2)
        return `/api/github-og?owner=${parts[0]}&repo=${parts[1]}`;
    } catch {}
  }
  if (project.repoName) {
    return `/api/github-og?owner=Pragadees15&repo=${project.repoName}`;
  }
  return undefined;
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [eagerImages, setEagerImages] = useState(false);

  useEffect(() => {
    const update = () => setEagerImages(window.location.hash === "#projects");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const normalizedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        image: getRemoteProjectImage(project),
      })),
    [projects],
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    normalizedProjects.forEach((p) => p.stack?.forEach((t) => s.add(t)));
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
    const selectedTagsLower = selectedTags.map((t) => t.toLowerCase());
    return normalizedProjects
      .filter((p) => {
        const name = (p.repoName ?? p.title ?? "").toLowerCase();
        const tags = (p.stack ?? []).map((t) => t.toLowerCase());
        const qMatch = !q || name.includes(q) || tags.some((t) => t.includes(q));
        const tMatch =
          !selectedTagsLower.length ||
          selectedTagsLower.every((t) => tags.includes(t));
        return qMatch && tMatch;
      })
      .sort(sorter);
  }, [normalizedProjects, query, selectedTags, sortAsc]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  useEffect(() => {
    const onFocus = () => {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

  const handleCardMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <>
      {/* Filter bar — flat, editorial */}
      <div className="mb-12 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-y border-foreground/10 py-4">
          <div className="flex flex-1 items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter projects (e.g. python, vision, mobile)"
              id="projects-search"
              name="projects-search"
              className="flex-1 bg-transparent text-base sm:text-sm outline-none text-foreground placeholder-muted-foreground/60"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition"
            >
              Sort {sortAsc ? "A → Z" : "Z → A"}
            </button>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono text-muted-foreground tabular-nums">
              {String(filtered.length).padStart(2, "0")} results
            </span>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 10).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "chip-mono transition-colors",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "hover:border-foreground/40",
                  )}
                >
                  {tag}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="chip-mono text-foreground border-foreground/30 hover:border-foreground"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-10">
        {filtered.map((project, i) => {
          const href = project.repo || project.homepage || project.demo;
          const CardRoot = href ? "a" : "article";
          const cardProps = href
            ? {
                href,
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label":
                  (project.title ?? project.repoName)
                    ? `Open project ${project.title ?? project.repoName}`
                    : "Open project",
              }
            : {};
          const numeral = String(i + 1).padStart(2, "0");

          return (
            <CardRoot
              key={(project.title ?? i) + "-card"}
              onMouseMove={handleCardMouseMove}
              className={cn(
                "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
              )}
              {...cardProps}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-foreground/10 bg-secondary">
                <ProjectImage
                  src={project.image}
                  alt={`Preview of the ${project.title ?? project.repoName ?? "project"} repository — built with ${(project.stack ?? []).slice(0, 3).join(", ") || "modern tooling"}`}
                  loading={eagerImages && i === 0 ? "eager" : "lazy"}
                />

                {/* Hover overlay — minimal CTA badge */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-1.5">
                    {project.repo && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground">
                        <Github className="h-3 w-3" />
                      </span>
                    )}
                    {(project.demo || project.homepage) && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground">
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/90">
                    Open
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 flex items-start gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums pt-1.5">
                  {numeral}
                </span>
                <div className="flex-1 min-w-0">
                  <header className="flex items-start justify-between gap-2">
                    <p className="font-display italic text-lg sm:text-xl leading-tight truncate">
                      {project.title ?? project.repoName}
                    </p>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </header>

                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                    {project.bullets && project.bullets.length > 0
                      ? project.bullets[0]
                      : `Outcome-focused build using ${project.stack?.[0] ?? "modern tooling"} to solve a real problem with a clean user experience.`}
                  </p>

                  {(project.stack?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(project.stack ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="chip-mono">
                          {t}
                        </span>
                      ))}
                      {(project.stack?.length ?? 0) > 3 && (
                        <span className="chip-mono">
                          +{(project.stack?.length ?? 0) - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardRoot>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No projects found.</p>
          <button
            onClick={() => {
              setQuery("");
              setSelectedTags([]);
            }}
            className="mt-3 link-underline text-sm font-mono uppercase tracking-[0.14em]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
}
