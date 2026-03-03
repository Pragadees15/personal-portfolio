import { profile } from "@/data/resume";

export function getPersonSchema(siteUrl: string, avatarUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: "B.Tech AI student specializing in Computer Vision, Deep Learning, and Efficient ML Systems",
    url: siteUrl,
    email: profile.email,
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
    sameAs: [
      profile.github,
      profile.linkedin,
      `mailto:${profile.email}`,
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "Reinforcement Learning",
      "Python",
      "PyTorch",
      "TensorFlow",
      "OpenCV",
      "RAPIDS",
      "Data Science",
      "Neural Networks",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "Organization",
        name: "SRM Institute of Science and Technology",
      },
    },
  };
}

export function getWebsiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pragadeeswaran Portfolio",
    url: siteUrl,
    description: "Portfolio website showcasing AI/ML projects, research, and skills",
    author: {
      "@type": "Person",
      name: profile.name,
    },
    inLanguage: "en-US",
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

