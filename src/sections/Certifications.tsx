"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, CheckCircle2, X, ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import { certifications } from "@/data/resume";
import { SectionHeading, SectionSubHeading } from "@/components/SectionHeading";
import { CertificationViewer } from "@/components/CertificationViewer";
import { cn } from "@/lib/utils";

// --- Types & Constants ---
type Category = "All" | "AWS" | "Oracle" | "NPTEL" | "Hackathon" | "Other";
const CATEGORIES: Category[] = ["All", "AWS", "Oracle", "NPTEL", "Hackathon", "Other"];

// Deterministic ID generator
const generateStableId = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString(36).substring(0, 6).toUpperCase().padEnd(6, '0');
};

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---

  const getCategory = (title: string): Category => {
    const t = title.toLowerCase();
    if (t.includes("aws")) return "AWS";
    if (t.includes("oracle")) return "Oracle";
    if (t.includes("nptel")) return "NPTEL";
    if (t.includes("hackathon") || t.includes("hack")) return "Hackathon";
    return "Other";
  };

  const getLogo = (category: Category) => {
    switch (category) {
      case "AWS":
        // AWS is orange/black. In dark mode, we force a light background to make it pop.
        return { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg", color: "bg-white", isLocal: false };
      case "Oracle":
        // Oracle is red/white. 
        return { src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg", color: "bg-white", isLocal: false };
      case "NPTEL":
        return { src: "/logos/nptel.jpeg", color: "bg-transparent", isLocal: true };
      case "Hackathon":
        return { src: "/logos/SRM.png", color: "bg-transparent", isLocal: true };
      default:
        return { icon: Award, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400" };
    }
  };

  // --- Filtering Logic ---

  const filteredCertifications = useMemo(() => {
    return certifications
      .map((cert) => ({ ...cert, category: getCategory(cert.title) }))
      .filter((cert) => {
        const matchesCategory = activeCategory === "All" || cert.category === activeCategory;
        const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cert.issuer || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [activeCategory, searchQuery]);

  // --- Navigation Logic ---

  const navigableIndices = useMemo(() => {
    return filteredCertifications
      .map((cert, index) => (cert.link ? index : -1))
      .filter((index) => index !== -1);
  }, [filteredCertifications]);

  const currentNavIndex = openIndex !== null ? navigableIndices.indexOf(openIndex) : -1;

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

  // --- Render ---

  return (
    <section id="certifications" className="site-container py-20 sm:py-28 scroll-mt-24">
      <SectionHeading subtitle="Verified Skills & Training">Credentials</SectionHeading>

      {/* Controls Container */}
      <div className="mt-12 mb-10 space-y-6">

        {/* Search Bar */}
        <div className="relative mx-auto max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-2.5 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certifications..."
                className="bg-transparent w-full text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border",
                activeCategory === cat
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-md transform scale-105"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCertifications.map((cert, i) => {
          const logoInfo = getLogo(cert.category);
          const stableId = generateStableId(cert.title);

          return (
            <div
              key={cert.title}
              onClick={() => {
                if (cert.link) {
                  setOpenIndex(i);
                }
              }}
              className={cn(
                "group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1",
                cert.link ? "cursor-pointer" : "cursor-default"
              )}
            >
              {/* Verified Badge Background */}
              <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                {/* Logo Box */}
                {/* Fixed: Force background to be white for external logos (AWS, Oracle) so they show up in dark mode */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 overflow-hidden p-1.5",
                  logoInfo.color
                )}>
                  {logoInfo.src ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={logoInfo.src}
                        alt={cert.category}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        unoptimized={!logoInfo.isLocal}
                      />
                    </div>
                  ) : (
                    logoInfo.icon && <logoInfo.icon className="w-6 h-6" />
                  )}
                </div>

                {/* Verified Tick */}
                {cert.link && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="flex-1 relative z-10">
                <SectionSubHeading className="font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-1">
                  {cert.title}
                </SectionSubHeading>
                {cert.issuer && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    {cert.issuer}
                  </p>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[10px] items-center text-zinc-400 dark:text-zinc-500 font-mono">
                  ID: {stableId}
                </span>
                {cert.link ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    View Credential <ExternalLink size={12} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    No details <FileText size={12} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Viewer Modal */}
      <AnimatePresence>
        {openIndex !== null && filteredCertifications[openIndex]?.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            ref={viewerRef}
            className="mt-12 rounded-3xl border border-zinc-200/80 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/10 scroll-mt-32"
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
