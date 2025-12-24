"use client";

import { skillsGrouped } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

import { cn } from "@/lib/utils";

// --- Logo Logic (Preserved) ---
type LogoCandidate = { src: string; alt: string };

function getSkillLogoCandidates(skill: string): LogoCandidate[] {
  const k = skill.toLowerCase();
  // Languages
  if (k === "python") return [{ src: "https://cdn.simpleicons.org/python", alt: "Python" }];
  if (k === "typescript") return [{ src: "https://cdn.simpleicons.org/typescript", alt: "TypeScript" }];
  if (k === "javascript") return [{ src: "https://cdn.simpleicons.org/javascript", alt: "JavaScript" }];
  if (k === "sql") return [
    { src: "https://cdn.simpleicons.org/postgresql", alt: "SQL" },
    { src: "https://cdn.simpleicons.org/mysql", alt: "MySQL" }
  ];
  if (k === "java") return [{ src: "https://cdn.simpleicons.org/openjdk", alt: "Java" }];
  if (k === "dart") return [{ src: "https://cdn.simpleicons.org/dart", alt: "Dart" }];
  if (k.includes("html")) return [{ src: "https://cdn.simpleicons.org/html5", alt: "HTML5" }];
  if (k.includes("css")) return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/css3.svg", alt: "CSS3" }];

  // AI/ML Frameworks
  if (k.includes("tensorflow")) return [{ src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" }];
  if (k.includes("pytorch")) return [{ src: "https://cdn.simpleicons.org/pytorch", alt: "PyTorch" }];
  if (k.includes("keras")) return [{ src: "https://cdn.simpleicons.org/keras", alt: "Keras" }];
  if (k.includes("scikit") || k.includes("sklearn")) return [{ src: "https://cdn.simpleicons.org/scikitlearn", alt: "scikit-learn" }];
  if (k.includes("opencv")) return [{ src: "https://cdn.simpleicons.org/opencv", alt: "OpenCV" }];
  if (k.includes("rapids") || k.includes("cudf") || k.includes("cuml")) return [{ src: "https://cdn.simpleicons.org/nvidia", alt: "NVIDIA RAPIDS" }];


  // Libraries
  if (k.includes("hugging face") || k.includes("huggingface")) return [{ src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" }];
  if (k.includes("pandas")) return [{ src: "https://cdn.simpleicons.org/pandas", alt: "Pandas" }];
  if (k.includes("numpy")) return [{ src: "https://cdn.simpleicons.org/numpy", alt: "NumPy" }];
  if (k.includes("spss")) return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ibm.svg", alt: "IBM SPSS" }];
  if (k.includes("jupyter")) return [{ src: "https://cdn.simpleicons.org/jupyter", alt: "Jupyter" }];

  // Web Dev
  if (k.includes("react")) return [{ src: "https://cdn.simpleicons.org/react", alt: "React" }];
  if (k.includes("next")) return [{ src: "https://cdn.simpleicons.org/nextdotjs", alt: "Next.js" }];
  if (k.includes("tailwind")) return [{ src: "https://cdn.simpleicons.org/tailwindcss", alt: "Tailwind CSS" }];
  if (k.includes("rest")) return [{ src: "https://cdn.simpleicons.org/openapiinitiative", alt: "OpenAPI" }];
  if (k.includes("flask")) return [{ src: "https://cdn.simpleicons.org/flask", alt: "Flask" }];
  if (k.includes("node")) return [{ src: "https://cdn.simpleicons.org/nodedotjs", alt: "Node.js" }];

  // Cloud & DevOps
  if (k.includes("aws")) return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" }];
  if (k.includes("oracle")) return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", alt: "Oracle Cloud" }];
  if (k.includes("vercel")) return [{ src: "https://cdn.simpleicons.org/vercel", alt: "Vercel" }];
  if (k.includes("github") || k === "git") return [{ src: "https://cdn.simpleicons.org/github", alt: "GitHub" }];
  if (k.includes("ci/cd")) return [{ src: "https://cdn.simpleicons.org/githubactions", alt: "CI/CD" }];
  if (k.includes("serverless")) return [{ src: "https://cdn.simpleicons.org/serverless", alt: "Serverless" }];
  if (k.includes("docker")) return [{ src: "https://cdn.simpleicons.org/docker", alt: "Docker" }];

  // Tools
  if (k.includes("streamlit")) return [{ src: "https://cdn.simpleicons.org/streamlit", alt: "Streamlit" }];
  if (k.includes("vs code") || k.includes("vscode")) return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/visualstudiocode.svg", alt: "VS Code" }];

  // Fallback
  if (k.includes("nltk") || k.includes("matplotlib") || k.includes("seaborn") || k.includes("beautiful") || k.includes("pygame")) {
    return [{ src: "https://cdn.simpleicons.org/python", alt: "Python Lib" }];
  }

  return [{ src: "https://cdn.simpleicons.org/circle", alt: skill }];
}

function SkillLogo({ skill, size = 24 }: { skill: string; size?: number }) {
  const candidates = getSkillLogoCandidates(skill);
  const { src, alt } = candidates[0];

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="select-none brightness-0 dark:invert opacity-80"
      />
    </div>
  );
}

// --- Marquee Components ---

function Marquee({
  items,
  direction = "left",
  speed = 30,
  className
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("pause-on-hover relative z-20 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]", className)}
    >
      <div
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap will-change-transform",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
        aria-hidden="true" // Wrapper handles structure; content redundant for screen readers if duplicated? Actually nice to hide duplicate.
      >
        <div className="flex gap-3 sm:gap-4 pr-3 sm:pr-4">
          {items.map((skill, idx) => (
            <SkillPill key={`${skill}-${idx}-1`} skill={skill} />
          ))}
        </div>
        <div className="flex gap-3 sm:gap-4 pr-3 sm:pr-4">
          {items.map((skill, idx) => (
            <SkillPill key={`${skill}-${idx}-2`} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillPill({ skill }: { skill: string }) {
  return (
    <div className="group relative flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-default">
      <SkillLogo skill={skill} size={18} />
      <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
        {skill}
      </span>
    </div>
  );
}

// --- Main Component ---

export function Skills() {
  // Organizing skills into 2 coherent rows
  const row1 = [
    ...skillsGrouped.languages,
    ...skillsGrouped.aiMl,
    ...skillsGrouped.dataScience
  ];

  const row2 = [
    ...skillsGrouped.web,
    ...skillsGrouped.cloudDevops,
    ...skillsGrouped.tools
  ];

  return (
    <section id="skills" className="site-container py-24 scroll-mt-24 overflow-hidden">
      <SectionHeading subtitle="My Technical Arsenal">Skills & Tools</SectionHeading>

      <div className="mt-16 flex flex-col gap-10 relative">


        <Marquee items={row1} direction="left" speed={40} />
        <Marquee items={row2} direction="right" speed={50} />
      </div>
    </section>
  );
}
