"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  FileText,
  Search,
  X,
} from "lucide-react";

import { certifications } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { CertificationViewer } from "@/components/CertificationViewer";
import { cn } from "@/lib/utils";

type Category = "All" | "AWS" | "Oracle" | "NPTEL" | "Hackathon" | "Other";
const CATEGORIES: Category[] = ["All", "AWS", "Oracle", "NPTEL", "Hackathon", "Other"];

const stableId = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString(36).substring(0, 6).toUpperCase().padEnd(6, "0");
};

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const getCategory = (title: string): Category => {
    const t = title.toLowerCase();
    if (t.includes("aws")) return "AWS";
    if (t.includes("oracle")) return "Oracle";
    if (t.includes("nptel")) return "NPTEL";
    if (t.includes("hackathon") || t.includes("hack")) return "Hackathon";
    return "Other";
  };

  const getLogo = (
    category: Category,
  ):
    | { kind: "mask"; src: string }
    | { kind: "plate"; src: string }
    | { kind: "icon"; icon: typeof Award } => {
    switch (category) {
      case "AWS":
        return {
          kind: "mask",
          src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg",
        };
      case "Oracle":
        return {
          kind: "mask",
          src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg",
        };
      case "NPTEL":
        return { kind: "plate", src: "/logos/nptel.jpeg" };
      case "Hackathon":
        return { kind: "plate", src: "/logos/SRM.png" };
      default:
        return { kind: "icon", icon: Award };
    }
  };

  const filteredCertifications = useMemo(() => {
    return certifications
      .map((cert) => ({ ...cert, category: getCategory(cert.title) }))
      .filter((cert) => {
        const matchesCategory =
          activeCategory === "All" || cert.category === activeCategory;
        const matchesSearch =
          cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cert.issuer || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [activeCategory, searchQuery]);

  const navigableIndices = useMemo(
    () =>
      filteredCertifications
        .map((cert, index) => (cert.link ? index : -1))
        .filter((index) => index !== -1),
    [filteredCertifications],
  );

  const currentNavIndex =
    openIndex !== null ? navigableIndices.indexOf(openIndex) : -1;

  const handlePrevious = () => {
    if (currentNavIndex > 0) {
      setOpenIndex(navigableIndices[currentNavIndex - 1]);
    }
  };
  const handleNext = () => {
    if (currentNavIndex < navigableIndices.length - 1) {
      setOpenIndex(navigableIndices[currentNavIndex + 1]);
    }
  };

  const scrollToViewer = useCallback(() => {
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCardClick = useCallback(
    (index: number, hasLink: boolean) => {
      if (!hasLink) return;
      const isAlreadyOpen = openIndex !== null;
      setOpenIndex(index);
      if (isAlreadyOpen) scrollToViewer();
    },
    [openIndex, scrollToViewer],
  );

  return (
    <section
      id="certifications"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="07" subtitle="Credentials — Verified skills">
        Things I&apos;ve <em className="italic">studied</em>
        {" & passed."}
      </SectionHeading>

      {/* Controls */}
      <div className="mb-10 flex flex-col gap-5 border-y border-foreground/10 py-4">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certifications…"
            id="certifications-search"
            name="certifications-search"
            className="flex-1 bg-transparent text-base sm:text-sm outline-none text-foreground placeholder-muted-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "chip-mono transition-colors",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "hover:border-foreground/40",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCertifications.map((cert, i) => {
          const logoInfo = getLogo(cert.category);
          const id = stableId(cert.title);
          const hasLink = !!cert.link;

          return (
            <article
              key={cert.title}
              onClick={() => handleCardClick(i, hasLink)}
              className={cn(
                "card-flat hover-lift p-6 flex flex-col gap-5 group min-h-[200px]",
                hasLink ? "cursor-pointer" : "cursor-default",
              )}
            >
              <header className="flex items-start justify-between gap-4">
                {logoInfo.kind === "icon" ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-foreground/15 bg-background overflow-hidden p-2">
                    <logoInfo.icon className="h-5 w-5 text-foreground" />
                  </div>
                ) : logoInfo.kind === "mask" ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-foreground/15 bg-background overflow-hidden">
                    <span
                      aria-label={cert.category}
                      role="img"
                      className="icon-mask block text-foreground"
                      style={{
                        width: 22,
                        height: 22,
                        maskImage: `url(${logoInfo.src})`,
                        WebkitMaskImage: `url(${logoInfo.src})`,
                      }}
                    />
                  </div>
                ) : (
                  <div className="logo-plate flex h-11 w-11 items-center justify-center rounded-md overflow-hidden p-1.5">
                    <div className="relative h-full w-full">
                      <Image
                        src={logoInfo.src}
                        alt={cert.category}
                        fill
                        sizes="44px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                {hasLink ? (
                  <span className="chip-mono">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="chip-mono opacity-60">
                    <FileText className="h-3 w-3" />
                    No PDF
                  </span>
                )}
              </header>

              <div className="flex-1">
                <h3 className="font-display text-xl leading-tight">
                  <span className="italic">{cert.title}</span>
                </h3>
                {cert.issuer && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {cert.issuer}
                  </p>
                )}
              </div>

              <footer className="mt-auto flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  ID — {id}
                </span>
                {hasLink ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
                    View <ExternalLink className="h-3 w-3" />
                  </span>
                ) : null}
              </footer>
            </article>
          );
        })}
      </div>

      {/* Inline viewer */}
      {openIndex !== null &&
        filteredCertifications[openIndex]?.link && (
          <div
            ref={viewerRef}
            className="mt-12 overflow-hidden rounded-md border border-foreground/15 bg-background scroll-mt-32"
            style={{
              height: "calc(100vh - 200px)",
              minHeight: "400px",
              maxHeight: "900px",
            }}
          >
            <CertificationViewer
              pdfUrl={filteredCertifications[openIndex].link!}
              title={filteredCertifications[openIndex].title}
              currentIndex={currentNavIndex}
              totalCount={navigableIndices.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onClose={() => setOpenIndex(null)}
            />
          </div>
        )}
    </section>
  );
}
