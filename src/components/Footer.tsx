"use client";

import Link from "next/link";
import { profile } from "@/data/resume";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-zinc-200/70 py-8 dark:border-white/10">
      <div className="site-container flex flex-col items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-4">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-200">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-200">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-zinc-900 dark:hover:text-zinc-200">Email</a>
          <Link href="#contact" className="hover:text-zinc-900 dark:hover:text-zinc-200">Contact</Link>
        </div>
        <div className="text-xs">© {year} {profile.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}


