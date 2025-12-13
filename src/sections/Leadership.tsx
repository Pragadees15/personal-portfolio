"use client";

import { ArrowUpRight, Users } from "lucide-react";
import { useState } from "react";
import { leadership } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

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
	if (k.includes("mentor") || k.includes("mentoring") || k.includes("coach")) {
		return [
			{ src: "https://cdn.simpleicons.org/stackoverflow", alt: "Mentoring" },
			{ src: "https://cdn.simpleicons.org/python", alt: "Python" },
		];
	}
	if (k.includes("python")) return [{ src: "https://cdn.simpleicons.org/python", alt: "Python" }];
	if (k.includes("ml") || k.includes("machine learning") || k.includes("ai")) {
		return [
			{ src: "https://cdn.simpleicons.org/pytorch", alt: "ML" },
			{ src: "https://cdn.simpleicons.org/tensorflow", alt: "ML" },
		];
	}
	if (k.includes("ui/ux") || k.includes("ux") || k.includes("ui")) return [{ src: "https://cdn.simpleicons.org/figma", alt: "Figma" }];
	if (k.includes("community") || k.includes("cohort") || k.includes("club")) return [{ src: "https://cdn.simpleicons.org/discord", alt: "Community" }];
	return [];
}

function ActivityLogo({ title, role, org, size = 32 }: { title: string; role?: string; org?: string; size?: number }) {
	const candidates = getActivityLogoCandidates(title, role, org);
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
				className={cn("select-none object-contain", isClearbit ? "w-[85%] h-[85%]" : "w-full h-full")}
			/>
		</div>
	);
}

function ImpactStat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-zinc-200/60 bg-white/60 px-3 py-2 text-left text-sm shadow-sm ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">
			<dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</dt>
			<dd className="mt-0.5 text-base font-semibold text-zinc-900 dark:text-white">{value}</dd>
		</div>
	);
}

function ActivityTag({ tag }: { tag: string }) {
	return <span className="rounded-full border border-indigo-100/60 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200">{tag}</span>;
}

export function Leadership() {
	return (
		<section id="leadership" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
			<SectionHeading subtitle="Clubs, initiatives, and contributions">Leadership & Activities</SectionHeading>
			{leadership.length === 0 ? (
				<div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No leadership activities to display.</div>
			) : (
				<div className="relative mt-8">
					<div className="pointer-events-none absolute left-5 top-0 bottom-6 w-px bg-gradient-to-b from-indigo-400/50 via-zinc-200/50 to-transparent dark:from-indigo-500/50 dark:via-white/10" aria-hidden />
					<div className="space-y-6">
						{leadership.map((activity, i) => (
							<Reveal key={activity.title} delay={i * 0.05}>
								<article className="relative pl-14">
									<div className="absolute left-0 top-7 flex items-center justify-center rounded-xl border border-white/70 bg-white p-2 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-zinc-900">
										<ActivityLogo title={activity.title} role={activity.role} org={activity.org} size={32} />
									</div>
									<div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-5 text-sm text-zinc-700 shadow-sm ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div className="space-y-1">
												{activity.role && <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">{activity.role}</p>}
												<p className="text-lg font-semibold text-zinc-900 dark:text-white">{activity.title}</p>
												{activity.org && <p className="text-sm text-zinc-500 dark:text-zinc-400">{activity.org}</p>}
											</div>
											<div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
												{activity.timeframe && <p>{activity.timeframe}</p>}
												{activity.location && <p>{activity.location}</p>}
											</div>
										</div>

										<p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{activity.description}</p>

										{activity.bullets?.length ? (
											<ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
												{activity.bullets.map((bullet) => (
													<li key={`${activity.title}-${bullet}`} className="flex gap-2">
														<span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-indigo-400 dark:bg-indigo-300" aria-hidden />
														<span className="flex-1">{bullet}</span>
													</li>
												))}
											</ul>
										) : null}

										{activity.impact?.length ? (
											<dl className="mt-4 grid gap-2 sm:grid-cols-2">
												{activity.impact.map((stat) => (
													<ImpactStat key={`${activity.title}-${stat.label}`} label={stat.label} value={stat.value} />
												))}
											</dl>
										) : null}

										{activity.tags?.length ? (
											<div className="mt-4 flex flex-wrap gap-2">
												{activity.tags.map((tag) => (
													<ActivityTag key={`${activity.title}-${tag}`} tag={tag} />
												))}
											</div>
										) : null}

										{activity.link && (
											<a
												href={activity.link}
												target={activity.link.startsWith("http") ? "_blank" : undefined}
												rel={activity.link.startsWith("http") ? "noreferrer" : undefined}
												className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
											>
												View more
												<ArrowUpRight className="h-3.5 w-3.5" />
											</a>
										)}
									</div>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
