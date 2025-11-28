"use client";

import Image from "next/image";
import { Award, BadgeCheck, FileDown } from "lucide-react";
import { certifications } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { CertificationViewer } from "@/components/CertificationViewer";
import { isMobileDevice } from "@/lib/utils";

export function Certifications() {
  type Cat = "All" | "AWS" | "Oracle" | "NPTEL" | "Hackathon" | "Other";
  const [cat, setCat] = useState<Cat>("All");
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isMobile = useMemo(() => isMobileDevice(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openIdx === null || typeof window === "undefined" || !viewerRef.current) return;

    viewerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [openIdx]);

  const categoryOf = useCallback((title: string): Cat => {
    const t = title.toLowerCase();
    if (t.includes("aws")) return "AWS";
    if (t.includes("oracle")) return "Oracle";
    if (t.includes("nptel")) return "NPTEL";
    if (t.includes("hackathon") || t.includes("hack")) return "Hackathon";
    return "Other";
  }, []);

  type CertWithCat = (typeof certifications)[number] & { _cat: Cat };

  const withCat = useMemo<CertWithCat[]>(() => certifications.map((c) => ({ ...c, _cat: categoryOf(c.title) })), [categoryOf]);
  const cats: Cat[] = ["All", "AWS", "Oracle", "NPTEL", "Hackathon", "Other"];
  const filtered = useMemo(() => {
    const base = cat === "All" ? withCat : withCat.filter((c) => c._cat === cat);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => c.title.toLowerCase().includes(q) || (c.issuer ?? "").toLowerCase().includes(q));
  }, [cat, withCat, query]);

  function logoForCategory(category: Cat): { iconUrl?: string; color?: string; alt: string; useImg?: boolean } {
    switch (category) {
      case "AWS":
        return { iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", color: "#FF9900", alt: "AWS logo" };
      case "Oracle":
        return { iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", color: "#F80000", alt: "Oracle logo" };
      case "NPTEL":
        return {
          iconUrl: "https://logo.clearbit.com/nptel.ac.in",
          color: "#9C2718",
          alt: "NPTEL logo",
          useImg: true,
        };
      case "Hackathon":
        return {
          iconUrl: "https://logo.clearbit.com/srmist.edu.in",
          alt: "SRMIST logo",
          useImg: true,
        };
      default:
        return { alt: `${category} logo` };
    }
  }

  // Minimal style: neutral surfaces, no emojis/gradients
  return (
    <section ref={sectionRef} id="certifications" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Relevant certifications and training">Certifications</SectionHeading>
      {withCat.length === 0 ? (
        <div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">No certifications to display.</div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search certificates…"
              className="w-full max-w-sm rounded-lg border border-zinc-200/70 bg-white/70 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:ring-indigo-900/40"
            />
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {cats.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={("rounded-full border-2 px-3.5 py-1.5 text-xs shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 " + (active
                    ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700 ring-2 ring-indigo-200/50 dark:border-indigo-600 dark:from-indigo-950/30 dark:to-fuchsia-950/30 dark:text-indigo-200"
                    : "border-zinc-200/70 bg-white/70 text-zinc-700 hover:bg-white/90 active:bg-white/95 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"))}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600 dark:text-zinc-400">{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c, i) => {
              const CardInner = (
                <div className="rounded-2xl relative border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 transition-all duration-300 will-change-transform group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:group-hover:border-indigo-500/30">
                  {c.link && (
                    <div className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <FileDown className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg border border-zinc-200/70 bg-white/60 p-2 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200">
                      {(() => {
                        const logo = logoForCategory(c._cat);
                        if (logo.iconUrl && logo.useImg) {
                          const isClearbit = logo.iconUrl.includes("logo.clearbit.com");
                          const boxSize = isClearbit ? "h-5 w-5" : "h-6 w-6";
                          return (
                            <div className={`relative ${boxSize}`}>
                              <Image
                                src={logo.iconUrl}
                                alt={logo.alt}
                                className="object-contain"
                                loading="lazy"
                                fill
                                sizes={isClearbit ? "20px" : "24px"}
                                unoptimized
                              />
                            </div>
                          );
                        }
                        if (logo.iconUrl) {
                          return (
                            <span
                              role="img"
                              aria-label={logo.alt}
                              className="block h-6 w-6"
                              style={{
                                WebkitMaskImage: `url(${logo.iconUrl})`,
                                maskImage: `url(${logo.iconUrl})`,
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                                backgroundColor: logo.color || "#6b7280",
                              }}
                            />
                          );
                        }
                        // Fallback icons for categories without a specific logo
                        return c._cat === "NPTEL" ? (
                          <BadgeCheck className="h-6 w-6" />
                        ) : (
                          <Award className="h-6 w-6" />
                        );
                      })()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-50">{c.title}</div>
                      {c.issuer && (
                        <div className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{c.issuer}</div>
                      )}
                      <div className="mt-2.5">
                        <span className="rounded-full border-2 border-indigo-200/70 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-2.5 py-1 text-[11px] sm:text-xs text-indigo-700 shadow-sm dark:border-indigo-600/40 dark:from-indigo-950/30 dark:to-fuchsia-950/30 dark:text-indigo-200">{c._cat}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              return (
                <Reveal key={i} delay={i * 0.04}>
                  {c.link ? (
                    <button
                      type="button"
                      onClick={() => setOpenIdx(i)}
                      className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-2xl"
                      aria-label={`Open certificate: ${c.title}`}
                    >
                      {CardInner}
                    </button>
                  ) : (<div>{CardInner}</div>)}
                </Reveal>
              );
            })}
          </div>
          {openIdx !== null && filtered[openIdx]?.link && (
            <div
              ref={viewerRef}
              className="mt-8 rounded-3xl border border-zinc-200/80 bg-white/95 p-2 shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950/95"
            >
              <CertificationViewer
                key={filtered[openIdx].link}
                pdfUrl={filtered[openIdx].link!}
                title={filtered[openIdx].title}
                currentIndex={openIdx}
                totalCount={filtered.length}
                onPrevious={() => {
                  if (openIdx > 0) setOpenIdx(openIdx - 1);
                }}
                onNext={() => {
                  if (openIdx < filtered.length - 1) setOpenIdx(openIdx + 1);
                }}
                onClose={() => setOpenIdx(null)}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}


