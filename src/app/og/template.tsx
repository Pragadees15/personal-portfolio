import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";
import { fetchAvatarDataUrl } from "@/lib/avatarDataUrl";
import { getGithubUsernameFromUrl } from "@/lib/github";
import { fetchGoogleFont } from "@/lib/ogFonts";
/* eslint-disable @next/next/no-img-element */

export type SocialImageOptions = {
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  subtitle?: string;
  sectionLabel?: string;
  italicWord?: string;
  avatarUrl?: string;
};

export async function renderSocialImage(opts: SocialImageOptions = {}) {
  const {
    width = 1200,
    height = 630,
    alt = "Social image",
    title = profile.name,
    subtitle = profile.role || "AI/ML Engineer",
    sectionLabel = "PORTFOLIO",
    italicWord,
    avatarUrl: avatarOverride,
  } = opts;

  const [serifReg, serifItalic, sans, mono] = await Promise.all([
    fetchGoogleFont("Instrument+Serif"),
    fetchGoogleFont("Instrument+Serif", true),
    fetchGoogleFont("Geist", false, 400),
    fetchGoogleFont("JetBrains+Mono", false, 400),
  ]);

  // Hard fallback if Google Fonts is unavailable — keep the OG endpoint working.
  const fallbackFont = serifReg ?? sans ?? mono ?? serifItalic;
  if (!fallbackFont) {
    throw new Error("Failed to load any fonts for social image");
  }

  const githubUsername = getGithubUsernameFromUrl(profile.github);
  const fallbackAvatar = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;
  const srcUrl = avatarOverride || fallbackAvatar;

  let avatarDataUrl: string = srcUrl;
  try {
    const fetched = await fetchAvatarDataUrl(srcUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    if (fetched && fetched.startsWith("data:")) {
      avatarDataUrl = fetched;
    }
  } catch {
    // keep direct URL as last resort
  }

  // Brand tokens (mirror globals.css editorial palette)
  const ink = "#0B0B0A";
  const paper = "#FAFAF7";
  const muted = "rgba(11, 11, 10, 0.55)";
  const hairline = "rgba(11, 11, 10, 0.14)";
  const lime = "#C5FF3D";

  // Split title so we can italicize + lime-highlight one word.
  const titleParts = (() => {
    if (!italicWord) return [{ text: title, italic: false }];
    const idx = title.lastIndexOf(italicWord);
    if (idx === -1) return [{ text: title, italic: false }];
    return [
      { text: title.slice(0, idx), italic: false },
      { text: italicWord, italic: true },
      { text: title.slice(idx + italicWord.length), italic: false },
    ];
  })();

  const horizontalPadding = 72;
  const verticalPadding = 56;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: paper,
          color: ink,
          position: "relative",
          padding: `${verticalPadding}px ${horizontalPadding}px`,
          fontFamily: "Geist, sans-serif",
        }}
        aria-label={alt}
      >
        {/* Subtle dot grid background — keep faint to evoke the site's paper feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(11,11,10,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.5,
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 18,
            letterSpacing: "0.18em",
            color: muted,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: ink, fontFamily: "Instrument Serif, serif" }}>
              §
            </span>
            <span>{sectionLabel}</span>
            <span style={{ opacity: 0.4 }}>—</span>
            <span>2026</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Pragadees15</span>
          </div>
        </div>

        {/* Top hairline */}
        <div
          style={{
            height: 1,
            background: hairline,
            marginTop: 22,
            position: "relative",
          }}
        />

        {/* Body grid: name + meta on left, avatar on right */}
        <div
          style={{
            display: "flex",
            flex: 1,
            position: "relative",
            paddingTop: 64,
            paddingBottom: 32,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 820,
            }}
          >
            {/* Numbered eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 16,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: muted,
                marginBottom: 24,
              }}
            >
              <span>01</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span>{subtitle}</span>
            </div>

            {/* Display name with italic + lime accent on last word */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                fontFamily: "Instrument Serif, serif",
                fontSize: 124,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                color: ink,
              }}
            >
              {titleParts.map((part, i) =>
                part.italic ? (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      fontStyle: "italic",
                      backgroundImage: `linear-gradient(180deg, transparent 62%, ${lime} 62%, ${lime} 92%, transparent 92%)`,
                      paddingLeft: 6,
                      paddingRight: 6,
                      marginLeft: 6,
                    }}
                  >
                    {part.text}
                  </div>
                ) : (
                  <div key={i} style={{ display: "flex" }}>
                    {part.text}
                  </div>
                ),
              )}
            </div>

            {/* Tagline */}
            <div
              style={{
                marginTop: 28,
                fontFamily: "Geist, sans-serif",
                fontSize: 26,
                lineHeight: 1.35,
                color: muted,
                maxWidth: 720,
              }}
            >
              Computer vision, deep learning, and reproducible ML systems.
            </div>
          </div>

          {/* Right: avatar plate */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 168,
                height: 168,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${hairline}`,
                background: "rgba(11,11,10,0.04)",
              }}
            >
              <img
                src={avatarDataUrl}
                alt={profile.name}
                width={168}
                height={168}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: muted,
              }}
            >
              SRMIST · 9.33 / 10
            </div>
          </div>
        </div>

        {/* Bottom hairline */}
        <div
          style={{
            height: 1,
            background: hairline,
            position: "relative",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            marginTop: 18,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span>Tiruvannamalai · IST</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>github.com/Pragadees15</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: lime,
              }}
            />
            <span>Available for AI/ML roles</span>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        ...(serifReg
          ? [
              {
                name: "Instrument Serif",
                data: serifReg,
                style: "normal" as const,
                weight: 400 as const,
              },
            ]
          : []),
        ...(serifItalic
          ? [
              {
                name: "Instrument Serif",
                data: serifItalic,
                style: "italic" as const,
                weight: 400 as const,
              },
            ]
          : []),
        ...(sans
          ? [
              {
                name: "Geist",
                data: sans,
                style: "normal" as const,
                weight: 400 as const,
              },
            ]
          : []),
        ...(mono
          ? [
              {
                name: "JetBrains Mono",
                data: mono,
                style: "normal" as const,
                weight: 400 as const,
              },
            ]
          : []),
      ],
    },
  );
}

export const defaultAlt = "Pragadeeswaran K — AI/ML Engineer";
export const defaultSize = { width: 1200, height: 630 };
export const defaultContentType = "image/png";
