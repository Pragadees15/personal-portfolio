"use client";

import { useEffect, useMemo, useRef } from "react";
import { skillsGrouped, projects as staticProjects } from "@/data/resume";
import { motion, useReducedMotion } from "framer-motion";

type Node = { id: string; label: string; x: number; y: number; vx: number; vy: number; r: number; group: string };
type Link = { source: string; target: string; weight: number };

function buildGraph() {
  const nodes: Node[] = [];
  const links: Link[] = [];
  // Build unique skill list across groups (normalize by lowercase label)
  const seen = new Map<string, string>(); // key: lower label, value: group
  Object.entries(skillsGrouped).forEach(([group, list]) => {
    list.forEach((skill) => {
      const k = skill.toLowerCase();
      if (!seen.has(k)) seen.set(k, group);
    });
  });
  seen.forEach((group, lowerLabel) => {
    const label = Object.entries(skillsGrouped)
      .flatMap(([, list]) => list)
      .find((s) => s.toLowerCase() === lowerLabel) as string;
    nodes.push({ id: lowerLabel, label, group, x: Math.random(), y: Math.random(), vx: 0, vy: 0, r: 14 });
  });
  // Link skills that co-occur in a project stack (by normalized label)
  const bySkill = new Map<string, number>();
  nodes.forEach((n, i) => bySkill.set(n.id, i));
  staticProjects.forEach((p) => {
    const stack = (p.stack || []).map((s) => s.toLowerCase()).filter((s) => bySkill.has(s));
    for (let i = 0; i < stack.length; i++) {
      for (let j = i + 1; j < stack.length; j++) {
        const a = stack[i];
        const b = stack[j];
        const existing = links.find((l) => (l.source === a && l.target === b) || (l.source === b && l.target === a));
        if (existing) existing.weight += 1; else links.push({ source: a, target: b, weight: 1 });
      }
    }
  });
  return { nodes, links };
}

export default function SkillMap() {
  const reduceMotion = useReducedMotion();
  const { nodes: initialNodes, links } = useMemo(() => buildGraph(), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const canvasEl = canvas;
    const ctxEl = ctx;
    let anim = 0;
    const nodes = initialNodes.map((n) => ({ ...n, x: Math.random() * canvasEl.width, y: Math.random() * canvasEl.height }));
    const center = { x: () => canvasEl.width / 2, y: () => canvasEl.height / 2 };

    function step() {
      // physics params
      const charge = -200;
      const linkK = 0.03;
      const linkLen = 90;
      const damping = 0.85;

      // repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist2 = dx * dx + dy * dy + 0.01;
          const force = charge / dist2;
          const invDist = 1 / Math.sqrt(dist2);
          const fx = force * dx * invDist;
          const fy = force * dy * invDist;
          a.vx += -fx; a.vy += -fy;
          b.vx += fx; b.vy += fy;
        }
      }
      // links (spring)
      for (const l of links) {
        const a = nodes.find((n) => n.id === l.source);
        const b = nodes.find((n) => n.id === l.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(0.1, Math.hypot(dx, dy));
        const diff = dist - linkLen;
        const k = linkK * (1 + Math.min(3, l.weight));
        const nx = (dx / dist) * diff * k;
        const ny = (dy / dist) * diff * k;
        a.vx += nx; a.vy += ny;
        b.vx -= nx; b.vy -= ny;
      }
      // pull to center
      for (const n of nodes) {
        n.vx += (center.x() - n.x) * 0.0008;
        n.vy += (center.y() - n.y) * 0.0008;
      }
      // integrate
      for (const n of nodes) {
        n.vx *= damping; n.vy *= damping;
        n.x += n.vx * (reduceMotion ? 0.3 : 1);
        n.y += n.vy * (reduceMotion ? 0.3 : 1);
      }

      // draw
      ctxEl.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctxEl.save();
      ctxEl.globalAlpha = 0.6;
      ctxEl.strokeStyle = "rgba(99,102,241,0.35)";
      for (const l of links) {
        const a = nodes.find((n) => n.id === l.source);
        const b = nodes.find((n) => n.id === l.target);
        if (!a || !b) continue;
        ctxEl.lineWidth = 1 + Math.min(2, l.weight * 0.3);
        ctxEl.beginPath();
        ctxEl.moveTo(a.x, a.y);
        ctxEl.lineTo(b.x, b.y);
        ctxEl.stroke();
      }
      ctxEl.restore();

      for (const n of nodes) {
        ctxEl.globalAlpha = 1;
        ctxEl.beginPath();
        ctxEl.fillStyle = "rgba(255,255,255,0.9)";
        ctxEl.strokeStyle = "rgba(99,102,241,0.5)";
        ctxEl.lineWidth = 2;
        ctxEl.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctxEl.fill();
        ctxEl.stroke();
      }

      anim = requestAnimationFrame(step);
    }

    function resize() {
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = rect.width * window.devicePixelRatio;
      canvasEl.height = rect.height * window.devicePixelRatio;
      ctxEl.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    resize();
    anim = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, [initialNodes, links, reduceMotion]);

  const skills = useMemo(() => initialNodes.map((n) => ({ id: n.id, label: n.label, group: n.group })), [initialNodes]);

  function goToProjects(skill: string) {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      window.dispatchEvent(new Event("focus-projects-search"));
      window.dispatchEvent(new CustomEvent<string>("projects:set-query", { detail: skill }));
    }, 250);
  }

  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/60">
      <div className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">Skill Map</div>
      <div className="grid gap-3 sm:grid-cols-[1fr_280px]">
        <div className="relative h-[320px] sm:h-[360px] rounded-xl overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute bottom-2 right-3 text-[11px] text-zinc-500 dark:text-zinc-400">Click a skill to search projects</div>
        </div>
        <div className="grid content-start gap-2 max-h-[360px] overflow-auto pr-1">
          {skills.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => goToProjects(s.label)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              className="inline-flex items-center justify-between rounded-md border-2 border-zinc-200/70 bg-white/70 px-3 py-1.5 text-xs text-zinc-700 transition hover:border-indigo-300 hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-indigo-600/40"
            >
              <span>{s.label}</span>
              <span className="text-[10px] text-zinc-400">{s.group.replace(/([A-Z])/g, " $1").trim()}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
