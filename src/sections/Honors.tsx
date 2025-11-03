"use client";

import { Trophy } from "lucide-react";
import { honors } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useState } from "react";

type LogoCandidate = { src: string; alt: string };

function getHonorLogoCandidates(text: string): LogoCandidate[] {
	const k = text.toLowerCase();
	// Institutions / issuers (brand-safe)
	if (k.includes("srm")) return [{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRMIST" }];
	if (k.includes("nptel")) return [{ src: "https://logo.clearbit.com/nptel.ac.in", alt: "NPTEL" }];
	if (k.includes("aws")) return [
		{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" },
		{ src: "https://cdn.simpleicons.org/amazonaws", alt: "AWS" },
	];
	if (k.includes("oracle")) return [
		{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", alt: "Oracle" },
		{ src: "https://cdn.simpleicons.org/oracle", alt: "Oracle" },
	];
	if (k.includes("aicte")) return [{ src: "https://logo.clearbit.com/aicte-india.org", alt: "AICTE" }];
	if (k.includes("hackathon") || k.includes("hackstreet") || k.includes("webathon") || k.includes("digithon")) {
		return [
			{ src: "https://cdn.simpleicons.org/github", alt: "Open Source" },
		];
	}
	// For generic academic/honor, return no brand; fallback uses Trophy icon
	return [];
}

function HonorLogo({ text, size = 28 }: { text: string; size?: number }) {
	const candidates = getHonorLogoCandidates(text);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);
	const boxStyle = { width: size, height: size } as React.CSSProperties;

	const renderFallback = () => (
		<div
			className="flex-none flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
			style={boxStyle}
			aria-label="Honor"
		>
			<Trophy className="h-4 w-4" />
		</div>
	);

	if (exhausted) return renderFallback();

	const candidate = candidates[index];
	if (!candidate) {
		if (!exhausted) setExhausted(true);
		return renderFallback();
	}

	const { src, alt } = candidate;

	// Theme-adaptive for Simple Icons brands only
	if (src.includes("cdn.simpleicons.org/")) {
		const lightSrc = `${src}/000000`;
		const darkSrc = `${src}/ffffff`;
		return (
			<div
				className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden"
				style={boxStyle}
			>
				<img src={lightSrc} alt={alt} className="w-full h-full object-contain select-none dark:hidden" loading="lazy" decoding="async" />
				<img src={darkSrc} alt={alt} className="w-full h-full object-contain select-none hidden dark:block" loading="lazy" decoding="async" />
			</div>
		);
	}

	return (
		<div
			className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden"
			style={boxStyle}
		>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				decoding="async"
				onError={() => {
					if (index + 1 < candidates.length) setIndex(index + 1); else setExhausted(true);
				}}
				className="w-full h-full object-contain select-none"
			/>
		</div>
	);
}

export function Honors() {
	return (
		<section id="honors" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
			<SectionHeading subtitle="Awards and recognitions">Honors & Achievements</SectionHeading>
			{honors.length === 0 ? (
				<div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No honors to display.</div>
			) : (
			<div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
				{honors.map((h, i) => (
					<Reveal key={i} delay={i * 0.03}>
						<div className="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30 transition-transform duration-300 will-change-transform hover:-translate-y-1.5">
							<div className="flex items-start gap-3 sm:gap-4 rounded-[calc(1rem-1px)] border border-zinc-200/70 bg-white/60 p-4 sm:p-5 text-sm sm:text-base text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
								<HonorLogo text={h} size={28} />
								<span className="min-w-0">{h}</span>
							</div>
						</div>
					</Reveal>
				))}
			</div>
			)}
		</section>
	);
}


