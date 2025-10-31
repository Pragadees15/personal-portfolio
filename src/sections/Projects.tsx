import { projects as staticProjects } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchGithubProjects } from "@/lib/github";
import ProjectsClient from "@/sections/ProjectsClient";

export default async function Projects() {
  let ghProjects = [] as Awaited<ReturnType<typeof fetchGithubProjects>>;
  try {
    ghProjects = await fetchGithubProjects("Pragadees15");
  } catch (_) {
    // ignore and fallback
  }
  const wanted = ["acadion-mobile", "seat-finder", "edusmartbot", "self-driving-car"];
  let projects: any[] = [];
  if (ghProjects.length) {
    const byName = new Map<string, any>();
    ghProjects.forEach((p) => {
      if (p.repoName) byName.set(p.repoName.toLowerCase(), p);
    });
    for (const key of wanted) {
      const match = byName.get(key);
      if (match) projects.push(match);
    }
    // Fill remaining slots with top others not already chosen
    ghProjects.forEach((p) => {
      if (projects.length < 4 && !projects.includes(p)) projects.push(p);
    });
    projects = projects.slice(0, 4);
  } else {
    // Fallback: pick from static by title keywords, then fill
    const picks = new Set<number>();
    function pickByKeyword(k: string) {
      const idx = staticProjects.findIndex((p) => p.title.toLowerCase().includes(k.replaceAll("-", " "))); 
      if (idx >= 0) picks.add(idx);
    }
    wanted.forEach(pickByKeyword);
    const ordered = Array.from(picks).map((i) => staticProjects[i]);
    const filled = [...ordered];
    for (const p of staticProjects) {
      if (filled.length >= 4) break;
      if (!ordered.includes(p)) filled.push(p);
    }
    projects = filled.slice(0, 4) as any[];
  }
  // Force fresh images to avoid stale GitHub/CDN caches
  const cacheBuster = String(Date.now());
  return (
    <section id="projects" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Selected builds and experiments">
        Projects
      </SectionHeading>
      <ProjectsClient projects={projects} wantedKeys={wanted} cacheBuster={cacheBuster} />
    </section>
  );
}


