"use client";

import { useRef, useState } from "react";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowUpRight, Trophy, Calendar, Award, Sparkles } from "lucide-react";
import { honors } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// --- Logo Logic (Preserved & Refined) ---

const brandColors: Record<string, string> = {
	amazonaws: "#FF9900",
	oracle: "#F80000",
	nptel: "#9C2718",
	aicte: "#F8B71C",
};

type LogoCandidate = { src: string; alt: string };

function getHonorLogoCandidates(...parts: Array<string | undefined>): LogoCandidate[] {
	const k = parts.filter(Boolean).join(" ").toLowerCase();
	if (!k) return [];

	if (k.includes("srm")) return [{ src: "/logos/SRM.png", alt: "SRMIST" }];
	if (k.includes("cgpa")) return [{ src: "/logos/SRM.png", alt: "SRMIST" }];
	if (k.includes("nptel")) return [{ src: "/logos/nptel.jpeg", alt: "NPTEL" }];
	if (k.includes("aws"))
		return [{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", alt: "AWS" }];
	if (k.includes("oracle"))
		return [
			{ src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", alt: "Oracle" },
			{ src: "https://cdn.simpleicons.org/oracle", alt: "Oracle" },
		];
	if (k.includes("aicte")) return [{ src: "https://logo.clearbit.com/aicte-india.org", alt: "AICTE" }];
	if (k.includes("hackathon") || k.includes("hackstreet") || k.includes("webathon") || k.includes("digithon")) {
		return [
			{ src: "/logos/SRM.png", alt: "SRMIST" },
			{ src: "https://cdn.simpleicons.org/github", alt: "Open Source" },
		];
	}
	if (k.includes("experience kits")) {
		return [{ src: "https://cdn.simpleicons.org/github", alt: "GitHub" }];
	}
	return [];
}

function HonorLogo({
	title,
	issuer,
	size = 48,
}: {
	title: string;
	issuer?: string;
	size?: number;
}) {
	const candidates = getHonorLogoCandidates(title, issuer);
	const [index, setIndex] = useState(0);
	const [exhausted, setExhausted] = useState(candidates.length === 0);

	const boxStyle = { width: size, height: size } as React.CSSProperties;

	const containerClass = "relative flex flex-col items-center justify-center rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm backdrop-blur-sm z-10 shrink-0";

	const renderFallback = () => (
		<div className={cn(containerClass, "text-amber-500/80 dark:text-amber-400")} style={boxStyle}>
			<Trophy className="w-1/2 h-1/2" strokeWidth={1.5} />
		</div>
	);

	if (exhausted) return renderFallback();

	const candidate = candidates[index];
	if (!candidate) return renderFallback();

	const { src, alt } = candidate;

	// Simple Icons SVG
	if (src.includes("cdn.jsdelivr.net/npm/simple-icons@latest")) {
		const slug = src.split("/").pop()?.replace(".svg", "") ?? "";
		const color = brandColors[slug] ?? "#6b7280";
		return (
			<div className={containerClass} style={boxStyle}>
				<span
					className="block w-3/5 h-3/5"
					style={{
						maskImage: `url(${src})`,
						WebkitMaskImage: `url(${src})`,
						maskSize: "contain",
						WebkitMaskSize: "contain",
						maskRepeat: "no-repeat",
						WebkitMaskRepeat: "no-repeat",
						maskPosition: "center",
						WebkitMaskPosition: "center",
						backgroundColor: color,
					}}
				/>
			</div>
		);
	}

	// Simple Icons CDN (image)
	if (src.includes("cdn.simpleicons.org/")) {
		const lightSrc = `${src}/000000`;
		const darkSrc = `${src}/ffffff`;
		return (
			<div className={cn(containerClass, "overflow-hidden p-2")} style={boxStyle}>
				<img src={lightSrc} alt={alt} className="w-full h-full object-contain dark:hidden" />
				<img src={darkSrc} alt={alt} className="w-full h-full object-contain hidden dark:block" />
			</div>
		);
	}

	// Regular Image
	return (
		<div className={cn(containerClass, "overflow-hidden p-1.5")} style={boxStyle}>
			<img
				src={src}
				alt={alt}
				onError={() => {
					if (index + 1 < candidates.length) setIndex(index + 1);
					else setExhausted(true);
				}}
				className="w-full h-full object-contain"
			/>
		</div>
	);
}

// --- 3D Tilt Card Component ---

function HonorCard({ honor, index }: { honor: (typeof honors)[0]; index: number }) {
	const ref = useRef<HTMLDivElement>(null);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
	const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

	const rectRef = useRef<DOMRect | null>(null);

	function onMouseEnter(e: React.MouseEvent) {
		rectRef.current = e.currentTarget.getBoundingClientRect();
	}

	function onMouseMove(e: React.MouseEvent) {
		if (!rectRef.current) return;

		const { left, top, width, height } = rectRef.current;
		const { clientX, clientY } = e;

		const xPct = (clientX - left) / width - 0.5;
		const yPct = (clientY - top) / height - 0.5;

		x.set(xPct);
		y.set(yPct);
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	function onMouseLeave() {
		x.set(0);
		y.set(0);
		mouseX.set(0);
		mouseY.set(0);
		rectRef.current = null;
	}

	const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
	const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);
	const scale = useTransform(y, [-0.5, 0.5], [1.02, 1.02]); // Slight scale on hover equivalent

	return (
		<div
			ref={ref}
			style={{
				perspective: 1000,
			}}
			className="group h-full"
		>
			<motion.div
				onMouseEnter={onMouseEnter}
				onMouseMove={onMouseMove}
				onMouseLeave={onMouseLeave}
				style={{
					rotateX,
					rotateY,
					scale: useMotionTemplate`${scale}`,
					transformStyle: "preserve-3d",
				}}
				className="relative h-full flex flex-col rounded-[2rem] bg-gradient-to-br from-white/90 to-white/50 dark:from-zinc-900/90 dark:to-zinc-900/50 border border-white/20 dark:border-zinc-800/50 shadow-xl backdrop-blur-md overflow-hidden transition-colors"
			>
				{/* Spotlight Effect */}
				<motion.div
					className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
					style={{
						background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(99, 102, 241, 0.1),
                transparent 80%
              )
            `,
					}}
				/>

				{/* Border Glow */}
				<div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-black/5 dark:ring-white/10 group-hover:ring-indigo-500/20 dark:group-hover:ring-indigo-500/20 transition-all duration-300 z-40 pointer-events-none" />

				{/* Decorative Background Elements */}
				<div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:scale-110 transition-transform duration-700 ease-out origin-top-right">
					<Sparkles className="w-24 h-24 text-indigo-500" strokeWidth={0.5} />
				</div>

				<div className="relative p-8 flex flex-col h-full z-20" style={{ transform: "translateZ(20px)" }}>
					{/* Header */}
					<div className="flex items-start justify-between gap-4 mb-8">
						<div className="flex gap-5">
							<div style={{ transform: "translateZ(30px)" }}>
								<HonorLogo title={honor.title} issuer={honor.issuer} size={64} />
							</div>
							<div className="space-y-1.5 pt-1">
								<h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
									{honor.title}
								</h3>
								<div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
									<span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-500/20">
										<Award size={12} />
										{honor.issuer}
									</span>
									{honor.date && (
										<span className="flex items-center gap-1.5 opacity-80">
											<Calendar size={12} />
											{honor.date}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-grow space-y-6">
						<p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300/90 font-light">
							{honor.description}
						</p>

						{/* Highlights Grid */}
						{honor.highlights && honor.highlights.length > 0 && (
							<div className="grid grid-cols-2 gap-3" style={{ transform: "translateZ(10px)" }}>
								{honor.highlights.map((h, i) => (
									<div
										key={i}
										className="flex flex-col p-3 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 backdrop-blur-sm transition-colors hover:bg-white/80 dark:hover:bg-zinc-800/60"
									>
										<span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
											{h.label}
										</span>
										<span className="text-base font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 font-mono">
											{h.value}
										</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="mt-8 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-700/50 flex flex-wrap items-center justify-between gap-4">
						<div className="flex flex-wrap gap-2">
							{honor.tags?.map((tag, i) => (
								<span
									key={i}
									className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 transition-colors group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
								>
									{tag}
								</span>
							))}
						</div>

						{honor.link && (
							<a
								href={honor.link}
								target="_blank"
								rel="noopener noreferrer"
								className="group/link ml-auto relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-900 text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-zinc-500/20 dark:shadow-indigo-500/10 hover:shadow-xl hover:bg-indigo-600 dark:hover:bg-indigo-300 hover:text-white dark:hover:text-zinc-900"
								style={{ transform: "translateZ(20px)" }}
							>
								<span>View Proof</span>
								<ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
							</a>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export function Honors() {
	return (
		<section id="honors" className="site-container py-32 scroll-mt-20 overflow-hidden">


			<SectionHeading subtitle="Recognition">
				<span className="block">Honors &</span>
				<span className="block text-zinc-400 dark:text-zinc-600">Achievements</span>
			</SectionHeading>

			<div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-[2000px]">
				{honors.map((honor, index) => (
					<HonorCard key={index} honor={honor} index={index} />
				))}
			</div>
		</section>
	);
}
