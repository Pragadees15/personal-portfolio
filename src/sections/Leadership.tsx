"use client";

import { ArrowUpRight, Users, Trophy, Code, Share2 } from "lucide-react";
import { useState } from "react";
import { leadership } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// --- Logo & Visual Logic ---

type LogoCandidate = { src: string; alt: string };

function getActivityLogoCandidates(...parts: Array<string | undefined>): LogoCandidate[] {
	const k = parts.filter(Boolean).join(" ").toLowerCase();
	if (!k) return [];
	if (k.includes("hackathon") || k.includes("hackstreet") || k.includes("webathon") || k.includes("digithon")) {
		return [
			{ src: "/logos/SRM.png", alt: "SRMIST" },
			{ src: "https://cdn.simpleicons.org/devpost", alt: "Hackathon" },
			{ src: "https://cdn.simpleicons.org/github", alt: "Open Source" },
		];
	}
	if (k.includes("open-source") || k.includes("open source") || k.includes("oss")) {
		return [
			{ src: "https://cdn.simpleicons.org/github", alt: "GitHub" },
			{ src: "https://cdn.simpleicons.org/git", alt: "Git" },
		];
	}
	if (k.includes("mentor") || k.includes("mentoring") || k.includes("community")) {
		return [
			{ src: "https://cdn.simpleicons.org/discord", alt: "Community" },
			{ src: "https://cdn.simpleicons.org/slack", alt: "Slack" },
		];
	}
	if (k.includes("python")) return [{ src: "https://cdn.simpleicons.org/python", alt: "Python" }];
	return [];
}

function ActivityLogo({ title, role, org, size = 48 }: { title: string; role?: string; org?: string; size?: number }) {
	const candidates = getActivityLogoCandidates(title, role, org);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);
	const boxStyle = { width: size, height: size } as React.CSSProperties;

	const renderFallback = () => (
		<div
			className="flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20"
			style={boxStyle}
			aria-label="Activity"
		>
			<Users className="w-1/2 h-1/2" />
		</div>
	);

	if (exhausted) return renderFallback();

	const candidate = candidates[index];
	if (!candidate) {
		if (!exhausted) setExhausted(true);
		return renderFallback();
	}

	const { src, alt } = candidate;

	const containerClass = "relative rounded-xl bg-white dark:bg-zinc-800/80 ring-1 ring-zinc-200 dark:ring-white/10 overflow-hidden shadow-sm flex items-center justify-center";

	if (src.includes("cdn.simpleicons.org/")) {
		return (
			<div className={containerClass} style={boxStyle}>
				<img src={`${src}/000000`} alt={alt} className="w-3/5 h-3/5 object-contain dark:hidden" loading="lazy" />
				<img src={`${src}/ffffff`} alt={alt} className="w-3/5 h-3/5 object-contain hidden dark:block" loading="lazy" />
			</div>
		);
	}

	return (
		<div className={containerClass} style={boxStyle}>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				onError={() => {
					if (index + 1 < candidates.length) setIndex(index + 1); else setExhausted(true);
				}}
				className="w-full h-full object-cover"
			/>
		</div>
	);
}

// --- New Bento Card Component ---

function BentoCard({
	children,
	className,
	spotlightColor = "rgba(99, 102, 241, 0.15)",
}: {
	children: React.ReactNode;
	className?: string;
	spotlightColor?: string;
}) {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	return (
		<div
			onMouseMove={onMouseMove}
			className={cn(
				"group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/10 hover:-translate-y-1",
				className
			)}
		>
			{/* Spotlight Gradient */}
			<motion.div
				className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
				style={{
					background: useMotionTemplate`
						radial-gradient(
							600px circle at ${mouseX}px ${mouseY}px,
							${spotlightColor},
							transparent 80%
						)
					`,
				}}
			/>

			{/* Mesh Gradient Background (Subtle) */}
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] -z-10" />

			{/* Content */}
			<div className="relative z-20 h-full">{children}</div>
		</div>
	);
}

// --- Icon Helpers ---

function getIconForActivity(index: number) {
	if (index === 0) return <Trophy className="w-5 h-5" />;
	if (index === 1) return <Code className="w-5 h-5" />;
	return <Share2 className="w-5 h-5" />;
}

// --- Main Section ---

export function Leadership() {
	return (
		<section id="leadership" className="site-container py-24 sm:py-32 scroll-mt-24">
			<SectionHeading subtitle="Impact & Community">
				Leadership & Activities
			</SectionHeading>

			<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
				{leadership.map((activity, i) => {
					// Layout: Item 0 -> span 2, Item 1 -> span 1, Item 2 -> span 3
					const spanClass =
						i === 0 ? "md:col-span-2" :
							i === 1 ? "md:col-span-1" :
								"md:col-span-3";

					return (
						<Reveal key={activity.title} delay={i * 0.15} className={cn("h-full", spanClass)}>
							<BentoCard className="h-full flex flex-col p-6 sm:p-8">
								<div className="flex flex-col h-full">
									{/* Top Row: Tag & Logo */}
									<div className="flex items-start justify-between mb-6">
										<div className="flex flex-col gap-2">
											<span className="inline-flex items-center gap-1.5 w-fit rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
												{getIconForActivity(i)}
												{activity.role || "Member"}
											</span>
											{activity.timeframe && (
												<span className="text-xs font-medium text-zinc-400 pl-1">
													{activity.timeframe}
												</span>
											)}
										</div>
										<ActivityLogo title={activity.title} role={activity.role} org={activity.org} size={52} />
									</div>

									{/* Main Content */}
									<div className="mb-6">
										<h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
											{activity.title}
										</h3>
										{activity.org && (
											<p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
												{activity.org}
											</p>
										)}
										<p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300/90 max-w-2xl">
											{activity.description}
										</p>
									</div>

									{/* Divider */}
									<div className="mt-auto pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-wrap gap-x-8 gap-y-4 items-end justify-between">

										{/* Impacts */}
										{activity.impact?.length ? (
											<div className="flex flex-wrap gap-6">
												{activity.impact.map((stat) => (
													<div key={stat.label} className="flex flex-col">
														<span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
															{stat.value}
														</span>
														<span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
															{stat.label}
														</span>
													</div>
												))}
											</div>
										) : <div />}

										{/* Action Link */}
										{activity.link && (
											<a
												href={activity.link}
												target={activity.link.startsWith("http") ? "_blank" : undefined}
												rel={activity.link.startsWith("http") ? "noreferrer" : undefined}
												className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition-all hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
											>
												See Proof
												<ArrowUpRight className="h-3.5 w-3.5" />
											</a>
										)}
									</div>
								</div>
							</BentoCard>
						</Reveal>
					);
				})}
			</div>
		</section>
	);
}
