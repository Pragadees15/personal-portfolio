"use client";

import { useMemo } from "react";
import { BADGES, useAchievements } from "./AchievementsProvider";
import Modal from "@/components/Modal";

export default function AchievementShelf() {
  const { state, unlocked, total, isShelfOpen, setOpenShelf } = useAchievements();

  const progress = useMemo(() => Math.round((unlocked / total) * 100), [unlocked, total]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpenShelf(true)}
        aria-label="Open achievements"
        title={`Achievements ${unlocked}/${total}`}
        className="fixed bottom-6 right-24 z-[60] rounded-full border border-zinc-200/70 bg-white/70 px-2.5 py-2 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 max-sm:right-6 max-sm:bottom-20"
      >
        <span aria-hidden>🏆</span>
        <span className="sr-only">Open achievements</span>
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[10px] text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100">{unlocked}</span>
      </button>

      {/* Modal */}
      <Modal open={isShelfOpen} onClose={() => setOpenShelf(false)} title={`Achievements — ${progress}%`}>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {BADGES.map((b) => {
            const isUnlocked = state[b.key];
            return (
              <div
                key={b.key}
                className={("flex items-start gap-3 rounded-xl border p-3 transition " + (isUnlocked
                  ? "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/60"
                  : "border-dashed border-zinc-200/70 bg-white/60 opacity-70 dark:border-white/10 dark:bg-zinc-900/40"))}
              >
                <div className="text-xl" aria-hidden>{isUnlocked ? b.emoji : "🔒"}</div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{b.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}


