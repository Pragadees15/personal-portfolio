export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  updated_at: string;
};

export type MappedProject = {
  title: string;
  stack: string[];
  bullets: string[];
  repo?: string;
  demo?: string;
  stars?: number;
  updatedAt?: string;
  image?: string;
  repoName?: string;
};

function normalizeHomepage(url?: string | null) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return undefined;
}

export async function fetchGithubProjects(username: string): Promise<MappedProject[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers,
    // Cache for 1 hour to avoid rate limits; overrideable by revalidate
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  const data = (await res.json()) as GithubRepo[];
  const mapped = data
    .filter((r) => !r.name.startsWith(".") && !r.name.endsWith("-deprecated"))
    .map((r) => {
      const techs = new Set<string>();
      if (r.language) techs.add(r.language);
      (r.topics ?? []).slice(0, 5).forEach((t) => techs.add(t));
      // Use a cached proxy endpoint instead of hitting GitHub OG directly from the browser
      const image = `/api/github-og?owner=${encodeURIComponent(username)}&repo=${encodeURIComponent(
        r.name,
      )}`;
      return {
        title: r.name.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim(),
        stack: Array.from(techs),
        bullets: r.description ? [r.description] : [],
        repo: r.html_url,
        demo: normalizeHomepage(r.homepage ?? undefined),
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
        image,
        repoName: r.name,
      } as MappedProject;
    });

  // Sort: prefer demo sites, then stars, then recent updates
  mapped.sort((a, b) => {
    const demoA = a.demo ? 1 : 0;
    const demoB = b.demo ? 1 : 0;
    if (demoB !== demoA) return demoB - demoA;
    const starsA = a.stars ?? 0;
    const starsB = b.stars ?? 0;
    if (starsB !== starsA) return starsB - starsA;
    return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
  });

  return mapped;
}


