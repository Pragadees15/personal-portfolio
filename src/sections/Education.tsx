import { education } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";

export function Education() {
  return (
    <section id="education" className="site-container py-20 scroll-mt-24">
      <SectionHeading subtitle="My academic background">Education</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <Card className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/60">
              <CardTitle className="text-zinc-900 dark:text-zinc-50">{e.degree}</CardTitle>
              <CardContent>
                <div className="text-sm text-zinc-700 dark:text-zinc-300">{e.institution}{e.location ? ` • ${e.location}` : ""}</div>
                {e.meta && <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{e.meta}</div>}
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


