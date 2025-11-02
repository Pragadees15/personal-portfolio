import { GraduationCap, MapPin } from "lucide-react";
import { education } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";

export function Education() {
  return (
    <section id="education" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="My academic background">Education</SectionHeading>
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <Card className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg border border-zinc-200/70 bg-white/60 p-2 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{e.degree}</CardTitle>
                    <div className="mt-1.5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                      {e.institution}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {e.location && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.location}
                        </span>
                      )}
                      {e.meta && (
                        <span className="rounded-full border border-zinc-200/70 bg-white/60 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">{e.meta}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


