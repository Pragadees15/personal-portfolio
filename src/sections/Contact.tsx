"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Clock, MapPin, Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/resume";

export function Contact() {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const loadTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadTimeRef.current = Date.now();
  }, []);

  async function onSubmit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatus("Sending...");

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? ""); // honeypot
    const elapsedMs = Date.now() - loadTimeRef.current;

    // Basic client-side validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!name || !emailOk || !message) {
      setStatus("Please fill all fields correctly");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message, website, elapsedMs }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStatus("Sent!");
        // reset fields
        (document.getElementById("name") as HTMLInputElement | null)?.value && ((document.getElementById("name") as HTMLInputElement).value = "");
        (document.getElementById("email") as HTMLInputElement | null)?.value && ((document.getElementById("email") as HTMLInputElement).value = "");
        (document.getElementById("message") as HTMLTextAreaElement | null)?.value && ((document.getElementById("message") as HTMLTextAreaElement).value = "");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data?.error || "Failed to send");
      }
    } catch (err) {
      setStatus("Network error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="site-container py-20 scroll-mt-24">
      <SectionHeading subtitle="Let’s get in touch">Contact</SectionHeading>
      <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
        <form
          aria-label="Contact form"
          action={onSubmit}
          className="grid max-w-xl gap-3 rounded-2xl border border-zinc-200/70 bg-white/60 p-6 backdrop-blur dark:border-white/10 dark:bg-zinc-900/40"
        >
          {/* Honeypot field (hidden from users) */}
          <label className="sr-only" htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <label className="sr-only" htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Name" className="rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-zinc-900/60" required disabled={isSubmitting} />
          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" className="rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-zinc-900/60" required disabled={isSubmitting} />
          <label className="sr-only" htmlFor="message">Message</label>
          <textarea id="message" name="message" placeholder="Message" rows={5} className="rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-zinc-900/60" required disabled={isSubmitting} />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900">{isSubmitting ? "Sending..." : "Send"}</button>
            {status && <span role="status" className="text-sm text-zinc-500 dark:text-zinc-400">{status}</span>}
          </div>
        </form>

        <div className="relative">
          <div className="grid gap-4">
            {/* Quick profile facts card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-3">Profile</div>
              <div className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.role}</span>
                </div>
                {profile.location && (
                  <div className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-indigo-700 hover:underline dark:text-indigo-300">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </a>
                )}
              </div>
              <div className="mt-3">
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
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200"
                >
                  Download vCard
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-100"
              >
                Let’s collaborate
              </motion.div>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Prefer DMs first? Reach me on these platforms or drop an email.
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {profile.email && (
                  <>
                    <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
                      <Mail className="h-4 w-4" /> Email
                    </a>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200"
                    >
                      Copy Email
                    </button>
                  </>
                )}
              </div>
              {copied && (
                <div role="status" className="mt-2 text-xs text-green-600 dark:text-green-400">Copied email to clipboard</div>
              )}
              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Typically replies within 24 hours</span>
              </div>

              {/* subtle animated accent */}
              <motion.span
                aria-hidden
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 0.25, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent_70%)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


