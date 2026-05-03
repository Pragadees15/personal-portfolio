"use client";

import { skillsGrouped } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * Skill icons render as CSS masks of the SimpleIcons SVGs, painted with
 * `currentColor`. This means they automatically adapt to light or dark mode
 * without filter trickery (no washed-out grey icons).
 */
function getSkillIconUrl(skill: string): string {
  const k = skill.toLowerCase();
  const base = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons";

  if (k === "python") return `${base}/python.svg`;
  if (k === "typescript") return `${base}/typescript.svg`;
  if (k === "javascript") return `${base}/javascript.svg`;
  if (k === "sql") return `${base}/postgresql.svg`;
  if (k === "java") return `${base}/openjdk.svg`;
  if (k === "dart") return `${base}/dart.svg`;
  if (k.includes("html")) return `${base}/html5.svg`;
  if (k.includes("css")) return `${base}/css3.svg`;
  if (k.includes("tensorflow")) return `${base}/tensorflow.svg`;
  if (k.includes("pytorch")) return `${base}/pytorch.svg`;
  if (k.includes("keras")) return `${base}/keras.svg`;
  if (k.includes("scikit") || k.includes("sklearn")) return `${base}/scikitlearn.svg`;
  if (k.includes("opencv")) return `${base}/opencv.svg`;
  if (k.includes("rapids") || k.includes("cudf") || k.includes("cuml")) return `${base}/nvidia.svg`;
  if (k.includes("hugging face") || k.includes("huggingface")) return `${base}/huggingface.svg`;
  if (k.includes("pandas")) return `${base}/pandas.svg`;
  if (k.includes("numpy")) return `${base}/numpy.svg`;
  if (k.includes("spss")) return `${base}/ibm.svg`;
  if (k.includes("jupyter")) return `${base}/jupyter.svg`;
  if (k.includes("react")) return `${base}/react.svg`;
  if (k.includes("next")) return `${base}/nextdotjs.svg`;
  if (k.includes("tailwind")) return `${base}/tailwindcss.svg`;
  if (k.includes("rest")) return `${base}/openapiinitiative.svg`;
  if (k.includes("flask")) return `${base}/flask.svg`;
  if (k.includes("node")) return `${base}/nodedotjs.svg`;
  if (k.includes("aws")) return `${base}/amazonaws.svg`;
  if (k.includes("oracle")) return `${base}/oracle.svg`;
  if (k.includes("vercel")) return `${base}/vercel.svg`;
  if (k.includes("github") || k === "git") return `${base}/github.svg`;
  if (k.includes("ci/cd")) return `${base}/githubactions.svg`;
  if (k.includes("serverless")) return `${base}/serverless.svg`;
  if (k.includes("docker")) return `${base}/docker.svg`;
  if (k.includes("streamlit")) return `${base}/streamlit.svg`;
  if (k.includes("vs code") || k.includes("vscode")) return `${base}/visualstudiocode.svg`;
  if (k.includes("matplotlib")) return `${base}/python.svg`;
  if (k.includes("seaborn") || k.includes("nltk") || k.includes("beautiful") || k.includes("pygame") || k.includes("pytesseract")) {
    return `${base}/python.svg`;
  }
  if (k.includes("hypothesis") || k.includes("stats")) return `${base}/wolfram.svg`;
  return `${base}/codecrafters.svg`;
}

function SkillIcon({ skill, size = 14 }: { skill: string; size?: number }) {
  const url = getSkillIconUrl(skill);
  return (
    <span
      aria-hidden
      className="icon-mask shrink-0 text-foreground/85 group-hover:text-foreground transition-colors"
      style={{
        width: size,
        height: size,
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
      }}
    />
  );
}

function SkillPill({ skill }: { skill: string }) {
  return (
    <span className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-foreground/15 bg-background px-4 py-2 transition-colors hover:border-foreground/40">
      <SkillIcon skill={skill} size={14} />
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-foreground/85 group-hover:text-foreground transition-colors">
        {skill}
      </span>
    </span>
  );
}

function Marquee({
  items,
  direction = "left",
  durationSec = 36,
}: {
  items: string[];
  direction?: "left" | "right";
  durationSec?: number;
}) {
  return (
    <div className="pause-on-hover relative max-w-full overflow-hidden mask-fade-x">
      <div
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap will-change-transform",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
        )}
        style={{ animationDuration: `${durationSec}s` }}
        aria-hidden
      >
        <div className="flex gap-3 pr-3">
          {items.map((skill, idx) => (
            <SkillPill key={`${skill}-${idx}-1`} skill={skill} />
          ))}
        </div>
        <div className="flex gap-3 pr-3">
          {items.map((skill, idx) => (
            <SkillPill key={`${skill}-${idx}-2`} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const groups: { title: string; index: string }[] = [
    { title: "Languages", index: "L" },
    { title: "AI / ML", index: "A" },
    { title: "Data Science", index: "D" },
    { title: "Web", index: "W" },
    { title: "Cloud / DevOps", index: "C" },
    { title: "Tools", index: "T" },
  ];

  const row1 = [
    ...skillsGrouped.languages,
    ...skillsGrouped.aiMl,
    ...skillsGrouped.dataScience,
  ];
  const row2 = [
    ...skillsGrouped.web,
    ...skillsGrouped.cloudDevops,
    ...skillsGrouped.tools,
  ];

  return (
    <section
      id="skills"
      className="site-container scroll-mt-24 overflow-hidden"
    >
      <SectionHeading number="03" subtitle="Stack — Tools of the trade">
        The <em className="italic">technical</em>
        {" arsenal."}
      </SectionHeading>

      <p className="-mt-6 mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Pragadeeswaran K works across the full ML stack — from Python, PyTorch
        and TensorFlow for deep learning research, to Next.js, React and
        Tailwind for shipping AI products. The trade-craft below is grouped
        by the layer it serves: languages, AI/ML frameworks, data science,
        web, cloud and developer tools.
      </p>

      <div className="mb-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 text-sm">
        {groups.map((g) => (
          <div key={g.title} className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
              {g.index}
            </span>
            <span className="font-display italic">{g.title}</span>
          </div>
        ))}
      </div>

      <div className="rule-h" />

      <div className="my-10 flex flex-col gap-5">
        <Marquee items={row1} direction="left" durationSec={42} />
        <Marquee items={row2} direction="right" durationSec={50} />
      </div>

      <div className="rule-h" />
    </section>
  );
}
