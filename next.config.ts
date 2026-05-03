import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      // Browsers request /favicon.ico by default; serve the editorial monogram
      // PNG so the tab icon matches the brand without needing a static .ico file.
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
  async headers() {
    const buildDate = new Date().toUTCString();
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // Lightweight CSP just to prevent framing; full CSP needs nonces and is app-specific.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
          // Surface a sane Last-Modified so SEO crawlers don't think the page
          // was published in the past (some auditors flag a missing/wrong
          // server clock, aka the ":servertime" warning).
          { key: "Last-Modified", value: buildDate },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Last-Modified", value: buildDate },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Last-Modified", value: buildDate },
        ],
      },
    ];
  },
  images: {
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
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "source.boringavatars.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "jeevavelu.org" },
      { protocol: "https", hostname: "blogger.googleusercontent.com" },
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
