"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  Phone,
  CalendarClock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  FileDown,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/resume";

type StatusState = { tone: "info" | "success" | "error"; text: string } | null;

const responseStats = [
  { label: "Avg. reply time", value: "<24 hrs" },
  { label: "Timezone", value: "IST (GMT+5:30)" },
  { label: "Collaboration", value: "AI/ML, docs-first UX" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null);
  const loadTimeRef = useRef<number>(Date.now());
  const messageLimit = 1200;
  const formSubmitEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL || profile.email || "pragadees1323@gmail.com";
  const ajaxEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail)}`;
  const fallbackEndpoint = `https://formsubmit.co/${encodeURIComponent(formSubmitEmail)}`;

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
        accent: "from-indigo-500/10 to-indigo-500/0",
      },
      profile.linkedin
        ? {
          label: "LinkedIn",
          detail: "Roles, speaking & mentorship",
          href: profile.linkedin,
          icon: Linkedin,
          accent: "from-sky-500/10 to-sky-500/0",
        }
        : null,
      profile.github
        ? {
          label: "GitHub",
          detail: "Open-source collabs & reviews",
          href: profile.github,
          icon: Github,
          accent: "from-emerald-400/10 to-emerald-400/0",
        }
        : null,
    ].filter(Boolean) as {
      label: string;
      detail?: string;
      href?: string;
      icon: typeof Mail;
      accent: string;
    }[],
    []
  );

  const infoHighlights = [
    { label: "Role", value: profile.role, icon: Briefcase },
    profile.location ? { label: "Location", value: profile.location, icon: MapPin } : null,
    profile.phone ? { label: "Phone", value: profile.phone, icon: Phone, copyable: true } : null,
  ].filter(Boolean) as { label: string; value?: string; icon: typeof Briefcase; copyable?: boolean }[];

  const handleCopy = async (value: string, field: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

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

      if (payload?.message?.includes("browsed as HTML files")) {
        const fallbackRes = await fetch(fallbackEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
          redirect: "manual",
        });

        if (fallbackRes.ok || (fallbackRes.status >= 300 && fallbackRes.status < 400)) {
          setStatus({ tone: "success", text: "Thanks! I’ll reply shortly." });
          setForm({ name: "", email: "", message: "" });
          setHoneypot("");
          loadTimeRef.current = Date.now();
          return;
        }
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
            className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60"
          >
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Project-ready
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">Tell me about your idea or role</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              I’m currently focused on AI/ML research, developer tooling, and delightful documentation. Send a brief overview and I’ll share next steps within a day.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {responseStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-200/70 bg-white/70 p-3 text-sm text-zinc-700 shadow-inner dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{stat.label}</div>
                  <div className="mt-1 text-base font-semibold text-zinc-900 dark:text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Preferred channels</p>
              <div className="space-y-3">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href?.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href?.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 text-sm text-zinc-700 transition hover:border-indigo-300 hover:bg-white/95 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl bg-gradient-to-br ${channel.accent} p-2 text-indigo-600 dark:text-indigo-200`}>
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

            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="pointer-events-none absolute -right-16 top-8 hidden h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.2),transparent_70%)] blur-2xl sm:block"
            />
          </motion.article>

          <div className="grid gap-4 rounded-3xl border border-zinc-200/70 bg-white/70 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              <CalendarClock className="h-4 w-4" />
              Availability & details
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {infoHighlights.map((info) => (
                <div key={info.label} className="rounded-2xl border border-zinc-200/60 bg-white/70 p-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <info.icon className="h-4 w-4" />
                    {info.label}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-zinc-900 dark:text-white">
                    <span>{info.value}</span>
                    {info.copyable && info.value && (
                      <button
                        type="button"
                        onClick={() => handleCopy(info.value!, "phone")}
                        className="text-xs text-indigo-500 hover:text-indigo-400"
                      >
                        {copiedField === "phone" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-white/10">AI/ML internships</span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-white/10">Product prototyping</span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-white/10">Technical writing & docs</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(profile.email!, "email")}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-100"
                >
                  {copiedField === "email" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy email
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const lines = [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:${profile.name}`,
                    profile.role ? `TITLE:${profile.role}` : "",
                    profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
                    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
                    profile.linkedin ? `URL:${profile.linkedin}` : "",
                    profile.github ? `URL:${profile.github}` : "",
                    "END:VCARD",
                  ].filter(Boolean);
                  const blob = new Blob([lines.join("\n")], { type: "text/vcard;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "contact.vcf";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-100"
              >
                <FileDown className="h-3.5 w-3.5" />
                Download vCard
              </button>
              <a
                href="/resume"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 underline underline-offset-4 hover:text-indigo-500 dark:text-indigo-300"
              >
                View full resume <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
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
