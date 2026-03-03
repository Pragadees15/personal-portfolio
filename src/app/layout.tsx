import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Background } from "@/components/Background";
import HyperModeToggle from "@/components/HyperModeToggle";
import CommandPalette from "@/components/CommandPalette";
import { profile } from "@/data/resume";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getGithubUsernameFromUrl } from "@/lib/github";
import { getSiteUrl } from "@/lib/site";
import { getPersonSchema, getWebsiteSchema } from "@/lib/seo";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#667eea',
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const githubUsername = getGithubUsernameFromUrl(profile.github);
const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pragadeeswaran K — AI/ML Engineer Portfolio",
    template: "%s — Pragadeeswaran K",
  },
  description:
    "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). Explore my projects, research, and open‑source work.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "Deep Learning",
    "Reinforcement Learning",
    "PyTorch",
    "TensorFlow",
    "OpenCV",
    "RAPIDS",
    "Next.js",
    "Portfolio",
    "Pragadeeswaran",
    "AI Researcher",
    "ML Systems",
    "Data Science",
    "Neural Networks",
    "Image Processing",
  ],
  authors: [{ name: "Pragadeeswaran K", url: "https://github.com/Pragadees15" }],
  creator: "Pragadeeswaran K",
  publisher: "Pragadeeswaran K",
  applicationName: "Pragadeeswaran Portfolio",
  category: "Portfolio",
  classification: "Technology Portfolio",
  openGraph: {
    title: "Pragadeeswaran K — AI/ML Engineer Portfolio",
    description:
      "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). Explore my projects, research, and open‑source work.",
    // Prefer setting per-route `openGraph.url` in page metadata to avoid
    // emitting the homepage URL for nested routes like `/resume`.
    siteName: "Pragadeeswaran Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Pragadeeswaran K - AI/ML Engineer Portfolio",
        type: "image/png",
      },
      {
        url: `${siteUrl}/avatar`,
        width: 400,
        height: 400,
        alt: "Pragadeeswaran K - Profile Picture",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pragadeeswaran K — AI/ML Engineer Portfolio",
    description:
      "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). Explore my projects, research, and open‑source work.",
    images: [
      {
        url: `${siteUrl}/twitter-image`,
        width: 1200,
        height: 630,
        alt: "Pragadeeswaran K - AI/ML Engineer",
      },
      {
        url: `${siteUrl}/avatar`,
        width: 400,
        height: 400,
        alt: "Pragadeeswaran K - Profile Picture",
      },
    ],
    creator: "@pragadees15",
    site: "@pragadees15",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Prefer per-route canonical URLs in page metadata.
  icons: {
    icon: [
      { url: "/icon?v=1", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" }, // Fallback
    ],
    apple: [
      {
        url: "/apple-icon?v=1",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/icon?v=1",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#667eea",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 dark:bg-black`}>
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-[60] focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Skip to main content
        </a>
        {/* Decorative background gradients - simplified for R3F background */}
        <div aria-hidden className="pointer-events-none fixed top-0 left-0 w-full h-[100lvh] -z-30">
          {/* subtle dotted grid - reduced opacity */}
          <div
            className="absolute inset-0 bg-grid-dots-light dark:bg-grid-dots-dark opacity-[0.12]"
            style={{ WebkitMaskImage: "radial-gradient(80% 60% at 50% 40%, black, transparent)", maskImage: "radial-gradient(80% 60% at 50% 40%, black, transparent)" }}
          />
          {/* Subtle corner accents - very low opacity to not compete with 3D */}
          {/* Subtle corner accents - optimized: using radial gradients instead of blurred conic gradients */}

        </div>
        <SmoothScroll>
          <ThemeProvider>
            <HyperModeToggle />
            <CommandPalette />
            <Background />
            {/* SEO: JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(getPersonSchema(siteUrl, avatarUrl))
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(getWebsiteSchema(siteUrl))
              }}
            />
            {children}
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
