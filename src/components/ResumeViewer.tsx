"use client";

import { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";

type ResumeViewerProps = {
  pdfUrl: string;
  onClose: () => void;
  isMobile: boolean;
};

export function ResumeViewer({
  pdfUrl,
  onClose,
  isMobile,
}: ResumeViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Failed to exit fullscreen:", err);
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Failed to enter fullscreen:", err);
      }
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const handlePrint = () => {
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
  };

  const buttonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200/70 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-white hover:border-indigo-300/50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-indigo-500/30 dark:hover:text-indigo-200";
  const compactButtonClass =
    "inline-flex items-center justify-center rounded-md border border-zinc-200/70 bg-white/80 p-1.5 text-xs font-medium text-zinc-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300/40 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40";

  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.2;

  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;
  const zoomDisplay = Math.round(zoom * 100);
  const hasMultiplePages = numPages > 1;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-3 border-b border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Resume Title */}
          <div className="min-w-0 mr-2">
            <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">Resume</h3>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {hasMultiplePages && (
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200/60 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
              <button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber === 1}
                className={compactButtonClass}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5">
                Page {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                disabled={pageNumber === numPages}
                className={compactButtonClass}
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200/60 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
            <button
              onClick={() => setZoom((prev) => Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(2))))}
              disabled={!canZoomOut}
              className={compactButtonClass}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 min-w-[3.5rem] text-center">{zoomDisplay}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(2))))}
              disabled={!canZoomIn}
              className={compactButtonClass}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Print */}
          <button onClick={handlePrint} className={buttonClass} aria-label="Print">
            <Printer className="h-4 w-4" />
            {!isMobile && <span className="hidden sm:inline">Print</span>}
          </button>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className={buttonClass} aria-label="Toggle fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* External link */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClass}
            aria-label="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Download */}
          <a
            href={pdfUrl}
            download
            className={buttonClass}
            aria-label="Download PDF"
          >
            <Download className="h-4 w-4" />
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            className={buttonClass}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-900 min-h-0">
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

      {/* Mobile action buttons */}
      {isMobile && (
        <div className="p-2 border-t border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900 flex-shrink-0">
          <div className="flex gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-colors hover:from-indigo-100 hover:to-fuchsia-100 dark:border-indigo-600 dark:from-indigo-950/30 dark:to-fuchsia-950/30 dark:text-indigo-200 dark:hover:from-indigo-950/50 dark:hover:to-fuchsia-950/50"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>
            <a
              href={pdfUrl}
              download
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-200/70 bg-white/70 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
          <div className="mt-2 flex flex-col gap-2">
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
        </div>
      )}
    </div>
  );
}

