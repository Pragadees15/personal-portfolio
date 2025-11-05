"use client";

import { Users } from "lucide-react";
import { leadership } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useState } from "react";

type LogoCandidate = { src: string; alt: string };

function getActivityLogoCandidates(text: string): LogoCandidate[] {
	const k = text.toLowerCase();
	// Hackathon-related → use valid brand(s)
	if (k.includes("hackathon") || k.includes("hackstreet") || k.includes("webathon") || k.includes("digithon")) return [
		{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRMIST" },
		{ src: "https://cdn.simpleicons.org/devpost", alt: "Hackathon" },
		{ src: "https://cdn.simpleicons.org/github", alt: "Open Source" },
	];
	// Open-source
	if (k.includes("open-source") || k.includes("open source") || k.includes("oss")) return [
		{ src: "https://cdn.simpleicons.org/github", alt: "GitHub" },
		{ src: "https://cdn.simpleicons.org/git", alt: "Git" },
	];
	// Mentoring
	if (k.includes("mentor") || k.includes("mentoring")) return [
		{ src: "https://cdn.simpleicons.org/stackoverflow", alt: "Mentoring" },
		{ src: "https://cdn.simpleicons.org/python", alt: "Python" },
	];
	// Tech keywords
	if (k.includes("python")) return [{ src: "https://cdn.simpleicons.org/python", alt: "Python" }];
	if (k.includes("ml") || k.includes("machine learning")) return [{ src: "https://cdn.simpleicons.org/pytorch", alt: "ML" }, { src: "https://cdn.simpleicons.org/tensorflow", alt: "ML" }];
	if (k.includes("ui/ux") || k.includes("ux") || k.includes("ui")) return [{ src: "https://cdn.simpleicons.org/figma", alt: "Figma" }];
	if (k.includes("community") || k.includes("communities")) return [{ src: "https://cdn.simpleicons.org/discord", alt: "Community" }];
	// Default: no brand -> fallback icon
	return [];
}

function ActivityLogo({ text, size = 28 }: { text: string; size?: number }) {
	const candidates = getActivityLogoCandidates(text);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);
	const boxStyle = { width: size, height: size } as React.CSSProperties;

	const renderFallback = () => (
		<div
			className="flex-none flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
			style={boxStyle}
			aria-label="Activity"
		>
			<Users className="h-4 w-4" />
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

	// For clearbit logos (like SRM), add padding to ensure proper fit
	const isClearbit = src.includes("logo.clearbit.com");
	return (
		<div
			className="flex-none rounded-[4px] ring-1 ring-zinc-200/70 dark:ring-white/10 bg-white dark:bg-zinc-800 overflow-hidden flex items-center justify-center"
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
				className={`select-none ${isClearbit ? "w-[85%] h-[85%] object-contain" : "w-full h-full object-contain"}`}
			/>
		</div>
	);
}

export function Leadership() {
	return (
		<section id="leadership" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
			<SectionHeading subtitle="Clubs, initiatives, and contributions">Leadership & Activities</SectionHeading>
			{leadership.length === 0 ? (
				<div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No leadership activities to display.</div>
			) : (
			<div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
				{leadership.map((h, i) => (
					<Reveal key={i} delay={i * 0.03}>
						<div className="">
							<div className="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30 transition-transform duration-300 will-change-transform hover:-translate-y-1.5">
								<div className="flex items-start gap-3 sm:gap-4 rounded-[calc(1rem-1px)] border border-zinc-200/70 bg-white/70 backdrop-blur-xl p-4 sm:p-5 text-sm sm:text-base text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
									<ActivityLogo text={h} size={28} />
									<span className="min-w-0">{h}</span>
								</div>
							</div>
						</div>
					</Reveal>
				))}
			</div>
			)}
		</section>
	);
}


