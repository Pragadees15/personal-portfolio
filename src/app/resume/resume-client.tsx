"use client";

import { useEffect, useState } from "react";
import { isMobileDevice } from "@/lib/utils";
import { ExternalLink, FileDown } from "lucide-react";

export default function ResumeClient() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  function onPrint() {
    const el = document.getElementById("resume-iframe") as HTMLIFrameElement | null;
    try {
      el?.contentWindow?.focus();
      el?.contentWindow?.print();
    } catch {
      window.print();
    }
  }

  function onBack() {
    try {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    } catch {
      window.location.href = "/";
    }
  }

  return (
    <main className="min-h-[100dvh]">
      <div className="site-container py-3 sm:py-4 sticky top-0 z-10">
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-transparent to-fuchsia-500/30 dark:from-indigo-400/20 dark:via-transparent dark:to-fuchsia-400/20">
          <div className="flex items-center justify-between rounded-[calc(1rem-1px)] border border-zinc-200/70 px-2 sm:px-4 py-2.5 sm:py-3 backdrop-blur-md bg-white/80 shadow-sm dark:border-white/10 dark:bg-zinc-950/60">
            <h1 className="text-base sm:text-lg font-semibold">Resume</h1>
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <button
                type="button"
                onClick={onBack}
                className="shrink-0 rounded-md border border-zinc-200/70 bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm text-zinc-700 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
              >
                Back to site
              </button>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="shrink-0 rounded-md border border-zinc-200/70 bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm text-zinc-700 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200">Open PDF</a>
              <a href="/resume.pdf" download className="shrink-0 rounded-md border border-zinc-200/70 bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm text-zinc-700 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200">Download</a>
              <button
                type="button"
                onClick={onPrint}
                className="shrink-0 rounded-md border border-zinc-200/70 bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm text-zinc-700 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        {isMobile ? (
          // Mobile-friendly view: Show iframe with prominent action buttons
          <div className="space-y-4 px-4 pb-4">
            <div className="w-full overflow-hidden rounded-xl border border-zinc-200/70 dark:border-white/10 h-[calc(100dvh-12rem)] bg-white dark:bg-zinc-900">
              <iframe
                id="resume-iframe"
                src="/resume.pdf#view=FitH"
                className="block w-full h-full"
                title="Resume PDF"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-4 py-3 text-sm font-medium text-indigo-700 transition-colors hover:from-indigo-100 hover:to-fuchsia-100 dark:border-indigo-600 dark:from-indigo-950/30 dark:to-fuchsia-950/30 dark:text-indigo-200 dark:hover:from-indigo-950/50 dark:hover:to-fuchsia-950/50"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </a>
              <a
                href="/resume.pdf"
                download
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          // Desktop view: Use iframe as before
          <iframe
            id="resume-iframe"
            src="/resume.pdf#view=FitH"
            className="block w-screen sm:w-full h-[calc(100dvh-3.5rem-1.5rem)] sm:h-[calc(100dvh-4rem-2rem)] bg-white dark:bg-zinc-900 sm:rounded-none"
            title="Resume PDF"
          />
        )}
      </div>
    </main>
  );
}


