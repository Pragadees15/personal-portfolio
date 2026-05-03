import { profile } from "@/data/resume";

const PERSON_ID_FRAGMENT = "#person";

export function getPersonSchema(siteUrl: string, avatarUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}${PERSON_ID_FRAGMENT}`,
    name: profile.name,
    givenName: profile.name.split(" ")[0],
    familyName: profile.name.split(" ").slice(1).join(" "),
    jobTitle: profile.role,
    description:
      "Pragadeeswaran K is an AI/ML engineer building human-centered AI — focused on computer vision, deep learning, reinforcement learning and efficient ML systems.",
    url: siteUrl,
    email: profile.email,
    telephone: profile.phone,
    image: avatarUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tiruvannamalai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "SRM Institute of Science and Technology",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressCountry: "IN",
      },
    },
    sameAs: [profile.github, profile.linkedin, `mailto:${profile.email}`],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "Reinforcement Learning",
      "Agentic AI",
      "Generative Models",
      "Natural Language Processing",
      "Python",
      "PyTorch",
      "TensorFlow",
      "OpenCV",
      "RAPIDS",
      "Data Science",
      "Neural Networks",
      "MLOps",
      "Edge ML",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "Organization",
        name: "SRM Institute of Science and Technology",
      },
    },
    nationality: { "@type": "Country", name: "India" },
  };
}

export function getWebsiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: "Pragadeeswaran K Portfolio",
    alternateName: ["Pragadeeswaran Portfolio", "Pragadees Portfolio"],
    url: siteUrl,
    description:
      "Portfolio of Pragadeeswaran K — AI/ML engineer building human-centered AI: projects, research, certifications, and writing.",
    author: {
      "@type": "Person",
      "@id": `${siteUrl}${PERSON_ID_FRAGMENT}`,
      name: profile.name,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}${PERSON_ID_FRAGMENT}`,
      name: profile.name,
    },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { "@type": "Person", name: profile.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getProfilePageSchema(siteUrl: string, avatarUrl: string) {
  const now = new Date().toISOString();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}#profile-page`,
    url: siteUrl,
    name: `${profile.name} — ${profile.role}`,
    headline: `${profile.name} — ${profile.role} building human-centered AI`,
    description:
      "Editorial portfolio of Pragadeeswaran K — selected AI/ML projects, research, certifications and ways to get in touch.",
    inLanguage: "en-US",
    dateModified: now,
    datePublished: "2024-01-01T00:00:00.000Z",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteUrl}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}${PERSON_ID_FRAGMENT}`,
      name: profile.name,
      image: avatarUrl,
      url: siteUrl,
    },
    isPartOf: { "@id": `${siteUrl}#website` },
  };
}

export function getBreadcrumbSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Selected Work",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Résumé",
        item: `${siteUrl}/resume`,
      },
    ],
  };
}

