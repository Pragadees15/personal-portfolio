import { experiences } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="site-container py-20 scroll-mt-24">
      <SectionHeading subtitle="Roles and impact">Experience</SectionHeading>
      <div className="relative grid gap-4 pl-6 md:pl-8">
        {/* timeline spine */}
        <span aria-hidden className="pointer-events-none absolute left-2 top-0 h-full w-px bg-zinc-200 dark:bg-white/10" />
        {experiences.map((x, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="relative pl-4 md:pl-6">
              {/* timeline node */}
              <span aria-hidden className="absolute -left-[22px] top-5 h-3 w-3 rounded-full bg-zinc-400 ring-2 ring-white/80 shadow dark:bg-white/30 dark:ring-zinc-900/80" />
              <div className="">
                <Card className="rounded-2xl border border-zinc-200 bg-white transition hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                <CardTitle className="text-zinc-900 dark:text-zinc-50">{x.title}</CardTitle>
                <CardContent>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300">{x.org}{x.location ? ` • ${x.location}` : ""}</div>
                  {(x.start || x.end) && (
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{[x.start, x.end].filter(Boolean).join(" — ")}</div>
                  )}
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {x.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


