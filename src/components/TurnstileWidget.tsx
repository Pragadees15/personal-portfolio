"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "error-callback"?: () => void; "expired-callback"?: () => void; theme?: "light" | "dark"; size?: "normal" | "compact" }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey: string;
  onToken: (token: string) => void;
  onError?: () => void;
  theme?: "auto" | "light" | "dark";
  size?: "normal" | "compact";
};

export function TurnstileWidget({ siteKey, onToken, onError, theme = "auto", size = "compact" }: TurnstileWidgetProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    function ensureScript(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (window.turnstile) return resolve();
        const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.dataset.turnstile = "1";
        s.addEventListener("load", () => resolve(), { once: true });
        s.addEventListener("error", () => reject(), { once: true });
        document.head.appendChild(s);
      });
    }

    async function render() {
      try {
        await ensureScript();
        if (cancelled) return;
        const el = rootRef.current;
        const api = window.turnstile;
        if (!el || !api) return;

        const themeResolved: "light" | "dark" =
          theme === "auto"
            ? (document.documentElement.classList.contains("dark") ? "dark" : "light")
            : theme;

        widgetIdRef.current = api.render(el, {
          sitekey: siteKey,
          theme: themeResolved,
          size,
          callback: (token) => onToken(token),
          "error-callback": () => onError?.(),
          "expired-callback": () => onToken(""),
        });
      } catch {
        onError?.();
      }
    }

    render();

    return () => {
      cancelled = true;
      const api = window.turnstile;
      if (api && widgetIdRef.current) {
        try {
          api.reset(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  return <div ref={rootRef} />;
}

