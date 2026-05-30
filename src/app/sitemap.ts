import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      // Surface the share image to Google Images / image search.
      images: [`${siteUrl}/opengraph-image`],
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${siteUrl}/projects/opengraph-image`],
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${siteUrl}/resume/opengraph-image`],
    },
  ];
}

