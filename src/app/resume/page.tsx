"use client";

export const dynamic = "force-static";

export default function ResumePage() {
  const iframeRef = (typeof window !== "undefined" ? (window as any).__resumeIframeRef : null);
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
        <iframe
          id="resume-iframe"
          src="/resume.pdf#view=FitH"
          className="block w-screen sm:w-full h-[calc(100dvh-3.5rem-1.5rem)] sm:h-[calc(100dvh-4rem-2rem)] bg-white dark:bg-zinc-900 sm:rounded-none"
          title="Resume PDF"
        />
      </div>
    </main>
  );
}


