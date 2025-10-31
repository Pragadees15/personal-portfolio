import { honors } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Honors() {
  return (
    <section id="honors" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Awards and recognitions">Honors & Achievements</SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        {honors.map((h, i) => (
          <Reveal key={i} delay={i * 0.03}>
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
              <div className="rounded-[calc(1rem-1px)] border border-zinc-200/70 bg-white/60 p-4 text-sm text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                {h}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


