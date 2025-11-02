"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useCallback } from "react";

type Props = {
  children: React.ReactNode;
  strength?: number; // pixels of pull radius
};

export function Magnetic({ children, strength = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [strength, -strength], [4, -4]), { stiffness: 150, damping: 25, mass: 0.4 });
  const ry = useSpring(useTransform(mx, [-strength, strength], [-4, 4]), { stiffness: 150, damping: 25, mass: 0.4 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clampedX = Math.max(-strength, Math.min(strength, relX));
    const clampedY = Math.max(-strength, Math.min(strength, relY));
    mx.set(clampedX);
    my.set(clampedY);
  }, [mx, my, strength]);

  const onMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx as any, rotateY: ry as any, transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}


