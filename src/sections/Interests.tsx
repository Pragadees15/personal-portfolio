"use client";

import { memo } from "react";
import {
  Brain,
  Eye,
  Bot,
  Sparkles,
  MessageSquare,
  Zap,
  BarChart3,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

import { researchInterests } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type InterestDetails = {
  description: string;
  tags: string[];
  icon: LucideIcon;
};

function getInterestDetails(interest: string): InterestDetails {
  const key = interest.toLowerCase();

  if (key.includes("computer vision"))
    return {
      description:
        "Building intelligent systems that perceive and interpret visual data — from object detection to 3D scene reconstruction.",
      tags: ["Detection", "Segmentation", "3D", "NeRFs"],
      icon: Eye,
    };
  if (key.includes("deep") || key.includes("learning"))
    return {
      description:
        "Architecting deep neural networks to solve complex, high-dimensional problems in perception and reasoning.",
      tags: ["Transformers", "CNNs", "Optimization", "Backprop"],
      icon: Brain,
    };
  if (key.includes("reinforcement"))
    return {
      description:
        "Developing agents that learn optimal policies through trial, error, and reward maximization in complex environments.",
      tags: ["Q-Learning", "Policy Gradients", "Multi-Agent", "Sim-to-Real"],
      icon: Bot,
    };
  if (key.includes("agentic"))
    return {
      description:
        "Designing autonomous systems capable of multi-step reasoning, tool use and long-horizon planning.",
      tags: ["CoT", "Tool Use", "Memory", "Autonomy"],
      icon: Sparkles,
    };
  if (key.includes("generative"))
    return {
      description:
        "Exploring the frontiers of synthesis — high-fidelity images, text and audio from latent representations.",
      tags: ["Diffusion", "GANs", "LLMs", "Prompting"],
      icon: ImageIcon,
    };
  if (key.includes("nlp"))
    return {
      description:
        "Bridging human-computer interaction through advanced understanding and generation of natural language.",
      tags: ["BERT", "GPT", "Tokenization", "RAG"],
      icon: MessageSquare,
    };
  if (key.includes("efficient"))
    return {
      description:
        "Optimizing model architecture and inference pipelines for edge devices and low-latency applications.",
      tags: ["Quantization", "Pruning", "Distillation", "TensorRT"],
      icon: Zap,
    };

  return {
    description:
      "Applying statistical rigor to extract meaningful insights from noisy, real-world datasets.",
    tags: ["Hypothesis Testing", "Bayesian", "Regression", "EDA"],
    icon: BarChart3,
  };
}

const InterestCard = memo(function InterestCard({
  interest,
  index,
}: {
  interest: string;
  index: number;
}) {
  const details = getInterestDetails(interest);
  const Icon = details.icon;
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-6 p-6 sm:p-8 min-h-[260px]",
        "card-flat hover-lift overflow-hidden",
      )}
    >
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
            {numeral}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          / area
        </span>
      </header>

      <h3 className="font-display text-3xl leading-tight">
        <span className="italic">{interest}</span>
      </h3>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {details.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {details.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="chip-mono">
            {tag}
          </span>
        ))}
      </div>

      {/* signature lime accent line that grows on hover */}
      <span
        className="absolute bottom-0 left-0 h-[2px] w-12 bg-foreground transition-all duration-500 group-hover:w-full group-hover:bg-[var(--accent-lime)]"
        aria-hidden
      />
    </article>
  );
});

export function Interests() {
  return (
    <section
      id="interests"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="02" subtitle="Research — Areas of focus">
        What I&apos;m <em className="italic">obsessing</em>
        {" over."}
      </SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {researchInterests.map((interest, idx) => (
          <InterestCard key={interest} interest={interest} index={idx} />
        ))}
      </div>
    </section>
  );
}
