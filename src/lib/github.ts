// Removed unstable_cache import - using fetch cache + caller-level cache instead

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

// Optimized: early returns and single trim operation
function normalizeHomepage(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  return trimmed && (trimmed.startsWith("http://") || trimmed.startsWith("https://")) ? trimmed : undefined;
}

async function _fetchGithubProjects(username: string): Promise<MappedProject[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers,
    // Cache for 4 hours to minimize rate limit hits
    // Project data doesn't change frequently, so longer cache is safe
    next: { revalidate: 14400 }, // 4 hours = 14400 seconds
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  const data = (await res.json()) as GithubRepo[];

  // Optimized: single pass with pre-computed values for sorting
  const mapped: MappedProject[] = [];

  for (const r of data) {
    // Skip hidden/deprecated repos early
    if (r.name.startsWith(".") || r.name.endsWith("-deprecated")) continue;

    // Build stack array directly (avoid Set/Array conversion)
    const stack: string[] = [];
    if (r.language) stack.push(r.language);
    if (r.topics) {
      for (let i = 0; i < Math.min(5, r.topics.length); i++) {
        stack.push(r.topics[i]);
      }
    }

    // Optimized title: single regex pass (combines [-_] and whitespace)
    const title = r.name.replace(/[-_\s]+/g, " ").trim();

    mapped.push({
      title,
      stack,
      bullets: r.description ? [r.description] : [],
      repo: r.html_url,
      demo: normalizeHomepage(r.homepage),
      stars: r.stargazers_count,
      updatedAt: r.updated_at,
      image: `/api/github-og?owner=${encodeURIComponent(username)}&repo=${encodeURIComponent(r.name)}`,
      repoName: r.name,
    });
  }

  // Optimized sort: pre-compute all sort keys once to avoid repeated Date() calls
  const sortData = mapped.map((item) => ({
    item,
    demo: item.demo ? 1 : 0,
    stars: item.stars ?? 0,
    updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
  }));

  sortData.sort((a, b) => {
    const demoDiff = b.demo - a.demo;
    if (demoDiff !== 0) return demoDiff;
    const starsDiff = b.stars - a.stars;
    if (starsDiff !== 0) return starsDiff;
    return b.updatedAt - a.updatedAt;
  });

  // Return sorted items
  return sortData.map((d) => d.item);
}

// Export the function directly - the fetch cache handles API response caching,
// and the caller (getCachedProjects) handles caching the final processed result.
// This avoids redundant caching layers while maintaining optimal performance.
export async function fetchGithubProjects(username: string): Promise<MappedProject[]> {
  return _fetchGithubProjects(username);
}


