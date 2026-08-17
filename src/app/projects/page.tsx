import type { Metadata } from "next";
import Link from "next/link";

import { ShareLinks } from "@/components/ShareLinks";
import { profile, projects } from "@/data/resume";
import { getSiteUrl } from "@/lib/site";
import ProjectsClient from "@/sections/ProjectsClient";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Selected Work — AI/ML & Full-Stack Projects",
  description:
    "Selected AI/ML and full-stack projects by Pragadeeswaran K — computer vision, deep reinforcement learning, GPU-accelerated NLP, mobile and edge ML, with the stack and outcomes for each build.",
  alternates: {
    canonical: "/projects",
    types: { "text/markdown": "/projects.md" },
  },
  openGraph: {
    title: "Selected Work — Pragadeeswaran K",
    description:
      "Curated AI/ML and full-stack projects by Pragadeeswaran K, with the stack and outcomes for each build.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work — Pragadeeswaran K",
    description:
      "Curated AI/ML and full-stack projects by Pragadeeswaran K.",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/projects#collection`,
  url: `${siteUrl}/projects`,
  name: "Selected Work — Pragadeeswaran K",
  headline: "Selected AI/ML and full-stack projects by Pragadeeswaran K",
  description:
    "Curated AI/ML and full-stack projects by Pragadeeswaran K — computer vision, deep reinforcement learning, GPU-accelerated NLP, mobile and edge ML.",
  inLanguage: "en-US",
  isPartOf: { "@id": `${siteUrl}#website` },
  about: {
    "@type": "Person",
    "@id": `${siteUrl}#person`,
    name: profile.name,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        url: project.repo ?? project.demo ?? `${siteUrl}/projects`,
        description: project.bullets?.[0] ?? undefined,
        keywords: (project.stack ?? []).join(", "),
        author: {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: profile.name,
        },
      },
    })),
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Selected Work",
      item: `${siteUrl}/projects`,
    },
  ],
};

export default function ProjectsPage() {
  return (
    <main id="hero" className="site-container py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="mb-12 md:mb-16">
        <div className="rule-h" />
        <div className="mt-6 flex flex-col gap-6 reveal-stagger">
          <div className="flex w-full items-baseline justify-between gap-4">
            <span className="section-label">/ Case studies &amp; builds</span>
            <span className="section-number text-muted-foreground/60 tabular-nums hidden sm:inline">
              §
            </span>
          </div>
          <h1 className="display-serif text-balance text-[clamp(2.25rem,5.4vw,5rem)] leading-[0.96]">
            Selected <em className="italic">work</em> by Pragadeeswaran K.
          </h1>
        </div>
      </header>

      <p className="-mt-6 mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A curated archive of AI/ML and full-stack projects by
        {" "}<span className="text-foreground">{profile.name}</span> — from
        GPU-accelerated NLP and deep reinforcement learning agents to
        privacy-first mobile apps and developer tools. Each card shows the
        stack, the outcome and a link to the source.
      </p>

      <p className="mb-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Use the filter bar below to narrow by language or framework, sort
        alphabetically, or jump straight to the GitHub repository. Looking
        for the high-level story? Read the
        {" "}<Link href="/#about" className="link-underline text-foreground">
          About section
        </Link>{" "}
        on the homepage, or grab the full
        {" "}<Link href="/resume" className="link-underline text-foreground">
          résumé
        </Link>{" "}
        for the structured timeline.
      </p>

      <ProjectsClient projects={projects} />

      <div className="mt-20 border-t border-foreground/10 pt-10">
        <ShareLinks
          title="Selected Work — Pragadeeswaran K"
          description="Curated AI/ML and full-stack projects by Pragadeeswaran K."
        />
      </div>
    </main>
  );
}
