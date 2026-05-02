"use client";

import dynamic from "next/dynamic";

const ResumeClient = dynamic(() => import("./resume-client"), {
  ssr: false,
  loading: () => (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 px-6 text-center bg-background text-foreground">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border border-foreground/15" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
      </div>
      <div className="space-y-1">
        <p className="font-display italic text-2xl leading-tight">
          Loading resume…
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Preparing the PDF surface
        </p>
      </div>
    </main>
  ),
});

export default function ResumePageClient() {
  return <ResumeClient />;
}
