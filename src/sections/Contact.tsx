"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Clock,
  Copy,
  Github,
  Linkedin,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";

import { profile } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type ContactProps = {
  avatarUrl?: string;
};

type StatusState = { tone: "info" | "success" | "error"; text: string } | null;

export function Contact({ avatarUrl }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<string>("");
  const [isWorkingHours, setIsWorkingHours] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now),
      );
      const istHours = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          hour12: false,
        }).format(now),
      );
      setIsWorkingHours(istHours >= 10 && istHours <= 23);
    };
    updateTime();
    const t = setInterval(updateTime, 60_000);
    return () => clearInterval(t);
  }, []);

  const messageLimit = 1500;

  const copyEmail = () => {
    if (!profile.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!trimmed.name || !/.+@.+\..+/.test(trimmed.email) || !trimmed.message) {
      setStatus({ tone: "error", text: "Please fill all fields correctly." });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmed.name,
          email: trimmed.email,
          message: trimmed.message,
          _honey: honeypot || undefined,
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { success?: string | boolean; message?: string }
        | null;
      const success =
        data?.success === true ||
        data?.success === "true" ||
        (data?.success === undefined && res.ok);

      if (res.ok && success) {
        setStatus({
          tone: "success",
          text: "Message received. I'll be in touch soon.",
        });
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        const hint =
          res.status === 429
            ? "Too many requests. Please wait and try again."
            : data?.message || "Something went wrong. Please try again.";
        setStatus({ tone: "error", text: hint });
      }
    } catch {
      setStatus({ tone: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="site-container scroll-mt-24"
    >
      <SectionHeading number="10" subtitle="Contact — Say hello">
        Let&apos;s build <em className="italic">something</em>.
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
        {/* LEFT — profile card */}
        <aside className="lg:col-span-5 card-flat hover-lift p-7 sm:p-9 flex flex-col gap-7">
          <header className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-foreground/15">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`Avatar of ${profile.name} — ${profile.role}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-secondary font-display text-xl">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-display italic text-2xl leading-tight">
                  {profile.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  {profile.role}
                </p>
              </div>
            </div>
            <span className="chip-mono">
              <Clock className="h-3 w-3" />
              {time || "—"}
            </span>
          </header>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isWorkingHours ? "bg-[var(--accent-lime)]" : "bg-amber-500",
              )}
            />
            <span className="font-mono text-xs uppercase tracking-[0.14em]">
              {isWorkingHours
                ? "Online · Replying within hours"
                : "Resting · Replying within a day"}
            </span>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            I&apos;m open to AI/ML projects, research collaborations and
            full-stack engineering — say hi, ask anything, or just tell me
            what you&apos;re building.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-[0.14em]">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </div>

          <div className="rule-h" />

          <div
            onClick={copyEmail}
            className="cursor-pointer flex flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4 transition hover:border-foreground/30"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Email — Click to copy
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-lg italic truncate">
                {profile.email}
              </span>
              {copied ? (
                <Check className="h-4 w-4 text-[var(--accent-lime-ink)]" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer me"
              className="btn-ghost-mono justify-center"
              aria-label={`Open ${profile.name}'s GitHub profile in a new tab`}
            >
              <Github className="h-3.5 w-3.5" />
              GitHub repos
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer me"
              className="btn-ghost-mono justify-center"
              aria-label={`Open ${profile.name}'s LinkedIn profile in a new tab`}
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn page
            </a>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="lg:col-span-7 card-flat hover-lift p-7 sm:p-10">
          <p className="font-display text-3xl italic mb-8">
            Send a message.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <input
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
            />

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-foreground/15 px-0 py-3 text-base outline-none transition placeholder-muted-foreground/40 focus:border-foreground"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="jane@example.com"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-foreground/15 px-0 py-3 text-base outline-none transition placeholder-muted-foreground/40 focus:border-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Tell me about your idea, project or question…"
                rows={6}
                maxLength={messageLimit}
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-foreground/15 px-0 py-3 text-base outline-none transition placeholder-muted-foreground/40 focus:border-foreground resize-none"
              />
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
                {form.message.length} / {messageLimit}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
              <div
                className="min-h-[1.5rem] flex-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {status && (
                  <div
                    className={cn(
                      "text-sm font-mono uppercase tracking-[0.14em] inline-flex items-center gap-2 animate-fade-in",
                      status.tone === "error"
                        ? "text-rose-500"
                        : "text-foreground",
                    )}
                  >
                    {status.tone === "error" ? (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {status.text}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="btn-lime disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
