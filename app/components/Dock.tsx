"use client";

import DockIcon from "./DockIcon";

export type DockItem = "resume";

export default function Dock({ onOpen }: { onOpen: (item: DockItem) => void }) {
  return (
    <nav className="fixed left-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-8 sm:left-10">
      <button
        onClick={() => onOpen("resume")}
        className="group flex flex-col items-center gap-1.5 transition-transform duration-150 hover:-translate-y-1"
      >
        <DockIcon>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
            <path d="M14 3v4h4" strokeLinejoin="round" />
            <path d="M9 12h6M9 15.5h6M9 8.5h2" strokeLinecap="round" />
          </svg>
        </DockIcon>
        <span className="text-base font-medium text-white/70 transition-colors group-hover:text-white">
          Resume
        </span>
      </button>
    </nav>
  );
}
