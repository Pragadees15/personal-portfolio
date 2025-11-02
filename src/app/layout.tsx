import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Background } from "@/components/Background";
import HyperModeToggle from "@/components/HyperModeToggle";
import CommandPalette from "@/components/CommandPalette";
import { AchievementsProvider } from "@/components/achievements/AchievementsProvider";
import AchievementShelf from "@/components/achievements/AchievementShelf";
import { profile } from "@/data/resume";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const githubUsername = profile.github?.split("/").pop() || "Pragadees15";
const avatarUrl = `https://github.com/${githubUsername}.png?size=400`;
// Use environment variable or Vercel's auto-detected URL, fallback to actual deployment URL
// Set NEXT_PUBLIC_SITE_URL in Vercel environment variables for production
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://pragadeesportfolio.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pragadeeswaran K — AI/ML Engineer & Computer Vision Researcher",
    template: "%s — Pragadeeswaran K",
  },
  description: "B.Tech AI student (CGPA 9.31/10) specializing in Computer Vision, Deep Learning, Reinforcement Learning, and Efficient ML Systems. Showcasing cutting-edge AI/ML projects, research, and open-source contributions.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "Deep Learning",
    "Reinforcement Learning",
    "Representation Learning",
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
    title: "Pragadeeswaran K — AI/ML Engineer & Computer Vision Researcher",
    description:
      "B.Tech AI student (CGPA 9.31/10) specializing in Computer Vision, Deep Learning, and Efficient ML Systems. Explore my AI/ML projects, research, and open-source contributions.",
    url: siteUrl,
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
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pragadeeswaran K — AI/ML Engineer & Computer Vision Researcher",
    description:
      "B.Tech AI student specializing in Computer Vision, Deep Learning, and Efficient ML Systems. CGPA 9.31/10.",
    images: [
      {
        url: `${siteUrl}/twitter-image`,
        width: 1200,
        height: 630,
        alt: "Pragadeeswaran K - AI/ML Engineer",
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
  alternates: {
    canonical: siteUrl,
  },
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
    "theme-color": "#667eea",
    "msapplication-TileColor": "#667eea",
    "apple-mobile-web-app-capable": "yes",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 dark:bg-black`}>
        {/* Decorative background gradients - optimized */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-10%] h-[40vh] w-[40vw] rounded-full bg-[conic-gradient(at_30%_30%,theme(colors.indigo.400/.20),transparent_40%)] blur-xl dark:bg-[conic-gradient(at_30%_30%,theme(colors.indigo.500/.20),transparent_40%)] transform-gpu" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[45vh] w-[45vw] rounded-full bg-[conic-gradient(at_70%_70%,theme(colors.fuchsia.400/.20),transparent_40%)] blur-xl dark:bg-[conic-gradient(at_70%_70%,theme(colors.fuchsia.500/.20),transparent_40%)] transform-gpu" />
        </div>
        <ThemeProvider>
          <HyperModeToggle />
          <CommandPalette />
          <Background />
          <AchievementsProvider>
            <AchievementShelf />
          {/* SEO: JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Pragadeeswaran K",
                jobTitle: "AI/ML Engineer",
                description: "B.Tech AI student specializing in Computer Vision, Deep Learning, and Efficient ML Systems",
                url: siteUrl,
                email: "pragadees1323@gmail.com",
                image: avatarUrl,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Tiruvannamalai",
                  addressRegion: "Tamil Nadu",
                  addressCountry: "IN"
                },
                alumniOf: {
                  "@type": "EducationalOrganization",
                  name: "SRM Institute of Science and Technology",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Chennai",
                    addressCountry: "IN"
                  }
                },
                sameAs: [
                  "https://github.com/Pragadees15",
                  "https://www.linkedin.com/in/pragadees15/",
                  "mailto:pragadees1323@gmail.com"
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
                  "Neural Networks"
                ],
                hasCredential: {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "degree",
                  recognizedBy: {
                    "@type": "Organization",
                    name: "SRM Institute of Science and Technology"
                  }
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Pragadeeswaran Portfolio",
                url: siteUrl,
                description: "Portfolio website showcasing AI/ML projects, research, and skills",
                author: {
                  "@type": "Person",
                  name: "Pragadeeswaran K"
                },
                inLanguage: "en-US",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${siteUrl}/?q={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
          {children}
          </AchievementsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
