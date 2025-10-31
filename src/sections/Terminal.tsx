"use client";

import DevTerminal from "@/components/DevTerminal";
import { SectionHeading } from "@/components/SectionHeading";

export function Terminal() {
  return (
    <section id="terminal" className="site-container py-16 sm:py-20 scroll-mt-24">
      <SectionHeading subtitle="Type commands to explore">Developer Terminal</SectionHeading>
      <div className="mt-4">
        <DevTerminal />
      </div>
    </section>
  );
}

export default Terminal;


