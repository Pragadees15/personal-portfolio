"use client";

import { researchInterests } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { useState } from "react";

type LogoCandidate = { src: string; alt: string };

function getLogoCandidates(interest: string): LogoCandidate[] {
  const key = interest.toLowerCase();
  // Using Simple Icons CDN (https://cdn.simpleicons.org)
  if (key.includes("computer vision")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opencv.svg", alt: "OpenCV" },
    { src: "https://cdn.simpleicons.org/opencv", alt: "OpenCV" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tensorflow.svg", alt: "TensorFlow" },
    { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
  ];
  if (key.includes("deep") || key.includes("learning")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pytorch.svg", alt: "PyTorch" },
    { src: "https://cdn.simpleicons.org/pytorch", alt: "PyTorch" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tensorflow.svg", alt: "TensorFlow" },
    { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
  ];
  if (key.includes("representation")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/scikitlearn.svg", alt: "scikit-learn" },
    { src: "https://cdn.simpleicons.org/scikitlearn", alt: "scikit-learn" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tensorflow.svg", alt: "TensorFlow" },
    { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
  ];
  if (key.includes("reinforcement")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ray.svg", alt: "Ray" },
    { src: "https://cdn.simpleicons.org/ray", alt: "Ray" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg", alt: "OpenAI" },
    { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
  ];
  if (key.includes("efficient") || key.includes("accelerated")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nvidia.svg", alt: "NVIDIA" },
    { src: "https://cdn.simpleicons.org/nvidia", alt: "NVIDIA" },
  ];
  if (key.includes("statistics")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/r.svg", alt: "R" },
    { src: "https://cdn.simpleicons.org/r", alt: "R" },
  ];
  if (key.includes("nlp")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/huggingface.svg", alt: "Hugging Face" },
    { src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/spacy.svg", alt: "spaCy" },
    { src: "https://cdn.simpleicons.org/spacy", alt: "spaCy" },
  ];
  if (key.includes("generative")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/stabilityai.svg", alt: "Stability AI" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg", alt: "OpenAI" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/huggingface.svg", alt: "Hugging Face" },
    { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
    { src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" },
  ];
  if (key.includes("agentic")) return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg", alt: "OpenAI" },
    { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/langchain.svg", alt: "LangChain" },
    { src: "https://cdn.simpleicons.org/langchain", alt: "LangChain" },
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/artificialintelligence.svg", alt: "AI" },
  ];
  return [
    { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/artificialintelligence.svg", alt: "AI" },
    { src: "https://cdn.simpleicons.org/artificialintelligence", alt: "AI" },
  ];
}

function Logo({ interest, size = 24 }: { interest: string; size?: number }) {
  const candidates = getLogoCandidates(interest);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  if (exhausted || candidates.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300"
        style={{ width: size, height: size, fontSize: Math.max(10, Math.floor(size * 0.5)) }}
        aria-label={interest}
      >
        {interest.split(" ").map((w) => w[0]).join("").slice(0, 2)}
      </div>
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
        if (index + 1 < candidates.length) {
          setIndex(index + 1);
        } else {
          setExhausted(true);
        }
      }}
      className="select-none brightness-0 dark:invert dark:brightness-0"
    />
  );
}

export function Interests() {
  return (
    <section id="interests" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Topics I'm actively exploring and researching">Research Interests</SectionHeading>

      <div className="mt-8 sm:mt-10">
        {/* Mobile: Simple tag layout with logos */}
        <div className="flex flex-wrap gap-3 sm:hidden">
          {researchInterests.map((interest, i) => (
            <Reveal key={interest} delay={i * 0.03}>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200/70 bg-white/80 backdrop-blur-xl px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-fuchsia-50 hover:shadow-md hover:text-indigo-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-indigo-600/50 dark:hover:from-indigo-950/40 dark:hover:to-fuchsia-950/40 dark:hover:text-indigo-300">
                <Logo interest={interest} size={16} />
                {interest}
              </span>
            </Reveal>
          ))}
        </div>

        {/* Desktop: Card grid layout with branded logos */}
        <div className="hidden sm:grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {researchInterests.map((interest, i) => (
            <Reveal key={interest} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative h-full"
              >
                <div className="relative h-full rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-fuchsia-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-fuchsia-500/10 group-hover:to-cyan-500/10 transition-all duration-300 pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-800 dark:ring-white/10">
                      <Logo interest={interest} size={28} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                        {interest}
                      </h3>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out pointer-events-none" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


