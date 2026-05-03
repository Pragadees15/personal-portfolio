import type { Metadata } from "next";
import Link from "next/link";

import { profile } from "@/data/resume";

export const metadata: Metadata = {
  title: "Page not found · 404",
  description:
    "The page you were looking for doesn't exist on Pragadeeswaran K's portfolio. Browse selected work, the résumé, or jump back to the homepage.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/404" },
};

export default function NotFound() {
  return (
    <main
      id="hero"
      className="min-h-[100dvh] bg-background text-foreground flex items-center"
    >
      <div className="site-container py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12 items-end">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              §  Error 404 · Page not found
            </span>

            <h1 className="display-serif text-[clamp(3rem,11vw,9rem)] leading-[0.92] tracking-[-0.035em]">
              <span className="block">Lost in</span>
              <span className="block italic">
                <span className="lime-mark">latent space</span>
              </span>
              <span className="block text-muted-foreground/80">
                — let&apos;s steer you back.
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist on
              {" "}<span className="text-foreground">{profile.name}</span>&apos;s
              portfolio. Maybe the URL was mistyped, or the link is stale.
              Try one of the routes below — or head back to the homepage and
              keep exploring AI/ML projects, research and writing.
            </p>

            <nav
              aria-label="Recovery links"
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link href="/" className="btn-lime">
                Back to homepage
              </Link>
              <Link
                href="/#projects"
                className="btn-ghost-mono"
                aria-label="Jump to selected work"
              >
                Selected work
              </Link>
              <Link
                href="/resume"
                className="btn-ghost-mono"
                aria-label="View résumé page"
              >
                Read résumé
              </Link>
              <Link
                href="/#contact"
                className="btn-ghost-mono"
                aria-label="Open the contact form"
              >
                Get in touch
              </Link>
            </nav>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6 text-sm">
            <div className="rule-h" />
            <div className="flex flex-col gap-3">
              <span className="section-label">/ Popular sections</span>
              <Link
                href="/#about"
                className="link-underline w-fit"
                aria-label="About Pragadeeswaran K"
              >
                About me
              </Link>
              <Link
                href="/#interests"
                className="link-underline w-fit"
                aria-label="Research interests"
              >
                Research interests
              </Link>
              <Link
                href="/#skills"
                className="link-underline w-fit"
                aria-label="Technical stack"
              >
                Technical stack
              </Link>
              <Link
                href="/#experience"
                className="link-underline w-fit"
                aria-label="Experience timeline"
              >
                Experience
              </Link>
              <Link
                href="/#certifications"
                className="link-underline w-fit"
                aria-label="Verified credentials"
              >
                Certifications
              </Link>
            </div>
            <div className="rule-h" />
          </aside>
        </div>
      </div>
    </main>
  );
}
