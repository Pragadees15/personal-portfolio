"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { type: "in" | "out"; text: string };

const HELP = `Available commands:\nhelp — show this help\nwhoami — brief intro\ncontact — email / links\nclear — clear the terminal`;

export default function DevTerminal() {
  const [history, setHistory] = useState<Entry[]>([
    { type: "out", text: "Type 'help' to begin." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, isTyping]);

  const commands = useMemo(() => ({
    help: () => HELP,
    whoami: () => "Pragadeeswaran — AI/ML engineer & CS student.",
    contact: () => "Email: pragadees1323@gmail.com\nGitHub: github.com/Pragadees15\nLinkedIn: linkedin.com/in/pragadees15/",
    clear: () => "__CLEAR__",
  }), []);

  function typeOut(text: string) {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      // Start with a placeholder line we will update in-place
      setHistory((h) => [...h, { type: "out", text: "" }]);
      if (!text) {
        setIsTyping(false);
        resolve();
        return;
      }
      let i = 0;
      const chunk = () => {
        i += 2;
        const part = text.slice(0, i);
        setHistory((h) => {
          if (h.length === 0) return [{ type: "out", text: part }];
          const newH = h.slice();
          newH[newH.length - 1] = { type: "out", text: part };
          return newH;
        });
        if (i < text.length) {
          requestAnimationFrame(chunk);
        } else {
          setIsTyping(false);
          resolve();
        }
      };
      requestAnimationFrame(chunk);
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setHistory((h) => [...h, { type: "in", text: `> ${cmd}` }]);
    setInput("");
    const key = cmd.split(" ")[0].toLowerCase();
    const run = (commands as any)[key] as (() => string) | undefined;
    const out = run ? run() : `Command not found: '${cmd}'. Type 'help'.`;
    try {
      window.dispatchEvent(new CustomEvent("terminal:ran-command", { detail: { cmd: key } }));
    } catch {}
    if (out === "__CLEAR__") {
      setHistory([]);
      return;
    }
    await typeOut(out);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between border-b border-zinc-200/70 px-2 py-1.5 text-[11px] text-zinc-500 dark:border-white/10">
        <span className="truncate">portfolio@pragadees: ~</span>
      </div>
      <div ref={scrollRef} className="max-h-56 overflow-auto px-2 py-2 text-xs font-mono leading-relaxed text-zinc-800 dark:text-zinc-100">
        {history.map((e, i) => (
          <div key={i} className={e.type === "in" ? "text-zinc-600 dark:text-zinc-300" : ""}>
            {e.text}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t border-zinc-200/70 px-2 py-1.5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="help | whoami | contact"
            className="w-full bg-transparent py-0.5 text-xs text-zinc-800 outline-none placeholder-zinc-400 dark:text-zinc-100"
            aria-label="Terminal input"
          />
        </div>
      </form>
    </div>
  );
}


