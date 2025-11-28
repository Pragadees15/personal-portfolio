"use client";

import { Code, Brain, Wrench, Cloud, Database, Sparkles } from "lucide-react";
import { skillsGrouped } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { useState } from "react";
 

type LogoCandidate = { src: string; alt: string };

function getSkillLogoCandidates(skill: string): LogoCandidate[] {
  const k = skill.toLowerCase();
  // Languages
  if (k === "python") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];
  if (k === "typescript") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/typescript.svg", alt: "TypeScript" },
    { src: "https://cdn.simpleicons.org/typescript", alt: "TypeScript" },
  ];
  if (k === "javascript") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg", alt: "JavaScript" },
    { src: "https://cdn.simpleicons.org/javascript", alt: "JavaScript" },
  ];
  if (k === "sql") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postgresql.svg", alt: "SQL" },
    { src: "https://cdn.simpleicons.org/postgresql", alt: "SQL" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/mysql.svg", alt: "MySQL" },
    { src: "https://cdn.simpleicons.org/mysql", alt: "MySQL" },
  ];
  if (k === "java") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openjdk.svg", alt: "Java" },
    { src: "https://cdn.simpleicons.org/openjdk", alt: "Java" },
  ];
  if (k === "dart") return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dart.svg", alt: "Dart" },
    { src: "https://cdn.simpleicons.org/dart", alt: "Dart" },
  ];
  if (k.includes("html")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/html5.svg", alt: "HTML5" },
    { src: "https://cdn.simpleicons.org/html5", alt: "HTML5" },
  ];
  if (k.includes("css")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/css3.svg", alt: "CSS3" },
    { src: "https://cdn.simpleicons.org/css3", alt: "CSS3" },
  ];

  // AI/ML Frameworks
  if (k.includes("tensorflow")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tensorflow.svg", alt: "TensorFlow" },
    { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
  ];
  if (k.includes("pytorch")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pytorch.svg", alt: "PyTorch" },
    { src: "https://cdn.simpleicons.org/pytorch", alt: "PyTorch" },
  ];
  if (k.includes("keras")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/keras.svg", alt: "Keras" },
    { src: "https://cdn.simpleicons.org/keras", alt: "Keras" },
  ];
  if (k.includes("scikit") || k.includes("sklearn")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/scikitlearn.svg", alt: "scikit-learn" },
    { src: "https://cdn.simpleicons.org/scikitlearn", alt: "scikit-learn" },
  ];
  if (k.includes("opencv")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opencv.svg", alt: "OpenCV" },
    { src: "https://cdn.simpleicons.org/opencv", alt: "OpenCV" },
  ];
  if (k.includes("rapids") || k.includes("cudf") || k.includes("cuml")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nvidia.svg", alt: "NVIDIA RAPIDS" },
    { src: "https://cdn.simpleicons.org/nvidia", alt: "NVIDIA RAPIDS" },
  ];
  if (k.includes("stability ai") || k.includes("stabilityai")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/stabilityai.svg", alt: "Stability AI" },
  ];
  // Libraries without Simple Icons: map to Python
  if (k.includes("nltk")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];
  if (k.includes("seaborn")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];
  if (k.includes("matplotlib")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];
  if (k.includes("hugging face") || k.includes("huggingface")) return [{ src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" }];

  // Data Science
  if (k.includes("pandas")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pandas.svg", alt: "Pandas" },
    { src: "https://cdn.simpleicons.org/pandas", alt: "Pandas" },
  ];
  if (k.includes("numpy")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/numpy.svg", alt: "NumPy" },
    { src: "https://cdn.simpleicons.org/numpy", alt: "NumPy" },
  ];
  if (k.includes("spss")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ibm.svg", alt: "IBM SPSS" },
    { src: "https://cdn.simpleicons.org/ibm", alt: "IBM SPSS" },
  ];
  if (k.includes("jupyter")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/jupyter.svg", alt: "Jupyter" },
    { src: "https://cdn.simpleicons.org/jupyter", alt: "Jupyter" },
  ];

  // Web Dev
  if (k.includes("react")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/react.svg", alt: "React" },
    { src: "https://cdn.simpleicons.org/react", alt: "React" },
  ];
  if (k.includes("next")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg", alt: "Next.js" },
    { src: "https://cdn.simpleicons.org/nextdotjs", alt: "Next.js" },
  ];
  if (k.includes("tailwind")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tailwindcss.svg", alt: "Tailwind CSS" },
    { src: "https://cdn.simpleicons.org/tailwindcss", alt: "Tailwind CSS" },
  ];
  if (k.includes("rest")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openapiinitiative.svg", alt: "OpenAPI" },
    { src: "https://cdn.simpleicons.org/openapiinitiative", alt: "OpenAPI" },
  ];
  if (k.includes("flask")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/flask.svg", alt: "Flask" },
    { src: "https://cdn.simpleicons.org/flask", alt: "Flask" },
  ];
  if (k.includes("node")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nodedotjs.svg", alt: "Node.js" },
    { src: "https://cdn.simpleicons.org/nodedotjs", alt: "Node.js" },
  ];

  // Cloud & DevOps
  if (k.includes("aws")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" },
    { src: "https://cdn.simpleicons.org/amazonaws", alt: "AWS" },
  ];
  if (k.includes("oracle")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", alt: "Oracle Cloud" },
    { src: "https://cdn.simpleicons.org/oracle", alt: "Oracle Cloud" },
  ];
  if (k.includes("vercel")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg", alt: "Vercel" },
    { src: "https://cdn.simpleicons.org/vercel", alt: "Vercel" },
  ];
  if (k.includes("git/github") || k === "git/github" || k === "git,github" || k === "git/github" || k.includes("github")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg", alt: "GitHub" },
    { src: "https://cdn.simpleicons.org/github", alt: "GitHub" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/git.svg", alt: "Git" },
    { src: "https://cdn.simpleicons.org/git", alt: "Git" },
  ];
  if (k.includes("ci/cd") || k.includes("cicd") || k.includes("ci cd")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/githubactions.svg", alt: "CI/CD" },
    { src: "https://cdn.simpleicons.org/githubactions", alt: "CI/CD" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gitlab.svg", alt: "GitLab CI" },
    { src: "https://cdn.simpleicons.org/gitlab", alt: "GitLab CI" },
  ];
  if (k.includes("serverless")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/serverless.svg", alt: "Serverless" },
    { src: "https://cdn.simpleicons.org/serverless", alt: "Serverless" },
  ];
  if (k.includes("docker")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg", alt: "Docker" },
    { src: "https://cdn.simpleicons.org/docker", alt: "Docker" },
  ];

  // Other Tools
  if (k.includes("streamlit")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/streamlit.svg", alt: "Streamlit" },
    { src: "https://cdn.simpleicons.org/streamlit", alt: "Streamlit" },
  ];
  if (k.includes("vs code") || k.includes("vscode") || k.includes("visual studio code")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/visualstudiocode.svg", alt: "VS Code" },
    { src: "https://cdn.simpleicons.org/visualstudiocode", alt: "VS Code" },
  ];
  if (k.includes("beautiful soup") || k.includes("beautifulsoup")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];
  if (k.includes("pytesseract") || k.includes("tesseract")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opencv.svg", alt: "Tesseract" },
    { src: "https://cdn.simpleicons.org/opencv", alt: "Tesseract" },
  ];
  if (k.includes("pygame")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg", alt: "Python" },
    { src: "https://cdn.simpleicons.org/python", alt: "Python" },
  ];

  return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/circle.svg", alt: skill },
    { src: "https://cdn.simpleicons.org/circle", alt: skill },
  ];
}

function SkillLogo({ skill, size = 16 }: { skill: string; size?: number }) {
  const candidates = getSkillLogoCandidates(skill);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);

  if (exhausted) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-[4px] bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300"
        style={{ width: size, height: size, fontSize: Math.max(9, Math.floor(size * 0.55)) }}
        aria-label={skill}
      >
        {skill.split(" ").map((w) => w[0]).join("").slice(0, 2)}
      </span>
    );
  }

  const { src, alt } = candidates[index];

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (index + 1 < candidates.length) setIndex(index + 1); else setExhausted(true);
      }}
      className="select-none brightness-0 dark:invert dark:brightness-0"
    />
  );
}

