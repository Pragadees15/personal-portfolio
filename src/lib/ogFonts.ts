// Older browser UA forces Google Fonts to serve WOFF instead of WOFF2,
// which is what `next/og` (Satori) supports.
const TTF_UA =
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/19.0.1084.46 Safari/537.36";

export async function fetchGoogleFont(
  family: string,
  italic = false,
  weight = 400,
): Promise<ArrayBuffer | null> {
  const params = italic
    ? `family=${family}:ital,wght@1,${weight}`
    : `family=${family}:wght@${weight}`;
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?${params}&display=swap`,
      {
        headers: { "User-Agent": TTF_UA },
        next: { revalidate: 86400 },
      },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const match = css.match(
      /url\((https?:[^)]+)\)\s+format\('(?:truetype|opentype|woff2?)'\)/,
    );
    if (!match) return null;
    const fontRes = await fetch(match[1], { next: { revalidate: 86400 } });
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}
