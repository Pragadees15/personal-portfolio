"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  ChevronRight,
  Command,
  Github,
  Linkedin,
  Mail,
  Cpu,
  Code2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS = {
  help: { desc: "List available commands", icon: <Command size={14} /> },
  whoami: { desc: "Display user profile", icon: <Cpu size={14} /> },
  projects: { desc: "View portfolio projects", icon: <Code2 size={14} /> },
  contact: { desc: "Get contact info", icon: <Mail size={14} /> },
  clear: { desc: "Clear terminal history", icon: <Sparkles size={14} /> },
};

type Entry = {
  id: string;
  type: "in" | "out" | "system";
  content: ReactNode;
  timestamp: Date;
};

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Initializing kernel...",
    "Loading modules...",
    "Verifying integrity...",
    "Mounting file system...",
    "Starting shell..."
  ];

  useEffect(() => {
    if (step >= steps.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setStep(s => s + 1), 150);
    return () => clearTimeout(timer);
  }, [step, steps.length, onComplete]);

  return (
    <div className="space-y-1 font-mono text-xs sm:text-sm text-zinc-500">
      {steps.slice(0, step + 1).map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-emerald-500">✓</span> {msg}
        </motion.div>
      ))}
    </div>
  );
};

export default function DevTerminal() {
  const [history, setHistory] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [isBooted, setIsBooted] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isBooted]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      type: "in",
      content: trimmedCmd,
      timestamp: new Date(),
    };

    setHistory(prev => [...prev, newEntry]);
    setInputHistory(prev => [...prev, trimmedCmd]);
    setHistoryPointer(null);
    setInput("");

    const commandKey = trimmedCmd.split(" ")[0].toLowerCase();

    // Process Command
    let output: ReactNode = null;

    switch (commandKey) {
      case "help":
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Object.entries(COMMANDS).map(([key, { desc, icon }]) => (
              <div key={key} className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-emerald-400 p-1.5 bg-emerald-500/10 rounded-md">{icon}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-200">{key}</span>
                  <span className="text-xs text-zinc-400">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg mt-2 space-y-2">
            <h3 className="font-bold text-emerald-400 text-lg">Pragadeeswaran</h3>
            <p className="text-zinc-300 leading-relaxed">
              AI/ML Engineer & Computer Vision Researcher crafting intelligent systems.
              Based in the shell, living on the edge of innovation.
            </p>
          </div>
        );
        break;
      case "contact":
        output = (
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a href="mailto:pragadees1323@gmail.com" className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
              <Mail size={16} /> <span>Email</span>
            </a>
            <a href="https://github.com/Pragadees15" target="_blank" className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
              <Github size={16} /> <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/pragadees15/" target="_blank" className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
              <Linkedin size={16} /> <span>LinkedIn</span>
            </a>
          </div>
        );
        break;
      case "projects":
        output = (
          <div className="space-y-3 mt-2">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]" />
              <div>
                <span className="font-bold text-zinc-100">Personal Portfolio</span>
                <p className="text-zinc-400 text-sm">Next.js 15, React 19, Tailwind CSS. You are here.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_2px_rgba(168,85,247,0.5)]" />
              <div>
                <span className="font-bold text-zinc-100">AI Research Tools</span>
                <p className="text-zinc-400 text-sm">Python, PyTorch, Custom Algorithms.</p>
              </div>
            </div>
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        output = (
          <span className="text-red-400">
            Command not found: {commandKey}. Type 'help' for available commands.
          </span>
        );
    }

    // Add output with slight delay for realism
    setTimeout(() => {
      setHistory(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        type: "out",
        content: output,
        timestamp: new Date()
      }]);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length === 0) return;
      const nextIndex = historyPointer === null
        ? inputHistory.length - 1
        : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIndex);
      setInput(inputHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer === null) return;
      const nextIndex = historyPointer + 1;
      if (nextIndex >= inputHistory.length) {
        setHistoryPointer(null);
        setInput("");
      } else {
        setHistoryPointer(nextIndex);
        setInput(inputHistory[nextIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(COMMANDS).find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <motion.div
      layout
      className={`
        relative overflow-hidden rounded-lg border border-white/10 shadow-2xl backdrop-blur-xl
        bg-black/90 dark:bg-black/80 transition-all duration-500
        ${isMaximized ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'w-full h-[350px] max-w-3xl mx-auto'}
      `}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="ml-3 flex items-center gap-2 text-[10px] md:text-xs font-medium text-zinc-400">
            <TerminalIcon size={10} />
            <span>pragadees@dev-terminal:~</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:text-zinc-200 transition-colors"
          >
            {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="h-[calc(100%-2.5rem)] overflow-y-auto p-3 font-mono text-xs md:text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        {!isBooted ? (
          <BootSequence onComplete={() => setIsBooted(true)} />
        ) : (
          <div className="space-y-3">
            <div className="text-zinc-400 mb-4">
              Welcome to Pragadees OS. Type <span className="text-emerald-400 font-bold">'help'</span> to get started.
            </div>

            <AnimatePresence mode="popLayout">
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  {entry.type === "in" && (
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ChevronRight size={14} className="text-emerald-500" />
                      <span className="font-bold">{entry.content}</span>
                    </div>
                  )}
                  {entry.type === "out" && (
                    <div className="ml-5 text-zinc-300">
                      {entry.content}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex items-center gap-2 pt-1">
              <ChevronRight size={14} className="text-emerald-500 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-700 caret-emerald-500"
                placeholder="Enter command..."

                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
