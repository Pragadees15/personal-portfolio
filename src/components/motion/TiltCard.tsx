"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  maxTilt?: number;
};

export function TiltCard({ children, maxTilt = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [0.5, -0.5], [maxTilt, -maxTilt]), { stiffness: 150, damping: 20, mass: 0.3 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness: 150, damping: 20, mass: 0.3 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx as any, rotateY: ry as any, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}


