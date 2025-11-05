"use client";

import { GraduationCap, MapPin } from "lucide-react";
import { education } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";
import { useState } from "react";

type LogoCandidate = { src: string; alt: string };

function getInstitutionLogoCandidates(name: string): LogoCandidate[] {
	const k = name.toLowerCase();
	if (k.includes("srm")) return [
		{ src: "https://logo.clearbit.com/srmist.edu.in", alt: "SRM Institute of Science and Technology" },
	];
	if (k.includes("jeeva velu")) return [
		{ src: "https://jeevavelu.org/images/JVIS%20Logo-.jpg", alt: "Jeeva Velu International School" },
		{ src: "https://logo.clearbit.com/jeevavelu.org", alt: "Jeeva Velu International School" },
	];
	if (k.includes("sri siksha kendra")) return [
		{ src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgfcMB4n-Bg8Q5MSPK57hROjLUsCZ35Y1LSwTnbGLgI4OisDnn-SP41GyKjRjpU0RG4jOIaKE_LnW_gLYuibzdFjEaH2QlSqUUdmZp_UdukBj-GcDz6x9L-iBBaRW2fwTPNV32OXOURTWA/w113-h113/Sri+Siksha+Kendra+International+School+logo.png", alt: "Sri Siksha Kendra International School" },
	];
	// Add more known institutions here if needed, otherwise fall back to initials
	return [];
}

function InstitutionLogo({ name, size = 24 }: { name: string; size?: number }) {
	const candidates = getInstitutionLogoCandidates(name);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);

	const boxStyle = { width: size, height: size } as React.CSSProperties;

	if (exhausted) {
		return (
			<div
				className="flex-none flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-700 dark:from-indigo-950/40 dark:to-fuchsia-950/40 dark:text-indigo-300 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
				style={boxStyle}
				aria-label={name}
			>
				<span className="text-[11px] leading-none select-none">
					{name.split(" ").map((w) => w[0]).join("").slice(0, 3)}
				</span>
			</div>
		);
	}

	const { src, alt } = candidates[index];
	// For external logos (like direct image URLs), add padding to ensure proper fit
	const isExternalLogo = src.includes("blogger.googleusercontent.com") || src.includes("jeevavelu.org");
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
				className={`select-none ${isExternalLogo ? "w-[90%] h-[90%] object-contain" : "w-full h-full object-contain"}`}
			/>
		</div>
	);
}

export function Education() {
	return (
		<section id="education" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
			<SectionHeading subtitle="My academic background">Education</SectionHeading>
			{education.length === 0 ? (
				<div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No education records to display.</div>
			) : (
			<div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
				{education.map((e, i) => (
					<Reveal key={i} delay={i * 0.05}>
						<Card className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-indigo-500/30">
							<CardContent>
								<div className="flex items-start gap-3">
									<div className="mt-0.5 flex-none">
										<InstitutionLogo name={e.institution} size={40} />
									</div>
									<div className="min-w-0">
										<CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50">{e.degree}</CardTitle>
										<div className="mt-1.5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
											{e.institution}
										</div>
										<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
											{e.location && (
												<span className="inline-flex items-center gap-1 rounded-full border-2 border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
													<MapPin className="h-3.5 w-3.5" />
													{e.location}
												</span>
											)}
											{e.meta && (
												<span className="rounded-full border-2 border-zinc-200/70 bg-white/70 px-2.5 py-0.5 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">{e.meta}</span>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</Reveal>
				))}
			</div>
			)}
		</section>
	);
}


