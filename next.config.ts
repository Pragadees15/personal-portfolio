import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Improve image quality for better resolution
    minimumCacheTTL: 60,
    // Configure quality levels for better image rendering
    qualities: [75, 90, 100],
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
    ],
  },
};

export default nextConfig;
