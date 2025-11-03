"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { type: "in" | "out"; text: string };

const HELP = `Available commands:\nhelp — show this help\nwhoami — brief intro\ncontact — email / links\nclear — clear the terminal\nTip: you can also type a question directly (no 'ask' needed)`;

export default function DevTerminal() {
  const [history, setHistory] = useState<Entry[]>([
    { type: "out", text: "Type 'help' to begin." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Don't auto-focus on initial load to prevent scroll to terminal
    // Only focus when user clicks on terminal or explicitly interacts
    const handleClick = () => {
      inputRef.current?.focus();
    };
    
    const terminalElement = scrollRef.current?.closest('section');
    if (terminalElement) {
      terminalElement.addEventListener('click', handleClick);
      return () => terminalElement.removeEventListener('click', handleClick);
    }
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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length === 0) return;
      setHistoryIndex((idx) => {
        const next = idx === null ? inputHistory.length - 1 : Math.max(0, idx - 1);
        setInput(inputHistory[next] ?? "");
        // Move caret to end on next tick
        requestAnimationFrame(() => {
          const el = inputRef.current;
          if (!el) return;
          el.setSelectionRange(el.value.length, el.value.length);
        });
        return next;
      });
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (inputHistory.length === 0) return;
      setHistoryIndex((idx) => {
        if (idx === null) return null;
        const next = idx + 1;
        if (next >= inputHistory.length) {
          setInput("");
          return null;
        }
        setInput(inputHistory[next] ?? "");
        requestAnimationFrame(() => {
          const el = inputRef.current;
          if (!el) return;
          el.setSelectionRange(el.value.length, el.value.length);
        });
        return next;
      });
      return;
    }
    // Reset cycling when typing
    if (e.key.length === 1) {
      setHistoryIndex(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setHistory((h) => [...h, { type: "in", text: `> ${cmd}` }]);
    setInputHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
    setInput("");
    const key = cmd.split(" ")[0].toLowerCase();

    // Back-compat: ask <prompt>
    if (key === "ask") {
      const prompt = cmd.slice(3).trim();
      if (!prompt) {
        await typeOut("Usage: ask <your question>");
        return;
      }
      try {
        setIsTyping(true);
        setHistory((h) => [...h, { type: "out", text: "Thinking..." }]);
        const res = await fetch("/api/terminal", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        const msg = data?.reply || data?.error || "(no response)";
        setHistory((h) => h.slice(0, -1));
        await typeOut(String(msg));
      } catch {
        setHistory((h) => h.slice(0, -1));
        await typeOut("Failed to contact AI service.");
      }
      return;
    }

    const run = (commands as any)[key] as (() => string) | undefined;
    if (run) {
      const out = run();
      try {
        window.dispatchEvent(new CustomEvent("terminal:ran-command", { detail: { cmd: key } }));
      } catch {}
      if (out === "__CLEAR__") {
        setHistory([]);
        return;
      }
      await typeOut(out);
      return;
    }

    // Fallback: treat any other input as an AI question
    try {
      setIsTyping(true);
      setHistory((h) => [...h, { type: "out", text: "Thinking..." }]);
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: cmd }),
      });
      const data = await res.json();
      const msg = data?.reply || data?.error || "(no response)";
      setHistory((h) => h.slice(0, -1));
      await typeOut(String(msg));
    } catch {
      setHistory((h) => h.slice(0, -1));
      await typeOut("Failed to contact AI service.");
    }
    return;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between border-b border-zinc-200/70 px-3 py-2 text-[11px] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]" />
        </div>
        <span className="truncate font-mono">portfolio@pragadees: ~</span>
        <div className="w-10" />
      </div>

      <div
        ref={scrollRef}
        className="max-h-72 overflow-auto bg-zinc-50 font-mono text-[12px] leading-relaxed text-zinc-800 [tab-size:4] dark:bg-zinc-950 dark:text-zinc-100"
      >
        <div className="px-3 py-2">
          {history.map((e, i) => (
            <div key={i} className={e.type === "in" ? "text-zinc-500 dark:text-zinc-400" : "whitespace-pre-wrap break-words"}>
              {e.text}
            </div>
          ))}
          {isTyping && (
            <div className="whitespace-pre-wrap break-words" aria-live="polite" />
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="border-t border-zinc-200/70 dark:border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 font-mono text-[12px]">
          <span className="select-none text-zinc-700 dark:text-zinc-300">
            <span className="text-emerald-400">portfolio</span>
            <span className="text-zinc-500">@</span>
            <span className="text-sky-400">pragadees</span>
            <span className="text-zinc-500">:</span>
            <span className="text-amber-300">~</span>
            <span className="text-zinc-500">$</span>
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="help | whoami | contact"
            className="w-full bg-transparent py-0.5 text-zinc-900 caret-emerald-400 placeholder-zinc-500 outline-none dark:text-zinc-100"
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}


