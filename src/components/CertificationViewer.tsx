"use client";

import { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

type CertificationViewerProps = {
  pdfUrl: string;
  title: string;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  isMobile: boolean;
};


export function CertificationViewer({
  pdfUrl,
  title,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onClose,
  isMobile,
}: CertificationViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [pdfUrl]);

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
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        onPrevious();
      } else if (e.key === "ArrowRight" && currentIndex < totalCount - 1) {
        onNext();
      } else if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalCount, onPrevious, onNext, isFullscreen]);

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

  const pdfSrc = `${pdfUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`;

  const buttonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200/70 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-white hover:border-indigo-300/50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-indigo-500/30 dark:hover:text-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-3 border-b border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Certificate Title */}
          <div className="hidden sm:block min-w-0 mr-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{title}</h3>
          </div>
          {/* Navigation */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={buttonClass}
            aria-label="Previous certificate"
          >
            <ChevronLeft className="h-4 w-4" />
            {!isMobile && <span className="hidden sm:inline">Prev</span>}
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            className={buttonClass}
            aria-label="Next certificate"
          >
            {!isMobile && <span className="hidden sm:inline">Next</span>}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Certificate counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span>{currentIndex + 1}</span>
            <span className="text-zinc-400 dark:text-zinc-500">/</span>
            <span>{totalCount}</span>
          </div>

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
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading certificate...</p>
            </div>
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-4">
          <iframe
            ref={iframeRef}
            src={pdfSrc}
            className="w-full h-full border-0 rounded-lg shadow-sm"
            title={title}
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>

      {/* Mobile action buttons */}
      {isMobile && (
        <div className="p-2 border-t border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">{currentIndex + 1} of {totalCount}</span>
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}

