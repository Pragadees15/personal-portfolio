"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-[101] flex h-full w-full items-start justify-center p-1 sm:p-4 md:p-6 pt-16 sm:pt-24">
        <div
          className={cn(
            "relative w-full max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1400px]",
            "h-[calc(100dvh-4rem)] sm:h-[calc(100vh-6rem)]",
            "max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100vh-6rem)]",
            "overflow-hidden rounded-md border border-foreground/15 bg-background shadow-2xl flex flex-col animate-fade-in-up",
            className || "overflow-auto p-3 sm:p-4",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && !className?.includes("p-0") && (
            <div className="mb-2 pr-8 font-display italic text-xl text-foreground">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default Modal;
