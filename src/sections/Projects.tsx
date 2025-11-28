import { projects as staticProjects } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchGithubProjects } from "@/lib/github";
import ProjectsClient from "@/sections/ProjectsClient";
import GitHubStats from "@/components/GitHubStats";

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

export default async function Projects() {
  let ghProjects: GithubProject[] = [];
  try {
    ghProjects = await fetchGithubProjects("Pragadees15");
  } catch {
    // ignore and fallback
  }
  const wanted = ["acadion-mobile", "seat-finder", "edusmartbot", "self-driving-car"];
  let projects: ProjectCard[] = [];
  if (ghProjects.length) {
    const byName = new Map<string, GithubProject>();
    ghProjects.forEach((p) => {
      if (p.repoName) byName.set(p.repoName.toLowerCase(), p);
    });
    for (const key of wanted) {
      const match = byName.get(key);
      if (match) projects.push(match);
    }
    ghProjects.forEach((p) => {
      if (projects.length < 4 && !projects.includes(p)) projects.push(p);
    });
    projects = projects.slice(0, 4);
  } else {
    const picks = new Set<number>();
    function pickByKeyword(keyword: string) {
      const normalized = keyword.replaceAll("-", " ");
      const idx = staticProjects.findIndex((p) => p.title.toLowerCase().includes(normalized));
      if (idx >= 0) picks.add(idx);
    }
    wanted.forEach(pickByKeyword);
    const ordered = Array.from(picks).map((i) => staticProjects[i]);
    const filled = [...ordered];
    for (const project of staticProjects) {
      if (filled.length >= 4) break;
      if (!ordered.includes(project)) filled.push(project);
    }
    projects = filled.slice(0, 4);
  }
  const cacheBuster = process.env.NEXT_PUBLIC_PROJECT_CACHE_BUSTER ?? "stable";
  return (
    <section id="projects" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Selected builds and experiments">
        Projects
      </SectionHeading>
      <GitHubStats />
      <ProjectsClient projects={projects} wantedKeys={wanted} cacheBuster={cacheBuster} />
    </section>
  );
}


