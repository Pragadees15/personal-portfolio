"use client";

import { useEffect } from "react";

export function ScrollRestoration() {
  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    // If there's a hash, let the browser handle the navigation
    if (!window.location.hash) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        // Also set scrollTop directly as fallback
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, []);

  return null;
}