const iconMap: Record<string, typeof Code> = {
  languages: Code,
  aiMl: Brain,
  cloudDevops: Cloud,
  dataScience: Database,
};

export function Skills() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  return (
    <section id="skills" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Tools and technologies I use">Skills</SectionHeading>
      
      <div className="grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(skillsGrouped).map(([group, items], gi) => {
          const Icon = iconMap[group] || Wrench;
          const isHovered = hoveredGroup === group;
          
          return (
            <Reveal key={group} delay={gi * 0.05}>
              <motion.div
                onHoverStart={() => setHoveredGroup(group)}
                onHoverEnd={() => setHoveredGroup(null)}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <div className="relative h-full rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:border-indigo-300/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 group overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 pointer-events-none"
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-fuchsia-100 p-2 shadow-sm dark:from-indigo-950/40 dark:to-fuchsia-950/40">
                        <Icon className={`h-4 w-4 transition-colors ${isHovered ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                        {group.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {items.map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: gi * 0.05 + i * 0.03, duration: 0.3 }}
                          whileHover={{ scale: 1.08, zIndex: 10 }}
                          className="relative inline-flex items-center gap-1.5 rounded-full border-2 border-zinc-200/70 bg-white/90 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-indigo-600/50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                        >
                          <SkillLogo skill={s} size={14} />
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    initial={{ x: '-100%', rotate: -45 }}
                    animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    style={{ width: '50%', height: '100%' }}
                  />
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
      
      {/* Additional visual element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400 inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Continuously learning and exploring new technologies
        </p>
      </motion.div>
    </section>
  );
}


