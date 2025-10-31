import { leadership } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Leadership() {
  return (
    <section id="leadership" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Clubs, initiatives, and contributions">Leadership & Activities</SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        {leadership.map((h, i) => (
          <Reveal key={i} delay={i * 0.03}>
            <div className="">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
                {h}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


