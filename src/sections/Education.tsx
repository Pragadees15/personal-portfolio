"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, School, Sparkles } from "lucide-react";
import { education } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

// ----------------------------------------------------------------------
// Logo Logic (Preserved & Enhanced)
// ----------------------------------------------------------------------

type LogoCandidate = { src: string; alt: string };

function getInstitutionLogoCandidates(name: string): LogoCandidate[] {
	const k = name.toLowerCase();
	if (k.includes("srm")) return [
		{ src: "/logos/SRM.png", alt: "SRM Institute of Science and Technology" },
	];
	if (k.includes("jeeva velu")) return [
		{ src: "https://jeevavelu.org/images/JVIS%20Logo-.jpg", alt: "Jeeva Velu International School" },
		{ src: "https://logo.clearbit.com/jeevavelu.org", alt: "Jeeva Velu International School" },
	];
	if (k.includes("sri siksha kendra")) return [
		{ src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgfcMB4n-Bg8Q5MSPK57hROjLUsCZ35Y1LSwTnbGLgI4OisDnn-SP41GyKjRjpU0RG4jOIaKE_LnW_gLYuibzdFjEaH2QlSqUUdmZp_UdukBj-GcDz6x9L-iBBaRW2fwTPNV32OXOURTWA/w113-h113/Sri+Siksha+Kendra+International+School+logo.png", alt: "Sri Siksha Kendra International School" },
	];
	return [];
}

function InstitutionLogo({ name, size = 56 }: { name: string; size?: number }) {
	const candidates = getInstitutionLogoCandidates(name);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);

	if (exhausted) {
		return (
			<div
				className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-inner"
				style={{ width: size, height: size }}
			>
				<span className="text-sm font-bold">{name.slice(0, 2).toUpperCase()}</span>
			</div>
		);
	}

	const { src, alt } = candidates[index];

	return (
		<div
			className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-sm border border-zinc-200/60 dark:bg-zinc-800 dark:border-zinc-700/60"
			style={{ width: size, height: size }}
		>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={`${size}px`}
				className="object-contain p-1"
				onError={() => {
					if (index + 1 < candidates.length) setIndex(index + 1);
					else setExhausted(true);
				}}
				unoptimized
			/>
		</div>
	);
}

// ----------------------------------------------------------------------
// Helper: Grade Parsing
// ----------------------------------------------------------------------

function getGradeInfo(meta?: string) {
	if (!meta) return null;
	const cgpaMatch = meta.match(/CGPA\s*(\d+(\.\d+)?)\/(\d+(\.\d+)?)/i);
	if (cgpaMatch) {
		const val = parseFloat(cgpaMatch[1]);
		const max = parseFloat(cgpaMatch[3]);
		return { value: val.toString(), label: "CGPA", percentage: (val / max) * 100 };
	}
	const pctMatch = meta.match(/(\d+(\.\d+)?)%/);
	if (pctMatch) {
		return { value: pctMatch[1] + "%", label: "Score", percentage: parseFloat(pctMatch[1]) };
	}
	return null;
}

// ----------------------------------------------------------------------
// Component: Spotlight Card
// ----------------------------------------------------------------------

function EducationCard({
	item,
}: {
	item: typeof education[0];
}) {
	const grade = getGradeInfo(item.meta);

	return (
		<div
			className="group relative flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 rounded-3xl border border-zinc-200 bg-white dark:bg-zinc-900 p-6 md:p-8 dark:border-white/10 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
		>

			{/* Left Flank: Logo & Connector */}
			<div className="flex-shrink-0 flex flex-col items-center gap-4">
				<InstitutionLogo name={item.institution} size={72} />
				<div className="h-full w-px bg-gradient-to-b from-zinc-200 to-transparent dark:from-zinc-800 hidden md:block" />
			</div>

			{/* Main Content */}
			<div className="flex-grow space-y-4 relative z-10">
				<div>
					<h3
						className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight transition-transform duration-300 group-hover:translate-x-1"
					>
						{item.degree}
					</h3>
					<div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
						<span className="flex items-center gap-1.5">
							<School size={15} className="text-indigo-500" />
							{item.institution}
						</span>
						{item.location && (
							<>
								<span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
								<span className="flex items-center gap-1.5">
									<MapPin size={15} />
									{item.location}
								</span>
							</>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-3">
					{/* Meta / Date chips */}
					<div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 transition-colors group-hover:bg-zinc-100 dark:group-hover:bg-white/10">
						<Calendar size={13} className="text-indigo-500" />
						{/* Extract approximate year from meta if possible, or display meta string cleanly */}
						{item.meta?.includes("Expected") ? "2022 — 2026" : (item.meta?.match(/\b20\d{2}\b/)?.[0] || "Present")}
					</div>

					{item.meta?.includes("Expected") && (
						<div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
							<Sparkles size={13} />
							Pursuing
						</div>
					)}
				</div>
			</div>

			{/* Right Flank: Grade Display (Desktop) */}
			{grade && (
				<div className="flex-shrink-0 flex flex-col items-center justify-center">
					<div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
						<span className="text-lg font-bold text-zinc-900 dark:text-white">
							{grade.value}
						</span>
						<span className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
							{grade.label}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

// ----------------------------------------------------------------------
// Main Section
// ----------------------------------------------------------------------

export function Education() {
	return (
		<section id="education" className="site-container py-24 sm:py-32 scroll-mt-24 overflow-hidden">
			<SectionHeading subtitle="Academic Foundation">Education</SectionHeading>

			<div className="relative mx-auto mt-12 max-w-4xl">
				{/* Connecting Line (Background) */}
				<div className="absolute left-[2.25rem] md:left-[2.25rem] top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/50 via-zinc-200 to-transparent dark:via-zinc-800 hidden" />

				<div className="flex flex-col gap-6 md:gap-8">
					{education.map((item, index) => (
						<EducationCard key={index} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}
