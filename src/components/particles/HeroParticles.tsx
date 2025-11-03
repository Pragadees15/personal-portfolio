"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function HeroParticles() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduce) return; // respect reduced motion
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const isHyper = () => root.dataset.hyper === "1";
    if (!isHyper()) return; // only run when Hyper Mode is enabled
    let raf = 0;
    const c = canvasRef.current;
    if (!c) return;
    const context = c.getContext("2d");
    if (!context) return;
    const cnv = c as HTMLCanvasElement;
    const ctx2 = context as CanvasRenderingContext2D;
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    function resize() {
      const rect = cnv.getBoundingClientRect();
      cnv.width = rect.width * window.devicePixelRatio;
      cnv.height = rect.height * window.devicePixelRatio;
      ctx2.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }
    resize();

    const POINTER = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = cnv.getBoundingClientRect();
      POINTER.x = e.clientX - rect.left;
      POINTER.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const density = Math.max(40, Math.min(120, Math.floor(cnv.width / 35)));
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.4 + 0.6,
      });
    }

    function step() {
      ctx2.clearRect(0, 0, cnv.width, cnv.height);
      const linkDist = isHyper() ? 140 : 90;
      const linkAlpha = isHyper() ? 0.18 : 0.12;
      // update and draw
      for (const p of particles) {
        // mild pointer repulsion
        const dx = POINTER.x - p.x, dy = POINTER.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 180 * 180) {
          const f = -0.3 / Math.max(80, d2);
          p.vx += f * dx; p.vy += f * dy;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cnv.width) p.vx *= -1;
        if (p.y < 0 || p.y > cnv.height) p.vy *= -1;
        ctx2.beginPath();
        ctx2.fillStyle = "rgba(99,102,241,0.8)";
        ctx2.arc(p.x, p.y, p.r * (isHyper() ? 1.3 : 1), 0, Math.PI * 2);
        ctx2.fill();
      }
      // links
      ctx2.strokeStyle = `rgba(139,92,246,${linkAlpha})`;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx2.globalAlpha = 1 - d / linkDist;
            ctx2.lineWidth = isHyper() ? 1.25 : 1;
            ctx2.beginPath();
            ctx2.moveTo(a.x, a.y);
            ctx2.lineTo(b.x, b.y);
            ctx2.stroke();
          }
        }
      }
      ctx2.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", resize); };
  }, [reduce]);

  if (reduce) return null;
  if (typeof document !== "undefined" && document.documentElement.dataset.hyper !== "1") return null;

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" aria-hidden />
  );
}


