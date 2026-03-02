"use client";

import { researchInterests } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  Brain,
  Eye,
  Bot,
  Sparkles,
  MessageSquare,
  Zap,
  BarChart3,
  Image as ImageIcon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

// --- Types & Data ---

type ThemeColor = "indigo" | "emerald" | "amber" | "rose" | "cyan" | "violet" | "fuschia";

type InterestDetails = {
  description: string;
  tags: string[];
  color: ThemeColor;
  icon: LucideIcon;
  logos: { src: string; alt: string }[];
  gradient: string;
  glowColor: string;
};

function getInterestDetails(interest: string): InterestDetails {
  const key = interest.toLowerCase();

  if (key.includes("computer vision")) return {
    description: "Building intelligent systems that perceive and interpret visual data, from object detection to 3D scene reconstruction.",
    tags: ["Object Detection", "Segmentation", "3D Reconstruction", "NeRFs"],
    color: "cyan",
    icon: Eye,
    gradient: "from-cyan-500 via-blue-500 to-sky-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/opencv", alt: "OpenCV" },
      { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
      { src: "https://cdn.simpleicons.org/pytorch", alt: "PyTorch" },
    ]
  };
  if (key.includes("deep") || key.includes("learning")) return {
    description: "Architecting deep neural networks to solve complex, high-dimensional problems in perception and reasoning.",
    tags: ["Transformers", "CNNs", "Optimization", "Backprop"],
    color: "violet",
    icon: Brain,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glowColor: "rgba(139, 92, 246, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/pytorch", alt: "PyTorch" },
      { src: "https://cdn.simpleicons.org/tensorflow", alt: "TensorFlow" },
      { src: "https://cdn.simpleicons.org/keras", alt: "Keras" },
    ]
  };
  if (key.includes("reinforcement")) return {
    description: "Developing agents that learn optimal policies through trial, error, and reward maximization in complex environments.",
    tags: ["Q-Learning", "Policy Gradients", "Multi-Agent", "Sim-to-Real"],
    color: "rose",
    icon: Bot,
    gradient: "from-rose-500 via-pink-500 to-red-500",
    glowColor: "rgba(244, 63, 94, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/ray", alt: "Ray" },
      { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
    ]
  };
  if (key.includes("agentic")) return {
    description: "Designing autonomous systems capable of multi-step reasoning, tool use, and long-horizon planning.",
    tags: ["CoT Reasoning", "Tool Use", "Memory Systems", "Autonomy"],
    color: "indigo",
    icon: Sparkles,
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    glowColor: "rgba(99, 102, 241, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/langchain", alt: "LangChain" },
      { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
      { src: "https://cdn.simpleicons.org/anthropic", alt: "Anthropic" },
    ]
  };
  if (key.includes("generative")) return {
    description: "Exploring the frontiers of synthesis—creating high-fidelity images, text, and audio from latent representations.",
    tags: ["Diffusion", "GANs", "LLMs", "Prompt Eng"],
    color: "fuschia",
    icon: ImageIcon,
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    glowColor: "rgba(217, 70, 239, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI" },
      { src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" },
    ]
  };
  if (key.includes("nlp")) return {
    description: "Bridging human-computer interaction through advanced understanding and generation of natural language.",
    tags: ["BERT & GPT", "Tokenization", "Semantics", "RAG"],
    color: "amber",
    icon: MessageSquare,
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/huggingface", alt: "Hugging Face" },
      { src: "https://cdn.simpleicons.org/spacy", alt: "spaCy" },
    ]
  };
  if (key.includes("efficient")) return {
    description: "Optimizing model architecture and inference pipelines for edge devices and low-latency applications.",
    tags: ["Quantization", "Pruning", "Distillation", "TensorRT"],
    color: "emerald",
    icon: Zap,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/nvidia", alt: "NVIDIA" },
      { src: "https://cdn.simpleicons.org/onnx", alt: "ONNX" },
    ]
  };

  // Default/Fallback
  return {
    description: "Applying statistical rigor to extract meaningful insights from noisy, real-world datasets.",
    tags: ["Hypothesis Testing", "Bayesian", "Regression", "EDA"],
    color: "cyan",
    icon: BarChart3,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    logos: [
      { src: "https://cdn.simpleicons.org/r", alt: "R" },
      { src: "https://cdn.simpleicons.org/python", alt: "Python" },
    ]
  };
}

