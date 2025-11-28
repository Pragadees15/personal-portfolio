"use client";

import Image from "next/image";
import { useState } from "react";

type BeforeAfterProps = {
  srcBefore: string;
  srcAfter: string;
  alt?: string;
  beforeClassName?: string;
  afterClassName?: string;
};

export function BeforeAfter({ srcBefore, srcAfter, alt = "Before/After", beforeClassName, afterClassName }: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl">
      <Image src={srcBefore} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className={`object-cover ${beforeClassName ?? ""}`} />
      <div className="absolute inset-0" style={{ width: `${pos}%`, overflow: "hidden" }}>
        <Image src={srcAfter} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className={`object-cover ${afterClassName ?? ""}`} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute bottom-2 left-1/2 h-1 w-[60%] -translate-x-1/2 cursor-ew-resize appearance-none rounded-full bg-white/60 backdrop-blur dark:bg-zinc-900/60"
        aria-label="Adjust before/after"
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute top-0 bottom-0 w-px bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{ left: `${pos}%` }}
        />
      </div>
    </div>
  );
}

export default BeforeAfter;


