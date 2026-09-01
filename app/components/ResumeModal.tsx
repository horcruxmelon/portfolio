"use client";

import Modal from "./Modal";

export default function ResumeModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Resume" onClose={onClose}>
      <div className="flex h-[75vh] max-h-[720px] w-full flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-sm font-medium text-white/80">Resume</span>
          <a
            href="/resume.pdf"
            download
            className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            Download
          </a>
        </div>
        <embed
          src="/resume.pdf"
          type="application/pdf"
          className="h-full w-full flex-1 bg-white"
        />
      </div>
    </Modal>
  );
}
