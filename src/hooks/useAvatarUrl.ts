"use client";

/**
 * Hook to get GitHub avatar URL
 * @param username - GitHub username (e.g., "Pragadees15")
 * @param size - Optional size parameter (default: 280)
 * @returns Stable avatar URL (Next.js Image handles caching/optimization)
 */
export function useAvatarUrl(username: string, size: number = 280): string {
  // Use avatars.githubusercontent.com for better Next.js Image compatibility
  // No cache busting needed - Next.js Image Optimization handles caching
  // The v=4 parameter ensures we get the latest avatar version from GitHub
  return `https://avatars.githubusercontent.com/${username}?size=${size}&v=4`;
}

