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
import {
  getBreadcrumbSchema,
  getPersonSchema,
  getProfilePageSchema,
  getWebsiteSchema,
} from "@/lib/seo";

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
    default:
      "Pragadeeswaran K — AI/ML Engineer Building Human-Centered AI",
    template: "%s — Pragadeeswaran K",
  },
  description:
    "Pragadeeswaran K — AI/ML engineer building human-centered AI. Computer vision, deep learning and efficient ML systems. Portfolio of projects & research.",
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
    types: {
      "text/markdown": "/index.md",
    },
  },
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
    title: "Pragadeeswaran K — AI/ML Engineer Building Human-Centered AI",
    description:
      "Pragadeeswaran K — AI/ML engineer building human-centered AI. Computer vision, deep learning and efficient ML systems (CGPA 9.39/10).",
    url: siteUrl,
    siteName: "Pragadeeswaran K Portfolio",
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
    title: "Pragadeeswaran K — AI/ML Engineer Building Human-Centered AI",
    description:
      "Pragadeeswaran K — AI/ML engineer building human-centered AI. Computer vision, deep learning and efficient ML systems (CGPA 9.39/10).",
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
  // Search-engine ownership verification. These render only when the matching
  // env var is set (e.g. in Vercel project settings), so local/dev HTML stays
  // clean. Add the token from Google Search Console / Bing Webmaster / Yandex.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.YANDEX_VERIFICATION
      ? { yandex: process.env.YANDEX_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
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
    "article:author": "Pragadeeswaran K",
    "profile:first_name": "Pragadeeswaran",
    "profile:last_name": "K",
    "profile:username": "pragadees15",
    // Geo meta tags — help local SEO + region-targeted indexing.
    "geo.region": "IN-TN",
    "geo.placename": "Tiruvannamalai",
    "geo.position": "12.2253;79.0747",
    ICBM: "12.2253, 79.0747",
    // Dublin Core — older but still consumed by some scanners and academic
    // search engines, helps establish authorship + topic.
    "DC.title": "Pragadeeswaran K — AI/ML Engineer Portfolio",
    "DC.creator": "Pragadeeswaran K",
    "DC.subject":
      "Artificial Intelligence, Machine Learning, Computer Vision, Deep Learning, Reinforcement Learning",
    "DC.description":
      "Editorial portfolio of Pragadeeswaran K — AI/ML engineer building human-centered AI.",
    "DC.publisher": "Pragadeeswaran K",
    "DC.language": "en-US",
    "DC.type": "InteractiveResource",
    "DC.format": "text/html",
    "DC.identifier": siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Preconnect / dns-prefetch — open the TCP+TLS handshake to external
          CDNs early so logos, GitHub avatars and brand icons render without a
          visible delay. This also improves LCP on slow networks, which feeds
          back into Core Web Vitals and SEO ranking signals.
        */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://opengraph.githubassets.com" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <link rel="dns-prefetch" href="https://blogger.googleusercontent.com" />
        <link rel="me" href={profile.github} />
        <link rel="me" href={profile.linkedin} />
        <link rel="me" href={`mailto:${profile.email}`} />
        <link rel="author" href={`${siteUrl}/#person`} />
        <link rel="describedby" href={`${siteUrl}/llms.txt`} />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getProfilePageSchema(siteUrl, avatarUrl)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema(siteUrl)),
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background focus:outline-none"
        >
          Skip to main content
        </a>
        <noscript>
          <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "640px", margin: "0 auto" }}>
            <h1>Pragadeeswaran K — AI/ML Engineer</h1>
            <p>
              AI/ML engineer building human-centered AI. Focused on computer
              vision, deep learning, reinforcement learning and efficient ML
              systems (CGPA 9.39/10).
            </p>
            <p>
              This site requires JavaScript for the full interactive
              experience. Core content is still indexable without it.
            </p>
            <ul>
              <li><a href="https://github.com/Pragadees15">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/pragadees15/">LinkedIn</a></li>
              <li><a href="mailto:pragadees1323@gmail.com">Email</a></li>
            </ul>
          </div>
        </noscript>
        <SmoothScroll>
          <ThemeProvider>
            <HyperModeToggle />
            <CommandPalette />
            <Background />
            {children}
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
