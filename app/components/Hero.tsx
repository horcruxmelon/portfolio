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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const scramble = () => {
    const id = ++runId.current;
    const nextLang = lang === "en" ? "ml" : "en";
    const target = nextLang === "ml" ? ML_CLUSTERS : EN_CLUSTERS;
    const totalFrames = target.length * REVEAL_STEP + 6;
    let frame = 0;

    const tick = () => {
      if (id !== runId.current) return;
      const next: Cell[] = target.map((cluster, i) => {
        if (cluster === " ") return { text: " ", locked: true };
        const lockFrame = i * REVEAL_STEP + 4;
        const locked = frame >= lockFrame;
        return { text: locked ? cluster : randomChar(), locked };
      });
      setCells(next);

      frame++;
      if (frame <= totalFrames) {
        timeoutRef.current = window.setTimeout(tick, FRAME_MS);
      } else {
        setLang(nextLang);
      }
    };
    tick();
  };

  return (
    <main className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
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
    </main>
  );
}
