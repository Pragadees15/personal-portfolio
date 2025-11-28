"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { honors } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useState } from "react";
import { cn } from "@/lib/utils";

type LogoCandidate = { src: string; alt: string };

function getHonorLogoCandidates(...parts: Array<string | undefined>): LogoCandidate[] {
	const k = parts.filter(Boolean).join(" ").toLowerCase();
	if (!k) return [];
	// Institutions / issuers (brand-safe)
	if (k.includes("srm")) return [{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRMIST" }];
	if (k.includes("cgpa")) return [{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRMIST" }];
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
			{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRMIST" },
			{ src: "https://cdn.simpleicons.org/github", alt: "Open Source" },
		];
	}
	// For generic academic/honor, return no brand; fallback uses Trophy icon
	return [];
}

function HonorLogo({ title, issuer, size = 32 }: { title: string; issuer?: string; size?: number }) {
	const candidates = getHonorLogoCandidates(title, issuer);
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

function HighlightStat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-zinc-200/60 bg-white/60 px-3 py-2 text-left shadow-sm ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40">
			<dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</dt>
			<dd className="mt-0.5 text-base font-semibold text-zinc-800 dark:text-zinc-100">{value}</dd>
		</div>
	);
}

function HonorTag({ tag }: { tag: string }) {
	return <span className="rounded-full border border-indigo-100/60 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200">{tag}</span>;
}

export function Honors() {
	return (
		<section id="honors" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
			<SectionHeading subtitle="Awards and recognitions">Honors & Achievements</SectionHeading>
			{honors.length === 0 ? (
				<div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No honors to display.</div>
			) : (
				<div className="mt-6 grid gap-5 sm:grid-cols-2">
					{honors.map((honor, i) => (
						<Reveal key={`${honor.title}-${i}`} delay={i * 0.05}>
							<article className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/70 p-[1px] shadow-sm ring-1 ring-black/5 backdrop-blur transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/50 dark:ring-white/5">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-transparent to-fuchsia-500/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-400/20 dark:to-fuchsia-500/25" aria-hidden />
								<div className="relative flex h-full flex-col gap-4 rounded-[calc(1rem-1px)] border border-white/60 bg-white/80 p-5 text-sm text-zinc-700 shadow-inner dark:border-white/5 dark:bg-zinc-900/70 dark:text-zinc-200">
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-start gap-3">
											<HonorLogo title={honor.title} issuer={honor.issuer} size={38} />
											<div>
												<p className="font-semibold text-base text-zinc-900 dark:text-white">{honor.title}</p>
												{honor.issuer && <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{honor.issuer}</p>}
											</div>
										</div>
										{honor.date && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">{honor.date}</span>}
									</div>

									<p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{honor.description}</p>

									{honor.highlights?.length ? (
										<dl className="grid grid-cols-2 gap-2">
											{honor.highlights.map((highlight) => (
												<HighlightStat key={`${honor.title}-${highlight.label}`} label={highlight.label} value={highlight.value} />
											))}
										</dl>
									) : null}

									{honor.tags?.length ? (
										<div className="flex flex-wrap gap-2">
											{honor.tags.map((tag) => (
												<HonorTag key={`${honor.title}-${tag}`} tag={tag} />
											))}
										</div>
									) : null}

									{honor.link && (
										<Link
											href={honor.link}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-300"
										>
											View proof
											<ArrowUpRight className="h-3.5 w-3.5" />
										</Link>
									)}
								</div>
							</article>
						</Reveal>
					))}
				</div>
			)}
		</section>
	);
}
