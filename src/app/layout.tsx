import type { Metadata } from "next";
import { Instrument_Serif, Geist, JetBrains_Mono } from "next/font/google";
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0A" },
  ],
};

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const githubUsername = getGithubUsernameFromUrl(profile.github);
const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pragadeeswaran K — AI/ML Engineer",
    template: "%s — Pragadeeswaran K",
  },
  description:
    "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). An editorial portfolio of projects, research, and open-source work.",
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
    title: "Pragadeeswaran K — AI/ML Engineer",
    description:
      "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). An editorial portfolio of projects, research, and open-source work.",
    siteName: "Pragadeeswaran Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Pragadeeswaran K — AI/ML Engineer Portfolio",
        type: "image/png",
      },
      {
        url: `${siteUrl}/avatar`,
        width: 400,
        height: 400,
        alt: "Pragadeeswaran K — Profile Picture",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pragadeeswaran K — AI/ML Engineer",
    description:
      "AI/ML engineer focused on computer vision and efficient ML systems (CGPA 9.33/10). An editorial portfolio of projects, research, and open-source work.",
    images: [
      {
        url: `${siteUrl}/twitter-image`,
        width: 1200,
        height: 630,
        alt: "Pragadeeswaran K — AI/ML Engineer",
      },
      {
        url: `${siteUrl}/avatar`,
        width: 400,
        height: 400,
        alt: "Pragadeeswaran K — Profile Picture",
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
  icons: {
    icon: [
      { url: "/icon?v=1", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
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
    "msapplication-TileColor": "#FAFAF7",
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
      <body
        className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background focus:outline-none"
        >
          Skip to main content
        </a>
        <SmoothScroll>
          <ThemeProvider>
            <HyperModeToggle />
            <CommandPalette />
            <Background />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(getPersonSchema(siteUrl, avatarUrl)),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(getWebsiteSchema(siteUrl)),
              }}
            />
            {children}
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
