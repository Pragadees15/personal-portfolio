import { unstable_cache } from "next/cache";
import { projects as staticProjects } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchGithubProjects } from "@/lib/github";
import ProjectsClient from "@/sections/ProjectsClient";

// Constants extracted to avoid duplication and enable easy configuration
const WANTED_PROJECTS = ["acadion-mobile", "seat-finder", "edusmartbot", "self-driving-car"] as const;
const GITHUB_USERNAME = "Pragadees15";
const MAX_PROJECTS = 4;

type GithubProject = Awaited<ReturnType<typeof fetchGithubProjects>>[number];
type ProjectCard = {
  title?: string;
  repoName?: string;
  image?: string;
  repo?: string;
  demo?: string;
  homepage?: string;
  stack?: string[];
};

// Optimized project selection: single pass with Set for O(1) lookups
function selectProjects(ghProjects: GithubProject[], wanted: readonly string[]): ProjectCard[] {
  if (!ghProjects.length) {
    // Fallback to static projects: optimized with pre-normalized wanted terms
    const normalizedWanted = wanted.map((w) => w.replaceAll("-", " ").toLowerCase());
    const selected: ProjectCard[] = [];
    const seen = new Set<number>();

    // Single pass: find exact matches first
    for (let i = 0; i < staticProjects.length && selected.length < MAX_PROJECTS; i++) {
      const project = staticProjects[i];
      const normalizedTitle = project.title?.toLowerCase().replaceAll("-", " ");
      if (normalizedTitle && normalizedWanted.some((w) => normalizedTitle.includes(w))) {
        selected.push(project);
        seen.add(i);
      }
    }

    // Fill remaining slots
    for (let i = 0; i < staticProjects.length && selected.length < MAX_PROJECTS; i++) {
      if (!seen.has(i)) {
        selected.push(staticProjects[i]);
      }
    }

    return selected;
  }

  // GitHub projects: optimized with Map for O(1) lookups
  const byName = new Map<string, GithubProject>();
  const selected: ProjectCard[] = [];
  const selectedSet = new Set<GithubProject>();

  // Build lookup map (single pass)
  for (const p of ghProjects) {
    if (p.repoName) {
      byName.set(p.repoName.toLowerCase(), p);
    }
  }

  // Select wanted projects first (maintains order)
  for (const key of wanted) {
    const match = byName.get(key);
    if (match && selected.length < MAX_PROJECTS) {
      selected.push(match);
      selectedSet.add(match);
    }
  }

  // Fill remaining slots from all projects
  for (const p of ghProjects) {
    if (selected.length >= MAX_PROJECTS) break;
    if (!selectedSet.has(p)) {
      selected.push(p);
      selectedSet.add(p);
    }
  }

  return selected; // Already limited by loop condition
}

// Cache the processed projects list to avoid re-processing on every request
const getCachedProjects = unstable_cache(
  async (): Promise<ProjectCard[]> => {
    let ghProjects: GithubProject[] = [];
    try {
      ghProjects = await fetchGithubProjects(GITHUB_USERNAME);
    } catch {
      // ignore and fallback to static projects
    }
    return selectProjects(ghProjects, WANTED_PROJECTS);
  },
  ["processed-projects"], // Cache key
  {
    revalidate: 14400, // Revalidate after 4 hours (matches GitHub API cache)
    tags: ["projects"], // Tag for on-demand revalidation
  }
);

export default async function Projects() {
  const projects = await getCachedProjects();
  // Cache buster removed - Next.js cache handles invalidation properly
  // Images are cached via /api/github-og route with proper cache headers
  return (
    <section id="projects" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Selected builds and experiments">
        Projects
      </SectionHeading>
      <ProjectsClient projects={projects} wantedKeys={[...WANTED_PROJECTS]} />
    </section>
  );
}


