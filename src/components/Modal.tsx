"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-[101] flex h-full w-full items-start justify-center p-1 sm:p-4 md:p-6 pt-16 sm:pt-24">
        <div 
          className={`relative w-full max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1400px] h-[calc(100dvh-4rem)] sm:h-[calc(100vh-6rem)] max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100vh-6rem)] overflow-hidden rounded-lg sm:rounded-2xl border border-zinc-200/70 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950 flex flex-col ${className || "overflow-auto p-3 sm:p-4"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && !className?.includes("p-0") && (
            <div className="mb-2 pr-8 text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;


