import { Building2, MapPin, Clock } from "lucide-react";
import { experiences } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Roles and impact">Experience</SectionHeading>
      <div className="relative grid gap-5 sm:gap-6 pl-6 md:pl-8">
        {/* timeline spine */}
        <span aria-hidden className="pointer-events-none absolute left-2 top-0 h-full w-px bg-zinc-200 dark:bg-white/10" />
        {experiences.map((x, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="relative pl-4 md:pl-6">
              {/* timeline node */}
              <span aria-hidden className="absolute -left-[22px] top-5 h-3 w-3 rounded-full bg-zinc-400 ring-2 ring-white/80 shadow dark:bg-white/30 dark:ring-zinc-900/80" />
              <div className="">
                <Card className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg border border-zinc-200/70 bg-white/60 p-2 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{x.title}</CardTitle>
                        <div className="mt-1.5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">{x.org}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {x.location && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                              <MapPin className="h-3.5 w-3.5" />
                              {x.location}
                            </span>
                          )}
                          {(x.start || x.end) && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                              <Clock className="h-3.5 w-3.5" />
                              {[x.start, x.end].filter(Boolean).join(" — ")}
                            </span>
                          )}
                        </div>
                        {x.bullets?.length ? (
                          <ul className="mt-3 sm:mt-4 list-disc space-y-1.5 sm:space-y-2 pl-5 sm:pl-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                            {x.bullets.map((b, j) => (
                              <li key={j}>{b}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
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


