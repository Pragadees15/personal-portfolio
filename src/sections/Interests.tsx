import { researchInterests } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Interests() {
  return (
    <section id="interests" className="site-container py-20 scroll-mt-24">
      <SectionHeading subtitle="Topics I’m exploring">Research Interests</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {researchInterests.map((s, i) => (
          <Reveal key={s} delay={i * 0.03}>
            <span className="rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-sm text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
              {s}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


