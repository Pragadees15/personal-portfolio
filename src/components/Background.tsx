"use client";

/**
 * Lightweight ambient background — pure CSS, zero JS runtime cost.
 * Replaces the previous Three.js + R3F setup. The fixed layer renders a
 * paper-style dotted grid, a subtle radial vignette and a single signature
 * lime accent in the corner. Everything respects color tokens, dark mode,
 * and prefers-reduced-motion automatically.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Paper grain — soft dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(80% 60% at 50% 30%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 60% at 50% 30%, black 50%, transparent 100%)",
        }}
      />

      {/* Signature lime accent — single corner glow */}
      <div
        className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-[0.18] blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-lime), transparent 70%)",
        }}
      />

      {/* Subtle bottom vignette to ground content */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] opacity-50"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--foreground) 5%, transparent), transparent)",
        }}
      />
    </div>
  );
}
