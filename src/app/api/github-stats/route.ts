import { NextResponse } from "next/server";
import { fetchGithubProjects } from "@/lib/github";
import { profile } from "@/data/resume";

type Stats = {
  username: string;
  totalStars: number;
  repoCount: number;
  topLanguages: { name: string; count: number }[];
  monthlyActivity: { month: string; count: number }[]; // last 12 months, YYYY-MM
};

export async function GET() {
  const username = profile.github?.split("/").pop() || "Pragadees15";
  try {
    const projects = await fetchGithubProjects(username);
    const totalStars = projects.reduce((acc, p) => acc + (p.stars || 0), 0);
    const repoCount = projects.length;

    // Aggregate languages from project.stack and primary language signal
    const langMap = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.stack || []) {
        // Heuristic: count common languages and techs; normalize label
        const key = t.trim();
        if (!key) continue;
        const prev = langMap.get(key) || 0;
        langMap.set(key, prev + 1);
      }
    }
    const topLanguages = Array.from(langMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Monthly activity: use updatedAt timestamps of repos as a proxy
    const months = new Map<string, number>();
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.set(key, 0);
    }
    for (const p of projects) {
      if (!p.updatedAt) continue;
      const d = new Date(p.updatedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (months.has(key)) months.set(key, (months.get(key) || 0) + 1);
    }
    const monthlyActivity = Array.from(months.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));

    const payload: Stats = {
      username,
      totalStars,
      repoCount,
      topLanguages,
      monthlyActivity,
    };
    return NextResponse.json(payload, { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" } });
  } catch (e) {
    return NextResponse.json({ error: "Failed to load GitHub stats" }, { status: 500 });
  }
}


