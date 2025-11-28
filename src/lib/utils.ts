import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects if the user is on a mobile device
 * This is a client-side check, so it should only be used in client components
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
}

/**
 * Generates a deterministic abstract preview image encoded as an inline SVG data URL.
 * Avoids remote fetches (and the associated TLS issues) while still producing varied thumbnails.
 */
export function getProjectPreviewImage(seed: string): string {
  const safeSeed = seed?.trim().toLowerCase() || "project-preview";
  const palette = ["#4f46e5", "#a855f7", "#06b6d4", "#f97316", "#22d3ee"];

  let hash = 0;
  for (let i = 0; i < safeSeed.length; i++) {
    hash = (hash * 31 + safeSeed.charCodeAt(i)) >>> 0;
  }

  const pickColor = (offset: number) => palette[(hash + offset) % palette.length];

  const width = 1200;
  const height = 675;
  const gradientId = `grad-${hash.toString(16)}`;
  const radialId = `radial-${(hash >> 3).toString(16)}`;

  const circle1 = {
    cx: 200 + (hash % 800),
    cy: 150 + ((hash >> 5) % 375),
    r: 120 + ((hash >> 9) % 160),
  };

  const circle2 = {
    cx: 400 + ((hash >> 7) % 600),
    cy: 250 + ((hash >> 11) % 300),
    r: 80 + ((hash >> 13) % 120),
  };

  const waveY = 360 + ((hash >> 2) % 100) - 50;
  const waveOffset = 60 + ((hash >> 4) % 80);

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${pickColor(0)}" />
      <stop offset="100%" stop-color="${pickColor(2)}" />
    </linearGradient>
    <radialGradient id="${radialId}" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${pickColor(1)}" stop-opacity="0.65" />
      <stop offset="100%" stop-color="${pickColor(1)}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${gradientId})" />
  <circle cx="${circle1.cx}" cy="${circle1.cy}" r="${circle1.r}" fill="url(#${radialId})" />
  <circle cx="${circle2.cx}" cy="${circle2.cy}" r="${circle2.r}" fill="${pickColor(3)}" fill-opacity="0.2" />
  <path d="M0 ${waveY} C 300 ${waveY - waveOffset}, 600 ${waveY + waveOffset}, 900 ${waveY - waveOffset}, 1200 ${waveY + waveOffset} L 1200 ${height} L 0 ${height} Z" fill="${pickColor(4)}" fill-opacity="0.18" />
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}