"use client";

import { useState } from "react";
import { isMobileDevice } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileDown,
  Printer,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";
import { cn } from "@/lib/utils";

const TOOLBAR_BTN =
  "shrink-0 inline-flex items-center justify-center gap-2 rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const STEPPER =
  "rounded-md border border-foreground/15 bg-background p-1.5 text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

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

  const pageStepper = hasMultiplePages && (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background px-1.5 py-1 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
      <button
        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
        disabled={pageNumber === 1}
        aria-label="Previous page"
        className={STEPPER}
      >
        <ChevronLeft className="h-3 w-3" />
      </button>
      <span className="px-1 tabular-nums text-foreground">
        {String(pageNumber).padStart(2, "0")} / {String(numPages).padStart(2, "0")}
      </span>
      <button
        onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
        disabled={pageNumber === numPages}
        aria-label="Next page"
        className={STEPPER}
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );

  const zoomStepper = (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background px-1.5 py-1 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
      <button
        onClick={() =>
          setZoom((prev) =>
            Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(2))),
          )
        }
        disabled={!canZoomOut}
        aria-label="Zoom out"
        className={STEPPER}
      >
        <ZoomOut className="h-3 w-3" />
      </button>
      <span className="px-1 min-w-[2.5rem] text-center tabular-nums text-foreground">
        {zoomDisplay}%
      </span>
      <button
        onClick={() =>
          setZoom((prev) =>
            Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(2))),
          )
        }
        disabled={!canZoomIn}
        aria-label="Zoom in"
        className={STEPPER}
      >
        <ZoomIn className="h-3 w-3" />
      </button>
    </div>
  );

  const mobileControls = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(TOOLBAR_BTN, "px-3 py-2.5")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </a>
        <a
          href={pdfUrl}
          download
          className={cn(TOOLBAR_BTN, "px-3 py-2.5")}
        >
          <FileDown className="h-3.5 w-3.5" />
          Download
        </a>
      </div>

      <div className="flex items-center justify-between gap-2">
        {pageStepper ?? <div />}
        {zoomStepper}
      </div>
    </div>
  );

  return (
    <main
      className={cn(
        "min-h-[100dvh] bg-background text-foreground",
        isMobile ? "pb-[12rem]" : "",
      )}
    >
      {/* Editorial top bar */}
      <div className="site-container sticky top-0 z-10 py-3 sm:py-4">
        <div className="rounded-md border border-foreground/15 bg-background/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 sm:py-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to site"
                className={cn(TOOLBAR_BTN, "px-2.5 py-1.5")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="hidden sm:flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                  §
                </span>
                <h1 className="font-display italic text-xl leading-none truncate">
                  Resume
                </h1>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  — PRAGADEESWARAN K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className={TOOLBAR_BTN}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Open</span>
              </a>
              <a href={pdfUrl} download className={TOOLBAR_BTN}>
                <FileDown className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Download</span>
              </a>
              <button
                type="button"
                onClick={onPrint}
                className={TOOLBAR_BTN}
                aria-label="Print"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Print</span>
              </button>
              {hasMultiplePages && (
                <div className="hidden sm:block">{pageStepper}</div>
              )}
              <div className="hidden sm:block">{zoomStepper}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF surface */}
      <div className="site-container pb-6">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-md border border-foreground/10 bg-secondary",
            isMobile
              ? "h-[calc(100dvh-13rem)]"
              : "h-[calc(100dvh-5.5rem)]",
          )}
        >
          <PdfViewer
            file={pdfUrl}
            pageNumber={pageNumber}
            scale={zoom}
            loadingLabel="Loading resume…"
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setPageNumber((prev) => Math.min(prev, numPages));
            }}
            className="h-full"
          />
        </div>
      </div>

      {/* Mobile bottom dock */}
      {isMobile && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-foreground/15 bg-background/95 backdrop-blur-md px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          {mobileControls}
        </div>
      )}
    </main>
  );
}
