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

export function getGithubUsernameFromUrl(gh?: string | null): string {
  if (typeof gh === "string" && gh.length > 0) {
    try {
      const u = new URL(gh);
      const m = (u.pathname || "").match(/\/([^\/]+)\/?$/);
      if (m && m[1]) return m[1];
    } catch {
      const m = gh.match(/\/([^\/]+)\/?$/);
      if (m && m[1]) return m[1];
    }
  }
  return "Pragadees15";
}

// Optimized: early returns and single trim operation
function normalizeHomepage(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  return trimmed && (trimmed.startsWith("http://") || trimmed.startsWith("https://")) ? trimmed : undefined;
}

function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const parts = linkHeader.split(",");
  for (const p of parts) {
    const m = p.match(/<([^>]+)>\s*;\s*rel="next"/);
    if (m && m[1]) return m[1];
  }
  return null;
}

function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal === "undefined") return undefined;
  if ("timeout" in AbortSignal) {
    return (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout(ms);
  }
  return undefined;
}

async function fetchGithubReposPage(url: string, headers: Record<string, string>): Promise<{ repos: GithubRepo[]; nextUrl: string | null }> {
  const res = await fetch(url, {
    headers,
    next: { revalidate: 14400 },
    signal: timeoutSignal(10_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub API failed (${res.status}) ${(detail || "").slice(0, 200)}`);
  }
  const repos = (await res.json()) as GithubRepo[];
  const nextUrl = parseNextLink(res.headers.get("link"));
  return { repos, nextUrl };
}

async function _fetchGithubProjects(username: string): Promise<MappedProject[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-app",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const firstUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;

  const data: GithubRepo[] = [];
  let url: string | null = firstUrl;
  let pages = 0;

  while (url && pages < 3) {
    const page = await fetchGithubReposPage(url, headers);
    data.push(...page.repos);
    url = page.nextUrl;
    pages++;
  }

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


