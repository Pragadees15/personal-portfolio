"use client";

import { useEffect, useRef } from "react";

export function HyperModeToggle() {
  const seqRef = useRef<string[]>([]);
  useEffect(() => {
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    function onKey(e: KeyboardEvent) {
      seqRef.current.push(e.key);
      if (seqRef.current.length > KONAMI.length) seqRef.current.shift();
      const match = KONAMI.every((k, i) => seqRef.current[i] === k);
      if (match) {
        const root = document.documentElement;
        const isOn = root.dataset.hyper === "1";
        root.dataset.hyper = isOn ? "0" : "1";
        seqRef.current = [];
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

export default HyperModeToggle;


