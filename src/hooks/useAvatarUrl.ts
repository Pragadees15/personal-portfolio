"use client";

import { useState, useEffect } from "react";

/**
 * Hook to get GitHub avatar URL with cache busting
 * @param username - GitHub username (e.g., "Pragadees15")
 * @param size - Optional size parameter (default: 280)
 * @returns Avatar URL with cache busting timestamp
 */
export function useAvatarUrl(username: string, size: number = 280): string {
  // Start with base URL (no timestamp) to avoid hydration mismatch
  const baseUrl = `https://github.com/${username}.png?size=${size}`;
  const [avatarUrl, setAvatarUrl] = useState(baseUrl);

  useEffect(() => {
    // Add cache busting timestamp only on client-side after hydration
    const urlWithTimestamp = `https://github.com/${username}.png?size=${size}&t=${Date.now()}`;
    setAvatarUrl(urlWithTimestamp);
  }, [username, size]);

  return avatarUrl;
}

