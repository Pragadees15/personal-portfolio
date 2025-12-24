import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Improve image quality for better resolution
    minimumCacheTTL: 60,

    // Allow using local API routes (with query strings) as Image src,
    // e.g. /api/github-og?owner=...&repo=...
    localPatterns: [
      {
        pathname: "/api/github-og",
        search: "?*",
      },
      {
        pathname: "/logos/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "source.boringavatars.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
    // Allow dangerously allowing SVG imports if needed for simple-icons
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 100],
  },
};

export default nextConfig;
