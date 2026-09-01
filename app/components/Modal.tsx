"use client";

import { useEffect } from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#161616] shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5f57] text-black shadow-lg transition-transform hover:scale-105"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
