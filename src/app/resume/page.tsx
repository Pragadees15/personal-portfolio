import { profile } from "@/data/resume";
import { getSiteUrl } from "@/lib/site";
import ResumePageClient from "./resume-page-client";

export const dynamic = "force-static";

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Résumé — AI/ML Engineer Building Human-Centered AI",
  description:
    "View or download the résumé of Pragadeeswaran K — AI/ML engineer building human-centered AI. Computer vision, deep learning, reinforcement learning and efficient ML systems experience (CGPA 9.33/10).",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Résumé — Pragadeeswaran K",
    description:
      "View or download the résumé of Pragadeeswaran K — AI/ML engineer building human-centered AI.",
    url: "/resume",
    images: [
      {
        url: "/resume/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Résumé preview — Pragadeeswaran K, AI/ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Résumé — Pragadeeswaran K",
    description:
      "View or download the résumé of Pragadeeswaran K — AI/ML engineer building human-centered AI.",
    images: ["/resume/opengraph-image"],
  },
} as const;

const resumeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/resume#page`,
  url: `${siteUrl}/resume`,
  name: `Résumé — ${profile.name}`,
  headline: `Résumé of ${profile.name} — ${profile.role}`,
  description:
    "Detailed résumé of Pragadeeswaran K — AI/ML engineer building human-centered AI.",
  inLanguage: "en-US",
  isPartOf: { "@id": `${siteUrl}#website` },
  about: {
    "@type": "Person",
    "@id": `${siteUrl}#person`,
    name: profile.name,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${siteUrl}/resume/opengraph-image`,
    width: 1200,
    height: 630,
  },
  mainEntity: {
    "@type": "DigitalDocument",
    name: `Résumé — ${profile.name}`,
    encodingFormat: "application/pdf",
    url: `${siteUrl}/resume.pdf`,
    author: { "@id": `${siteUrl}#person` },
    inLanguage: "en-US",
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
      name: "Résumé",
      item: `${siteUrl}/resume`,
    },
  ],
};

export default function ResumePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ResumePageClient />
    </>
  );
}


