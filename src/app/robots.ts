import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const url = new URL(siteUrl);

  return {
    rules: [
      {
        // Everything is crawlable by every bot (incl. AI/answer engines like
        // GPTBot, PerplexityBot, ClaudeBot) — a portfolio wants maximum reach.
        // We only fence off server endpoints that aren't real content; the
        // dynamic OG/avatar/icon image routes stay open so social + image
        // crawlers can fetch share previews.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${url.origin}/sitemap.xml`,
    host: url.host,
  };
}

