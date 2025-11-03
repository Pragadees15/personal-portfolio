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

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-[81] flex h-full w-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-[min(92vw,1100px)] max-h-[min(92vh,1000px)] overflow-auto rounded-2xl border border-zinc-200/70 bg-white p-3 sm:p-4 shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950">
          {title && <div className="mb-2 pr-8 text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</div>}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;


