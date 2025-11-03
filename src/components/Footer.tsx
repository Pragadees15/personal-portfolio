"use client";

import Link from "next/link";
import { profile } from "@/data/resume";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-white/10" />
      <div className="site-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-xl p-6 sm:p-8 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900/50">
          <div className="inline-flex items-center gap-2 text-xs">
            <span className="rounded-full border border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{profile.name}</span>
            {profile.role && (
              <span className="rounded-full border border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{profile.role}</span>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
            <a href={profile.github} target="_blank" rel="noreferrer" className="transition hover:text-zinc-900 dark:hover:text-zinc-200">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-zinc-900 dark:hover:text-zinc-200">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="transition hover:text-zinc-900 dark:hover:text-zinc-200">Email</a>
            <Link href="#contact" className="transition hover:text-zinc-900 dark:hover:text-zinc-200">Contact</Link>
          </div>
          <div className="mt-5 h-px w-24 mx-auto bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-full" />
          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">© {year} {profile.name}. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}


