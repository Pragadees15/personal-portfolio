"use client";

import dynamic from "next/dynamic";

const ResumeClient = dynamic(() => import("./resume-client"), {
    ssr: false,
    loading: () => (
        <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="size-12 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
            <div>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">Loading resume viewer…</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Hang tight while we prepare the PDF.</p>
            </div>
        </main>
    ),
});

export default function ResumePageClient() {
    return <ResumeClient />;
}

