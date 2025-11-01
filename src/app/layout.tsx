import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Background } from "@/components/Background";
import HyperModeToggle from "@/components/HyperModeToggle";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import { AchievementsProvider } from "@/components/achievements/AchievementsProvider";
import AchievementShelf from "@/components/achievements/AchievementShelf";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Pragadeeswaran K — AI/ML Engineer",
    template: "%s — Pragadeeswaran K",
  },
  description: "Modern portfolio showcasing AI/ML projects, research interests, and skills.",
  keywords: [
    "AI",
    "Machine Learning",
    "Computer Vision",
    "Reinforcement Learning",
    "Next.js",
    "Portfolio",
  ],
  openGraph: {
    title: "Pragadeeswaran K — AI/ML Engineer",
    description:
      "Modern portfolio showcasing AI/ML projects, research interests, and skills.",
    url: "https://example.com",
    siteName: "Pragadeeswaran Portfolio",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pragadeeswaran Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pragadeeswaran K — AI/ML Engineer",
    description:
      "Modern portfolio showcasing AI/ML projects, research interests, and skills.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
        {/* Decorative background gradients */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-10%] h-[40vh] w-[40vw] rounded-full bg-[conic-gradient(at_30%_30%,theme(colors.indigo.400/.25),transparent_40%)] blur-2xl dark:bg-[conic-gradient(at_30%_30%,theme(colors.indigo.500/.25),transparent_40%)]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[45vh] w-[45vw] rounded-full bg-[conic-gradient(at_70%_70%,theme(colors.fuchsia.400/.25),transparent_40%)] blur-2xl dark:bg-[conic-gradient(at_70%_70%,theme(colors.fuchsia.500/.25),transparent_40%)]" />
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
                url: "https://example.com",
                sameAs: [
                  "https://github.com/Pragadees15",
                  "https://www.linkedin.com/in/pragadees15/",
                  "mailto:pragadees1323@gmail.com"
                ]
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
                url: "https://example.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://example.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
          {children}
          <Footer />
          </AchievementsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