// Color maps for proper Tailwind class usage - muted colors for better readability
const iconColorMap: Record<ThemeColor, string> = {
  indigo: "text-indigo-500 dark:text-indigo-300",
  emerald: "text-emerald-500 dark:text-emerald-300",
  amber: "text-amber-500 dark:text-amber-300",
  rose: "text-rose-500 dark:text-rose-300",
  cyan: "text-cyan-500 dark:text-cyan-300",
  violet: "text-violet-500 dark:text-violet-300",
  fuschia: "text-fuchsia-500 dark:text-fuchsia-300",
};

const titleGradientMap: Record<ThemeColor, string> = {
  indigo: "from-indigo-500 to-indigo-400 dark:from-indigo-300 dark:to-indigo-200",
  emerald: "from-emerald-500 to-emerald-400 dark:from-emerald-300 dark:to-emerald-200",
  amber: "from-amber-500 to-amber-400 dark:from-amber-300 dark:to-amber-200",
  rose: "from-rose-500 to-rose-400 dark:from-rose-300 dark:to-rose-200",
  cyan: "from-cyan-500 to-cyan-400 dark:from-cyan-300 dark:to-cyan-200",
  violet: "from-violet-500 to-violet-400 dark:from-violet-300 dark:to-violet-200",
  fuschia: "from-fuchsia-500 to-fuchsia-400 dark:from-fuchsia-300 dark:to-fuchsia-200",
};

const arrowColorMap: Record<ThemeColor, string> = {
  indigo: "text-indigo-400 dark:text-indigo-300",
  emerald: "text-emerald-400 dark:text-emerald-300",
  amber: "text-amber-400 dark:text-amber-300",
  rose: "text-rose-400 dark:text-rose-300",
  cyan: "text-cyan-400 dark:text-cyan-300",
  violet: "text-violet-400 dark:text-violet-300",
  fuschia: "text-fuchsia-400 dark:text-fuchsia-300",
};

// --- Main Component ---

// Memoized card component to prevent unnecessary re-renders
const InterestCard = memo(function InterestCard({ 
  interest, 
}: { 
  interest: string; 
}) {
  const details = getInterestDetails(interest);
  const Icon = details.icon;

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-3xl group",
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200/50 dark:border-zinc-800/50",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-zinc-500/10 dark:hover:shadow-black/30",
        "hover:-translate-y-1",
        "will-change-transform"
      )}
    >
      {/* Gradient border on hover - simplified */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300",
          `bg-gradient-to-br ${details.gradient}`
        )}
        style={{
          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300",
          `bg-gradient-to-br ${details.gradient}`
        )}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col p-6 lg:p-8 min-h-[320px] z-10">
        {/* Icon */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-2xl",
              "bg-gradient-to-br from-zinc-100 to-zinc-200/50 dark:from-zinc-800 dark:to-zinc-900/50",
              "transition-transform duration-300 group-hover:scale-105"
            )}
          >
            <Icon
              size={28}
              className={cn(
                "relative z-10 transition-transform duration-300",
                iconColorMap[details.color],
                "group-hover:scale-105"
              )}
            />
          </div>

          {/* Arrow indicator */}
          <div
            className={cn(
              arrowColorMap[details.color],
              "transition-all duration-300",
              "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            )}
          >
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-2xl font-bold tracking-tight leading-tight mb-4",
            "bg-clip-text text-transparent bg-gradient-to-r",
            titleGradientMap[details.color]
          )}
        >
          {interest}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
          {details.description}
        </p>

        {/* Tags - using CSS animation instead of Framer Motion */}
        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            {details.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-full",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "border border-zinc-200/50 dark:border-zinc-700/50",
                  "text-zinc-700 dark:text-zinc-300",
                  "transition-all duration-300",
                  "group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Static gradient line */}
          <div
            className={cn(
              "h-0.5 rounded-full opacity-60",
              `bg-gradient-to-r ${details.gradient}`
            )}
          />
        </div>
      </div>
    </div>
  );
});

export function Interests() {
  return (
    <section id="interests" className="site-container py-24 sm:py-32 scroll-mt-24 relative">

      <SectionHeading subtitle="Key areas of focus and technical exploration">
        Research Interests
      </SectionHeading>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {researchInterests.map((interest, index) => (
          <motion.div
            key={interest}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
          >
            <InterestCard interest={interest} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
