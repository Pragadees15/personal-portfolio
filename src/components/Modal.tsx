"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="site-container relative z-[81] mt-10 sm:mt-20">
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950">
          {title && <div className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;


