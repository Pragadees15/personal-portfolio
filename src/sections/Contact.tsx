"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/resume";

type StatusState = { tone: "info" | "success" | "error"; text: string } | null;

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadTimeRef = useRef<number>(Date.now());
  const messageLimit = 1200;
  const formSubmitEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL || profile.email || "pragadees1323@gmail.com";
  const ajaxEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail)}`;

  useEffect(() => {
    loadTimeRef.current = Date.now();
  }, []);

  const messageCount = form.message.length;

  const contactChannels = useMemo(
    () => [
      {
        label: "Email",
        detail: profile.email,
        href: profile.email ? `mailto:${profile.email}` : undefined,
        icon: Mail,
      },
      profile.linkedin
        ? {
          label: "LinkedIn",
          detail: "Connect for roles or collaboration",
          href: profile.linkedin,
          icon: Linkedin,
        }
        : null,
      profile.github
        ? {
          label: "GitHub",
          detail: "Open-source projects & code",
          href: profile.github,
          icon: Github,
        }
        : null,
    ].filter(Boolean) as {
      label: string;
      detail?: string;
      href?: string;
      icon: typeof Mail;
    }[],
    []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    const emailOk = /.+@.+\..+/.test(trimmed.email);
    if (!trimmed.name || !emailOk || !trimmed.message) {
      setStatus({ tone: "error", text: "Please fill all fields correctly." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ tone: "info", text: "Sending your message..." });

    try {
      const params = new URLSearchParams();
      params.set("name", trimmed.name);
      params.set("email", trimmed.email);
      params.set("message", form.message.trim());
      params.set("_subject", `New contact from ${trimmed.name}`);
      params.set("_replyto", trimmed.email);
      params.set("_captcha", "false");
      params.set("_template", "table");
      params.set("_honey", honeypot);
      params.set("elapsedMs", String(Date.now() - loadTimeRef.current));

      const res = await fetch(ajaxEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      const payload = await res.json().catch(() => null);

      if (res.ok && payload?.success !== "false") {
        setStatus({ tone: "success", text: "Thanks! I’ll reply shortly." });
        setForm({ name: "", email: "", message: "" });
        setHoneypot("");
        loadTimeRef.current = Date.now();
        return;
      }

      setStatus({ tone: "error", text: payload?.message || "Failed to send. Please retry." });
    } catch {
      setStatus({ tone: "error", text: "Network error. Please retry." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="site-container py-12 sm:py-16 md:py-20 scroll-mt-24">
      <SectionHeading subtitle="Let's get in touch">Contact</SectionHeading>
      <div className="mt-8 grid gap-8 items-start lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.7fr)]">
        <div className="space-y-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-6 shadow-md ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Send a quick message</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Share a brief overview of what you’re working on or looking for. I usually reply within 24 hours.
            </p>

            <div className="mt-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Reach me via</p>
              <div className="space-y-2">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href?.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href?.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white/70 px-4 py-2.5 text-sm text-zinc-700 transition hover:border-indigo-300 hover:bg-white/95 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-zinc-100 p-2 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-200">
                        <channel.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">{channel.label}</div>
                        {channel.detail && <div className="text-xs text-zinc-500 dark:text-zinc-400">{channel.detail}</div>}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                  </a>
                ))}
              </div>
            </div>
          </motion.article>
        </div>

        <form
          aria-label="Contact form"
          onSubmit={handleSubmit}
          className="relative grid w-full max-w-lg justify-self-center gap-4 rounded-2xl border border-zinc-200/70 bg-white/95 p-5 shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/70 lg:justify-self-end"
        >
          <div className="space-y-1 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">Write a note</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">I read every message and usually reply within a day.</p>
          </div>

          <label className="sr-only" htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-xl border border-zinc-200/80 bg-white/95 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@email.com"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-xl border border-zinc-200/80 bg-white/95 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Share context, goals, current blockers…"
              rows={4}
              maxLength={messageLimit}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:border-indigo-500"
              required
            />
            <div className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">{messageCount}/{messageLimit}</div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-fuchsia-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
            {status && (
              <div
                role="status"
                className={`rounded-2xl border px-3 py-2 text-xs font-medium ${status.tone === "success"
                  ? "border-emerald-300/70 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : status.tone === "error"
                    ? "border-rose-300/70 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-zinc-200/70 bg-white/70 text-zinc-600 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
                  }`}
              >
                {status.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
