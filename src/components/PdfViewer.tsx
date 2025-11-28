"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ReactPdfModule = typeof import("react-pdf");

type PdfViewerProps = {
  file: string;
  pageNumber?: number;
  renderAllPages?: boolean;
  scale?: number;
  className?: string;
  loadingLabel?: string;
  emptyLabel?: string;
  onLoadSuccess?: (payload: { numPages: number }) => void;
};

const MIN_CONTAINER_WIDTH = 240;
const MAX_CONTAINER_WIDTH = 1600;

export function PdfViewer({
  file,
  pageNumber = 1,
  renderAllPages = false,
  scale = 1,
  className,
  loadingLabel = "Loading PDF…",
  emptyLabel = "Nothing to display",
  onLoadSuccess,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWidthRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [reloadSeed, setReloadSeed] = useState(0);
  const [completedKey, setCompletedKey] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<{ key: string | null; message: string }>({
    key: null,
    message: "",
  });
  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [visitedPages, setVisitedPages] = useState<number[]>([]);

  const documentOptions = useMemo(() => {
    if (!pdfModule) return null;
    const version = pdfModule.pdfjs.version;
    return {
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${version}/standard_fonts/`,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`,
      cMapPacked: true,
    } as const;
  }, [pdfModule]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    (async () => {
      try {
        const mod = await import("react-pdf");
        if (!isMounted) {
          return;
        }

        const workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
        mod.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        setPdfModule(mod);
      } catch (err) {
        console.error("Failed to load react-pdf:", err);
        setModuleError("Unable to load PDF renderer.");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = Math.round(entry.contentRect.width);

      if (lastWidthRef.current === width) {
        return;
      }

      lastWidthRef.current = width;
      setContainerWidth(width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const effectiveWidth = useMemo(() => {
    const baseWidth = containerWidth ?? MIN_CONTAINER_WIDTH;
    const bounded = Math.min(Math.max(baseWidth, MIN_CONTAINER_WIDTH), MAX_CONTAINER_WIDTH);
    return Math.floor(bounded * scale);
  }, [containerWidth, scale]);

  const pagesToRender = useMemo(() => {
    if (renderAllPages) {
      return Array.from({ length: numPages }, (_, idx) => idx + 1);
    }
    return [Math.min(pageNumber, numPages)];
  }, [renderAllPages, numPages, pageNumber]);

  const documentKey = useMemo(() => `${file}::${reloadSeed}`, [file, reloadSeed]);

  useEffect(() => {
    setVisitedPages([]);
  }, [documentKey]);

  useEffect(() => {
    if (renderAllPages) {
      return;
    }
    setVisitedPages((prev) => {
      const merged = new Set(prev);
      pagesToRender.forEach((page) => merged.add(page));
      return Array.from(merged).sort((a, b) => a - b);
    });
  }, [pagesToRender, renderAllPages]);

  const activePageSet = useMemo(() => new Set(pagesToRender), [pagesToRender]);
  const persistentPages = renderAllPages ? pagesToRender : visitedPages.length > 0 ? visitedPages : pagesToRender;
  const isErrored = errorState.key === documentKey || moduleError !== null;
  const isLoading = (!pdfModule || (!isErrored && completedKey !== documentKey)) && moduleError === null;

  const handleLoadSuccess = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages || 1);
    setCompletedKey(documentKey);
    setErrorState({ key: null, message: "" });
    onLoadSuccess?.({ numPages: totalPages || 1 });
  };

  const handleLoadError = (error: Error) => {
    console.error("Failed to load PDF:", error);
    setErrorState({
      key: documentKey,
      message: error.message || "Unable to display this PDF.",
    });
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-auto bg-white dark:bg-zinc-950", className)}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{loadingLabel}</p>
        </div>
      )}

      {/* Error state */}
      {isErrored && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center bg-white dark:bg-zinc-950">
          <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {moduleError || errorState.message || emptyLabel}
          </p>
          <button
            type="button"
            onClick={() => {
              if (moduleError) {
                setModuleError(null);
                setPdfModule(null);
              } else {
                setCompletedKey(null);
                setErrorState({ key: null, message: "" });
                setReloadSeed((seed) => seed + 1);
              }
            }}
            className="rounded-lg border border-zinc-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Try again
          </button>
        </div>
      )}

      <div className="relative mx-auto flex max-w-[90rem] flex-col items-center gap-6 px-3 py-4 sm:px-6 sm:py-6">
        {pdfModule ? (
          <pdfModule.Document
            key={documentKey}
            file={file}
            loading={null}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            options={documentOptions ?? undefined}
          >
            {persistentPages.map((page) => {
              const isActive = activePageSet.has(page);
              return (
                <div
                  key={page}
                  className={cn(
                    "w-full transition-opacity duration-150",
                    !renderAllPages && !isActive && "pointer-events-none opacity-0 absolute inset-0"
                  )}
                >
                  <pdfModule.Page
                    pageNumber={page}
                    width={effectiveWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="w-full drop-shadow-xl"
                  />
                </div>
              );
            })}
          </pdfModule.Document>
        ) : (
          !moduleError && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-sm text-zinc-500 dark:text-zinc-300">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p>Loading PDF module…</p>
            </div>
          )
        )}

        {pagesToRender.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}


