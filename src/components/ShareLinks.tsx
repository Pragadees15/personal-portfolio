"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Twitter,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ShareLinksProps = {
  /**
   * Default URL/title to share. Both are also resolved at runtime from the
   * actual document so the share works even when the site is mounted under a
   * different host (preview deploys, custom domains, etc).
   */
  url?: string;
  title?: string;
  description?: string;
  className?: string;
};

type ShareTarget = {
  id: string;
  label: string;
  href: (ctx: { url: string; title: string; description: string }) => string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
};

const TARGETS: ShareTarget[] = [
  {
    id: "twitter",
    label: "Share on X (Twitter)",
    icon: Twitter,
    external: true,
    href: ({ url, title }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    icon: Linkedin,
    external: true,
    href: ({ url, title }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}&title=${encodeURIComponent(title)}`,
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    icon: Facebook,
    external: true,
    href: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    icon: MessageCircle,
    external: true,
    href: ({ url, title }) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} — ${url}`,
      )}`,
  },
  {
    id: "telegram",
    label: "Share on Telegram",
    icon: Send,
    external: true,
    href: ({ url, title }) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    icon: Share2,
    external: true,
    href: ({ url, title }) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(
        url,
      )}&title=${encodeURIComponent(title)}`,
  },
  {
    id: "email",
    label: "Share via Email",
    icon: Mail,
    href: ({ url, title, description }) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        `${description}\n\n${url}`,
      )}`,
  },
];

const FALLBACK_URL = "https://pragadeeswaran.dev/";

const subscribeToLocation = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("popstate", cb);
  window.addEventListener("hashchange", cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener("hashchange", cb);
  };
};

const getSnapshotUrl = () => {
  if (typeof window === "undefined") return FALLBACK_URL;
  return window.location.origin + window.location.pathname;
};

const getServerSnapshotUrl = () => FALLBACK_URL;

const noopSubscribe = () => () => {};
const getCanNativeShare = () =>
  typeof navigator !== "undefined" && "share" in navigator;
const getCanNativeShareServer = () => false;

export function ShareLinks({
  url,
  title = "Pragadeeswaran K — AI/ML Engineer Portfolio",
  description = "AI/ML engineer building human-centered AI: computer vision, deep learning and efficient ML systems.",
  className,
}: ShareLinksProps) {
  const liveUrl = useSyncExternalStore(
    subscribeToLocation,
    getSnapshotUrl,
    getServerSnapshotUrl,
  );
  const resolved = {
    url: url ?? liveUrl,
    title,
    description,
  };
  const [copied, setCopied] = useState(false);

  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    getCanNativeShare,
    getCanNativeShareServer,
  );

  const onNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !("share" in navigator)) return;
    try {
      await navigator.share({
        url: resolved.url,
        title: resolved.title,
        text: resolved.description,
      });
    } catch {
      // user dismissed — silently ignore
    }
  }, [resolved.url, resolved.title, resolved.description]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolved.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }, [resolved.url]);

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      itemScope
      itemType="https://schema.org/WebPage"
      itemID={resolved.url}
    >
      <meta itemProp="url" content={resolved.url} />
      <meta itemProp="name" content={resolved.title} />

      <span className="section-label" id="share-label">
        / Share this page
      </span>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-labelledby="share-label"
      >
        {TARGETS.map((t) => {
          const Icon = t.icon;
          const href = t.href(resolved);
          return (
            <a
              key={t.id}
              href={href}
              aria-label={`${t.label} — Pragadeeswaran K portfolio`}
              title={t.label}
              {...(t.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:text-foreground"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{t.label}</span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy link to this page"
          title={copied ? "Link copied" : "Copy link"}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
            copied
              ? "border-[var(--accent-lime)] text-[var(--accent-lime-ink)]"
              : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">{copied ? "Link copied" : "Copy link"}</span>
        </button>

        {canNativeShare && (
          <button
            type="button"
            onClick={onNativeShare}
            aria-label="Open native share sheet"
            title="More share options"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">More share options</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ShareLinks;
