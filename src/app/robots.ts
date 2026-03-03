import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const url = new URL(siteUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${url.origin}/sitemap.xml`,
    host: url.host,
  };
}

