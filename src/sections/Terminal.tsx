"use client";

import DevTerminal from "@/components/DevTerminal";
import { SectionHeading } from "@/components/SectionHeading";

export function Terminal() {
  return (
    <section id="terminal" className="site-container py-12 sm:py-20 scroll-mt-24 relative overflow-hidden">
      <SectionHeading subtitle="Access the system kernel">Dev Terminal</SectionHeading>

      <div className="mt-8 sm:mt-12 mx-auto max-w-4xl relative">


        <div className="relative z-10">
          <DevTerminal />
        </div>
      </div>
    </section>
  );
}

export default Terminal;
