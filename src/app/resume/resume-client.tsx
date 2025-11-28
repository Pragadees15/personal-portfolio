"use client";

import { useState } from "react";
import { isMobileDevice } from "@/lib/utils";
import { ExternalLink, FileDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";

export default function ResumeClient() {
  const isMobile = isMobileDevice();
  const [zoom, setZoom] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const pdfUrl = "/resume.pdf";
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.2;

  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;
  const zoomDisplay = Math.round(zoom * 100);
  const hasMultiplePages = numPages > 1;

  const mobileControls = (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-4 py-3 text-sm font-medium text-indigo-700 transition-colors hover:from-indigo-100 hover:to-fuchsia-100 dark:border-indigo-600 dark:from-indigo-950/30 dark:to-fuchsia-950/30 dark:text-indigo-200 dark:hover:from-indigo-950/50 dark:hover:to-fuchsia-950/50"
        >
          <ExternalLink className="h-4 w-4" />
          Open in New Tab
        </a>
        <a
          href={pdfUrl}
          download
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
        >
          <FileDown className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      {hasMultiplePages && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200/70 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200">
          <button
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            disabled={pageNumber === 1}
            className="rounded-md border border-zinc-200/70 bg-white/80 px-2 py-1 text-xs font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span>
            Page {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
            disabled={pageNumber === numPages}
            className="rounded-md border border-zinc-200/70 bg-white/80 px-2 py-1 text-xs font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200/70 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200">
        <button
          onClick={() => setZoom((prev) => Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(2))))}
          disabled={!canZoomOut}
          className="rounded-md border border-zinc-200/70 bg-white/80 px-2 py-1 text-xs font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[3.5rem] text-center">{zoomDisplay}%</span>
        <button
          onClick={() => setZoom((prev) => Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(2))))}
          disabled={!canZoomIn}
          className="rounded-md border border-zinc-200/70 bg-white/80 px-2 py-1 text-xs font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  function onPrint() {
    try {
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.focus();
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      } else {
        window.print();
      }
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
    <main className={`min-h-[100dvh] ${isMobile ? "pb-[12rem]" : ""}`}>
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
              {hasMultiplePages && (
                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200/60 bg-white/70 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <button
                    onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                    disabled={pageNumber === 1}
                    className="rounded-md border border-zinc-200/70 bg-white/80 px-1.5 py-1 text-xs transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <span className="px-1">
                    Page {pageNumber}/{numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                    disabled={pageNumber === numPages}
                    className="rounded-md border border-zinc-200/70 bg-white/80 px-1.5 py-1 text-xs transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200/60 bg-white/70 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
                <button
                  onClick={() => setZoom((prev) => Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(2))))}
                  disabled={!canZoomOut}
                  className="rounded-md border border-zinc-200/70 bg-white/80 px-1.5 py-1 text-xs transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
                >
                  <ZoomOut className="h-3 w-3" />
                </button>
                <span className="px-1 min-w-[3rem] text-center">{zoomDisplay}%</span>
                <button
                  onClick={() => setZoom((prev) => Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(2))))}
                  disabled={!canZoomIn}
                  className="rounded-md border border-zinc-200/70 bg-white/80 px-1.5 py-1 text-xs transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/50"
                >
                  <ZoomIn className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="site-container pb-6">
        <div
          className={`relative w-full overflow-hidden bg-white dark:bg-zinc-900 ${isMobile
            ? "h-[calc(100dvh-11rem)] rounded-2xl border border-zinc-200/70 dark:border-white/10"
            : "h-[calc(100dvh-4.5rem)]"
            }`}
        >
          <PdfViewer
            file={pdfUrl}
            pageNumber={pageNumber}
            scale={zoom}
            loadingLabel="Loading resume..."
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setPageNumber((prev) => Math.min(prev, numPages));
            }}
            className="h-full"
          />
        </div>
      </div>

      {isMobile && (
        <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 bg-gradient-to-t from-white via-white/95 dark:from-black dark:via-black/90 border-t border-zinc-200/70 dark:border-white/10 shadow-[0_-8px_50px_rgba(0,0,0,0.35)]">
          {mobileControls}
        </div>
      )}
    </main>
  );
}


