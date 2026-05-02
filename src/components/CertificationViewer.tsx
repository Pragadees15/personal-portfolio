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
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";

type CertificationViewerProps = {
  pdfUrl: string;
  title: string;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};


export function CertificationViewer({
  pdfUrl,
  title,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onClose,
}: CertificationViewerProps) {
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

  const buttonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-foreground/15 bg-background px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed";
  const compactButtonClass =
    "inline-flex items-center justify-center rounded-sm border border-foreground/15 bg-background p-1.5 text-xs text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:opacity-40";

  const MIN_ZOOM = 0.7;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.2;

  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;
  const zoomDisplay = Math.round(zoom * 100);
  const hasMultiplePages = numPages > 1;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-3 border-b border-foreground/15 bg-background flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="hidden sm:block min-w-0 mr-2">
            <h3 className="font-display italic text-base text-foreground truncate">{title}</h3>
          </div>
          {/* Navigation */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={buttonClass}
            aria-label="Previous certificate"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            className={buttonClass}
            aria-label="Next certificate"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Certificate counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-foreground/15 bg-secondary font-mono text-xs uppercase tracking-[0.14em] text-foreground tabular-nums">
            <span>{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="text-muted-foreground">/</span>
            <span>{String(totalCount).padStart(2, "0")}</span>
          </div>

          {hasMultiplePages && (
            <div className="hidden sm:flex items-center gap-1 rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-xs font-mono text-foreground">
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

          <div className="hidden sm:flex items-center gap-1 rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-xs font-mono text-foreground">
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

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className={buttonClass} aria-label="Toggle fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* External link */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
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

      <div className="relative flex-1 overflow-hidden bg-secondary min-h-0 flex items-center justify-center">
        <PdfViewer
          file={pdfUrl}
          pageNumber={pageNumber}
          scale={zoom}
          loadingLabel="Loading certificate..."
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber((prev) => Math.min(prev, numPages));
          }}
          className="h-full w-full"
          fitToContainer
        />
      </div>

      {/* Mobile action buttons */}
      <div className="block sm:hidden p-2 border-t border-foreground/15 bg-background flex-shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
          </div>
          <div className="flex gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime flex-1 justify-center"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
            <a
              href={pdfUrl}
              download
              className="btn-ghost-mono flex-1 justify-center"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>

          {hasMultiplePages && (
            <div className="flex items-center justify-between gap-2 rounded-md border border-foreground/15 bg-background px-3 py-2 font-mono text-xs text-foreground">
              <button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber === 1}
                className={compactButtonClass}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span>
                Page {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                disabled={pageNumber === numPages}
                className={compactButtonClass}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 rounded-md border border-foreground/15 bg-background px-3 py-2 font-mono text-xs text-foreground">
            <button
              onClick={() => setZoom((prev) => Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(2))))}
              disabled={!canZoomOut}
              className={compactButtonClass}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[3.5rem] text-center">{zoomDisplay}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(2))))}
              disabled={!canZoomIn}
              className={compactButtonClass}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

