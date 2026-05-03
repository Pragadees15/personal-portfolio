"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/SectionHeading";

// Lazy-load the terminal — heavy framer-motion + state, not above the fold.
const DevTerminal = dynamic(() => import("@/components/DevTerminal"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-md border border-foreground/10 bg-secondary/40 animate-pulse" />
  ),
});

export function Terminal() {
  return (
    <section
      id="terminal"
      className="site-container scroll-mt-24"
    >
      <SectionHeading
        number="—"
        subtitle="Console — A nostalgic detour"
      >
        Try the <em className="italic">$ help</em>
        {" command."}
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8 items-start">
        <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A small, on-page terminal — built because nothing communicates
            engineer-energy quite like a blinking caret. Try
            <span className="mx-1 inline-flex items-center font-mono text-foreground"> whoami</span>
            ,
            <span className="mx-1 inline-flex items-center font-mono text-foreground"> projects</span>
            or
            <span className="mx-1 inline-flex items-center font-mono text-foreground"> contact</span>
            to start.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {[
              { cmd: "help", desc: "List commands" },
              { cmd: "whoami", desc: "About me" },
              { cmd: "projects", desc: "Recent work" },
              { cmd: "contact", desc: "Reach me" },
            ].map((c) => (
              <div
                key={c.cmd}
                className="rounded-md border border-foreground/10 px-3 py-2"
              >
                <div className="font-mono text-xs text-foreground">
                  $ {c.cmd}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-8 order-1 lg:order-2">
          <DevTerminal />
        </div>
      </div>
    </section>
  );
}

export default Terminal;
