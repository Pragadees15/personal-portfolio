"use client";

import DevTerminal from "@/components/DevTerminal";
import { SectionHeading } from "@/components/SectionHeading";

export function Terminal() {
  return (
    <section id="terminal" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Type commands to explore">Developer Terminal</SectionHeading>
      <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-3 sm:p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
        <DevTerminal />
      </div>
    </section>
  );
}

export default Terminal;


