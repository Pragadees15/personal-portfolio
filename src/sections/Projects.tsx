import { unstable_cache } from "next/cache";
import { projects as staticProjects } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchGithubProjects } from "@/lib/github";
import ProjectsClient from "@/sections/ProjectsClient";

const WANTED_PROJECTS = [
  "acadion-mobile",
  "seat-finder",
  "edusmartbot",
  "self-driving-car",
] as const;
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

function selectProjects(
  ghProjects: GithubProject[],
  wanted: readonly string[],
): ProjectCard[] {
  if (!ghProjects.length) {
    const normalizedWanted = wanted.map((w) =>
      w.replaceAll("-", " ").toLowerCase(),
    );
    const selected: ProjectCard[] = [];
    const seen = new Set<number>();

    for (let i = 0; i < staticProjects.length && selected.length < MAX_PROJECTS; i++) {
      const project = staticProjects[i];
      const normalizedTitle = project.title?.toLowerCase().replaceAll("-", " ");
      if (normalizedTitle && normalizedWanted.some((w) => normalizedTitle.includes(w))) {
        selected.push(project);
        seen.add(i);
      }
    }

    for (let i = 0; i < staticProjects.length && selected.length < MAX_PROJECTS; i++) {
      if (!seen.has(i)) {
        selected.push(staticProjects[i]);
      }
    }

    return selected;
  }

  const byName = new Map<string, GithubProject>();
  const selected: ProjectCard[] = [];
  const selectedSet = new Set<GithubProject>();

  for (const p of ghProjects) {
    if (p.repoName) byName.set(p.repoName.toLowerCase(), p);
  }
  for (const key of wanted) {
    const match = byName.get(key);
    if (match && selected.length < MAX_PROJECTS) {
      selected.push(match);
      selectedSet.add(match);
    }
  }
  for (const p of ghProjects) {
    if (selected.length >= MAX_PROJECTS) break;
    if (!selectedSet.has(p)) {
      selected.push(p);
      selectedSet.add(p);
    }
  }

  return selected;
}

const getCachedProjects = unstable_cache(
  async (): Promise<ProjectCard[]> => {
    let ghProjects: GithubProject[] = [];
    try {
      ghProjects = await fetchGithubProjects(GITHUB_USERNAME);
    } catch {
      // ignore — fall back to static
    }
    return selectProjects(ghProjects, WANTED_PROJECTS);
  },
  ["processed-projects"],
  { revalidate: 14400, tags: ["projects"] },
);

export default async function Projects() {
  const projects = await getCachedProjects();
  return (
    <section id="projects" className="site-container scroll-mt-24">
      <SectionHeading number="06" subtitle="Selected work — Builds & experiments">
        A small <em className="italic">archive</em>
        {" of things I've made."}
      </SectionHeading>
      <p className="-mt-6 mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A curated set of AI/ML and full-stack projects that show how I move
        from research ideas to reliable, shipped products — from
        GPU-accelerated pipelines to production-ready tools and education
        apps.
      </p>
      <ProjectsClient projects={projects} />
    </section>
  );
}
