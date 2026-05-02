"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  fitToContainer?: boolean;
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
  fitToContainer = false,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [reloadSeed, setReloadSeed] = useState(0);
  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
  
  // Track render states separately
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [pageRendered, setPageRendered] = useState(false);
  
  // Store the onLoadSuccess callback in a ref to avoid re-renders
  const onLoadSuccessRef = useRef(onLoadSuccess);
  onLoadSuccessRef.current = onLoadSuccess;

  // Load react-pdf module once
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    (async () => {
      try {
        const mod = await import("react-pdf");
        if (!isMounted) return;

        // Ensure PDF.js uses a real web worker (avoids "fake worker" fallback).
        // This resolves the worker from the local pdfjs-dist package.
        try {
          const workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
          mod.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        } catch {
          // If resolution fails, react-pdf/pdf.js may attempt a fallback worker.
        }

        setPdfModule(mod);
      } catch (err) {
        console.error("Failed to load react-pdf:", err);
        setModuleError("Unable to load PDF renderer.");
      }
    })();

    return () => { isMounted = false; };
  }, []);

  // Measure container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const measure = () => {
      // Check ref is still valid (could be null if component unmounted)
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width > 0) {
        setContainerWidth(width);
      }
      if (height > 0) {
        setContainerHeight(height);
      }
    };
    
    // Measure immediately
    measure();
    
    // Also measure after a short delay to catch layout shifts
    const timer = setTimeout(measure, 100);
    
    // Add resize observer for responsive behavior
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate render width - adjusted for fit-to-container mode
  const renderWidth = useMemo(() => {
    if (containerWidth === null) return null;
    
    // Base width clamped to min/max
    let baseWidth = Math.min(Math.max(containerWidth, MIN_CONTAINER_WIDTH), MAX_CONTAINER_WIDTH);
    
    // If fitToContainer and we have PDF dimensions, calculate optimal width
    if (fitToContainer && pdfDimensions && containerHeight) {
      const pdfAspectRatio = pdfDimensions.width / pdfDimensions.height;
      // Available height with some padding for the container
      const availableHeight = containerHeight - 48; // Account for padding
      const availableWidth = containerWidth - 24; // Account for horizontal padding
      
      // Calculate width based on fitting height
      const widthFromHeight = availableHeight * pdfAspectRatio;
      
      // Use the smaller of the two to ensure it fits both dimensions
      baseWidth = Math.min(widthFromHeight, availableWidth, MAX_CONTAINER_WIDTH);
      baseWidth = Math.max(baseWidth, MIN_CONTAINER_WIDTH);
    }
    
    return baseWidth;
  }, [containerWidth, containerHeight, fitToContainer, pdfDimensions]);

  const documentKey = useMemo(() => `${file}::${reloadSeed}`, [file, reloadSeed]);

  // Reset states when document changes
  useEffect(() => {
    setDocumentLoaded(false);
    setPageRendered(false);
    setLoadError(null);
  }, [documentKey]);

  // Memoized callbacks - CRITICAL to prevent re-renders
  const handleLoadSuccess = useCallback(({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages || 1);
    setDocumentLoaded(true);
    setLoadError(null);
    onLoadSuccessRef.current?.({ numPages: totalPages || 1 });
  }, []);

  // Callback to capture PDF page dimensions for fit-to-container calculations
  const handlePageLoadSuccess = useCallback((page: { width: number; height: number }) => {
    if (!pdfDimensions) {
      setPdfDimensions({ width: page.width, height: page.height });
    }
  }, [pdfDimensions]);

  const handleLoadError = useCallback((error: Error) => {
    console.error("Failed to load PDF:", error);
    setLoadError(error.message || "Unable to display this PDF.");
  }, []);

  const handlePageRenderSuccess = useCallback(() => {
    setPageRendered(true);
  }, []);

  // Determine loading/error states
  const isErrored = loadError !== null || moduleError !== null;
  const isLoading = !pdfModule || renderWidth === null || !documentLoaded || !pageRendered;
  const showContent = pdfModule && renderWidth !== null && !isErrored;

  // Scroll isolation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Only stop propagation when the viewer can actually scroll in some direction.
      // This avoids trapping page scroll when the user reaches the top or bottom.
      if (!isAtTop && !isAtBottom && scrollHeight > clientHeight) {
        e.stopPropagation();
      }
    };

    const handleScroll = (e: Event) => {
      e.stopPropagation();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRetry = useCallback(() => {
    if (moduleError) {
      setModuleError(null);
      setPdfModule(null);
    } else {
      setLoadError(null);
      setDocumentLoaded(false);
      setPageRendered(false);
      setReloadSeed((seed) => seed + 1);
    }
  }, [moduleError]);

  // Calculate which page to show
  const currentPage = Math.min(pageNumber, numPages);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-auto bg-secondary", className)}>
      {isLoading && !isErrored && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-secondary">
          <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{loadingLabel}</p>
        </div>
      )}

      {isErrored && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center bg-secondary">
          <AlertCircle className="h-7 w-7 text-foreground" />
          <p className="text-sm text-muted-foreground">
            {moduleError || loadError || emptyLabel}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="btn-ghost-mono"
          >
            Try again
          </button>
        </div>
      )}

      {/* PDF Content - rendered but hidden until ready */}
      <div 
        className={cn(
          "relative mx-auto flex flex-col items-center",
          fitToContainer 
            ? "h-full justify-center px-3 py-3" 
            : "max-w-[90rem] gap-6 px-3 py-4 sm:px-6 sm:py-6"
        )}
        style={{ 
          visibility: isLoading ? 'hidden' : 'visible',
          // Apply zoom via CSS transform
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: fitToContainer ? 'center center' : 'top center',
        }}
      >
        {showContent && renderWidth !== null && (
          <pdfModule.Document
            key={documentKey}
            file={file}
            loading={null}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
          >
            {renderAllPages ? (
              Array.from({ length: numPages }, (_, idx) => (
                <div key={`page-${idx + 1}`} className="w-full mb-4">
                  <pdfModule.Page
                    pageNumber={idx + 1}
                    width={renderWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="w-full drop-shadow-xl"
                    onRenderSuccess={idx === 0 ? handlePageRenderSuccess : undefined}
                    onLoadSuccess={idx === 0 ? handlePageLoadSuccess : undefined}
                  />
                </div>
              ))
            ) : (
              <pdfModule.Page
                pageNumber={currentPage}
                width={renderWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="w-full drop-shadow-xl"
                onRenderSuccess={handlePageRenderSuccess}
                onLoadSuccess={handlePageLoadSuccess}
              />
            )}
          </pdfModule.Document>
        )}
      </div>
    </div>
  );
}
