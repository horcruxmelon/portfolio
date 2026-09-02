"use client";

import { useEffect, useRef, useState } from "react";

const EN_NAME = "Hrishi Menon M";
const ML_NAME = "ഋഷി മേനോൻ എം";
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01";
const FRAME_MS = 35;
const REVEAL_STEP = 2;

function toClusters(str: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(str), (s) => s.segment);
  }
  return Array.from(str);
}

const EN_CLUSTERS = toClusters(EN_NAME);
const ML_CLUSTERS = toClusters(ML_NAME);

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

type Cell = { text: string; locked: boolean };

function toCells(clusters: string[]): Cell[] {
  return clusters.map((c) => ({ text: c, locked: true }));
}

export default function Hero() {
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [cells, setCells] = useState<Cell[]>(toCells(EN_CLUSTERS));
  const runId = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  const revealTo = (
    target: string[],
    nextLang: "en" | "ml",
    frameMs: number = FRAME_MS,
    revealStep: number = REVEAL_STEP
  ) => {
    const id = ++runId.current;
    const totalFrames = target.length * revealStep + 6;
    let frame = 0;

    const tick = () => {
      if (id !== runId.current) return;
      const next: Cell[] = target.map((cluster, i) => {
        if (cluster === " ") return { text: " ", locked: true };
        const lockFrame = i * revealStep + 4;
        const locked = frame >= lockFrame;
        return { text: locked ? cluster : randomChar(), locked };
      });
      setCells(next);

      frame++;
      if (frame <= totalFrames) {
        timeoutRef.current = window.setTimeout(tick, frameMs);
      } else {
        setLang(nextLang);
      }
    };
    tick();
  };

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      revealTo(EN_CLUSTERS, "en", 75, 3);
    }, 500);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const scramble = () => {
    const nextLang = lang === "en" ? "ml" : "en";
    const target = nextLang === "ml" ? ML_CLUSTERS : EN_CLUSTERS;
    revealTo(target, nextLang);
  };

  return (
    <main className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div
        onMouseEnter={scramble}
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-0.5 gap-y-1 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl"
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            className="inline-block whitespace-pre"
            style={{ color: cell.locked ? undefined : "#a855f7" }}
          >
            {cell.text}
          </span>
        ))}
      </div>
      <p className="text-lg font-medium tracking-wide text-white/80 sm:text-xl">
        i like coding
      </p>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-bounce"
        >
          <path d="M12 4v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </main>
  );
}
