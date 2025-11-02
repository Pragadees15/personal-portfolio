import { Users } from "lucide-react";
import { leadership } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Leadership() {
  return (
    <section id="leadership" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Clubs, initiatives, and contributions">Leadership & Activities</SectionHeading>
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
        {leadership.map((h, i) => (
          <Reveal key={i} delay={i * 0.03}>
            <div className="">
              <div className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 text-sm sm:text-base text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200/70 bg-white/70 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                  <Users className="h-4 w-4" />
                </span>
                <span className="min-w-0">{h}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


