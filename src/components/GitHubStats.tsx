"use client";

import { useEffect, useState } from "react";
import { Star, FolderGit2 } from "lucide-react";
import { motion } from "framer-motion";

type Stats = {
  username: string;
  totalStars: number;
  repoCount: number;
  topLanguages: { name: string; count: number }[];
  monthlyActivity: { month: string; count: number }[];
};

export default function GitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/github-stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        if (mounted) setStats(j);
      })
      .catch(() => mounted && setErr("Failed to load"));
    return () => {
      mounted = false;
    };
  }, []);

  if (err) return null;
  if (!stats) {
    return (
      <div className="mb-4">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
          Loading GitHub stats…
        </div>
      </div>
    );
  }

  const maxCount = Math.max(1, ...stats.monthlyActivity.map((m) => m.count));

  return (
    <div className="mb-6 sm:mb-8">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-[1fr_.9fr]">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur p-4 sm:p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
              <Star className="h-4 w-4 text-amber-500" /> {stats.totalStars.toLocaleString()} stars
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
              <FolderGit2 className="h-4 w-4" /> {stats.repoCount} repos
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Activity (last 12 months)</div>
            <div className="flex items-end gap-1.5 h-16">
              {stats.monthlyActivity.map((m, i) => (
                <motion.div
                  key={m.month}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="w-4 rounded-sm bg-gradient-to-t from-indigo-500/30 to-fuchsia-500/50 dark:from-indigo-500/40 dark:to-fuchsia-500/70"
                  style={{ height: `${(m.count / maxCount) * 100 || 4}%`, transformOrigin: "bottom" }}
                  title={`${m.month}: ${m.count}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur p-4 sm:p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-3">Top languages/tech</div>
          <div className="flex flex-wrap gap-2">
            {stats.topLanguages.map((l, i) => (
              <motion.span
                key={l.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-full border border-zinc-200/70 bg-white/80 px-3 py-1.5 text-xs text-zinc-700 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300"
                title={`${l.count} projects`}
              >
                {l.name}
              </motion.span>
            ))}
            {stats.topLanguages.length === 0 && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">No data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


