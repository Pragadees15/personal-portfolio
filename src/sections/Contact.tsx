"use client";

import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { Github, Linkedin, Send, Check, Copy, Clock, MapPin, Loader2, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/resume";
import { cn } from "@/lib/utils";
import Image from "next/image";

// --- Types & Logic ---

type ContactProps = {
  avatarUrl?: string;
};

type StatusState = { tone: "info" | "success" | "error"; text: string } | null;

// Reuse the TiltCard logic for a consistent feel but customized for Contact
function ContactTiltCard({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className="relative w-full h-full"
    >
      <div className="relative w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: useMotionTemplate`radial-gradient(
              400px circle at ${useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])},
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )`
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}

export function Contact({ avatarUrl }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Time Logic
  const [time, setTime] = useState<string>("");
  const [isWorkingHours, setIsWorkingHours] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
      const istHours = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).format(now));
      setIsWorkingHours(istHours >= 10 && istHours <= 23);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTimeRef = useRef<number>(Date.now());
  const messageLimit = 1500;
  // Fallback email logic
  const formSubmitEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL || profile.email || "pragadees1323@gmail.com";
  const ajaxEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail)}`;

  useEffect(() => {
    loadTimeRef.current = Date.now();
  }, []);

  const copyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

    if (!trimmed.name || !/.+@.+\..+/.test(trimmed.email) || !trimmed.message) {
      setStatus({ tone: "error", text: "Please fill all fields correctly." });
      return;
    }

    setIsSubmitting(true);
    // setStatus({ tone: "info", text: "Sending..." }); // Optional: could show loading state differently

    try {
      const params = new URLSearchParams();
      params.set("name", trimmed.name);
      params.set("email", trimmed.email);
      params.set("message", form.message.trim());
      params.set("_subject", `New contact from ${trimmed.name}`);
      params.set("_replyto", trimmed.email);
      params.set("_captcha", "false");
      params.set("_honey", honeypot);
      params.set("elapsedMs", String(Date.now() - loadTimeRef.current));

      const res = await fetch(ajaxEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: params.toString(),
      });
      const payload = await res.json().catch(() => null);

      if (res.ok && payload?.success !== "false") {
        setStatus({ tone: "success", text: "Message received! I'll get back to you soon." });
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus({ tone: "error", text: "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ tone: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="site-container py-24 sm:py-32 scroll-mt-24 relative overflow-hidden">


      <SectionHeading subtitle="Ready to collaborate?">
        Let&apos;s Build the Future
      </SectionHeading>

      <div className="mt-20 grid lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">

        {/* LEFT COLUMN: Profile Card (2/5 width) */}
        <div
          className="lg:col-span-2 flex flex-col h-full"
        >
          <ContactTiltCard>
            <div className="flex flex-col h-full p-8 relative z-20">

              {/* Header: Avatar & Online Status */}
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  {avatarUrl ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-xl">
                      <Image
                        src={avatarUrl}
                        alt={profile.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-zinc-800 shadow-xl">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-1.5 rounded-full z-10">
                    <div className={cn("w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900", isWorkingHours ? "bg-emerald-500" : "bg-amber-500")}>
                      {isWorkingHours && <div className="animate-ping absolute inset-0 rounded-full bg-emerald-500 opacity-75" />}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 font-medium tracking-wide">ASIA / KOLKATA</span>
                </div>
              </div>

              {/* Info Block */}
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {profile.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  I&apos;m currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 pt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 mt-auto">
                <div
                  onClick={copyEmail}
                  className="group flex flex-col p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 z-10">Email Address</span>
                  <div className="flex items-center justify-between z-10">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-4">{profile.email}</span>
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />}
                  </div>
                </div>

                <div className="flex gap-2">
                  {[
                    { icon: Github, href: profile.github, label: "GitHub" },
                    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all group/btn"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover/btn:text-indigo-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </ContactTiltCard>
        </div>

        {/* RIGHT COLUMN: Interactive Form (3/5 width) */}
        <div
          className="lg:col-span-3 h-full"
        >
          <div className="relative h-full bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 overflow-hidden">

            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" />

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:border-zinc-300 dark:hover:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jane@example.com"
                    disabled={isSubmitting}
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:border-zinc-300 dark:hover:border-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell me about your project, idea, or just say hi..."
                  rows={5}
                  maxLength={messageLimit}
                  disabled={isSubmitting}
                  className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:border-zinc-300 dark:hover:border-white/20 resize-none"
                />
                <div className="flex justify-end text-[10px] text-zinc-400 font-medium">
                  {form.message.length} / {messageLimit}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <AnimatePresence mode='wait'>
                  {status ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={cn(
                        "text-sm font-medium flex items-center gap-2",
                        status.tone === "error" ? "text-rose-500" : "text-emerald-500"
                      )}
                    >
                      {status.tone === "error" ? <div className="w-2 h-2 rounded-full bg-rose-500" /> : <Check className="w-4 h-4" />}
                      {status.text}
                    </motion.div>
                  ) : (
                    <div /> // Spacer
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden group px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none disabled:scale-100"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </form>

            {/* Background Pattern for Form */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
