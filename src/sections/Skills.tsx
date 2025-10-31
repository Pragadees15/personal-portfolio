import { skillsGrouped } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Tools and technologies I use">Skills</SectionHeading>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(skillsGrouped).map(([group, items], gi) => (
          <Reveal key={group} delay={gi * 0.05}>
            <div className="">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/60">
                <div className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{group}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((s, i) => (
                    <span key={s} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


