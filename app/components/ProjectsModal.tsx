"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { fetchProjects, type Project } from "../data/projects";

const GITHUB_PATH =
  "M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z";

function wrap(i: number, n: number) {
  return ((i % n) + n) % n;
}

function ProjectCard({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}>
      {!imgError && (
        <Image
          src={project.thumbnail}
          alt=""
          fill
          sizes="(max-width: 640px) 90vw, 384px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on GitHub`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d={GITHUB_PATH} />
          </svg>
        </a>
        <div>
          <h3 className="text-xl font-bold text-white drop-shadow">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (delta: number) =>
    setIndex((prev) => (projects ? wrap(prev + delta, projects.length) : prev));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const onPointerDown = (e: React.PointerEvent) => setDragX(e.clientX);
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragX === null) return;
    setDragDelta(e.clientX - dragX);
  };
  const onPointerUp = () => {
    if (dragDelta > 50) go(-1);
    else if (dragDelta < -50) go(1);
    setDragX(null);
    setDragDelta(0);
  };

  if (!projects) {
    return (
      <Modal title="Projects" onClose={onClose}>
        <div className="flex h-72 items-center justify-center p-6 text-center text-sm text-white/60">
          {error
            ? "Couldn't load projects from GitHub right now."
            : "Loading projects from GitHub…"}
        </div>
      </Modal>
    );
  }

  if (projects.length === 0) {
    return (
      <Modal title="Projects" onClose={onClose}>
        <div className="flex h-72 items-center justify-center p-6 text-center text-sm text-white/60">
          No public repos to show yet.
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Projects" onClose={onClose}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Projects
          </h2>
          <span className="font-mono text-xs text-white/40">
            {index + 1} / {projects.length}
          </span>
        </div>

        <div
          className="relative h-72 touch-pan-y select-none overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {projects.map((project, i) => {
            let offset = i - index;
            if (offset > projects.length / 2) offset -= projects.length;
            if (offset < -projects.length / 2) offset += projects.length;
            if (Math.abs(offset) > 1) return null;

            const isActive = offset === 0;
            const dragPx = dragX !== null ? dragDelta * (isActive ? 1 : 0.3) : 0;

            return (
              <div
                key={project.title}
                className={`absolute inset-y-0 inset-x-4 overflow-hidden rounded-2xl shadow-xl ${
                  dragX === null ? "transition-transform duration-300 ease-out" : ""
                }`}
                style={{
                  transform: `translateX(calc(${offset * 84}% + ${dragPx}px)) scale(${
                    isActive ? 1 : 0.85
                  })`,
                  zIndex: isActive ? 10 : 5,
                  opacity: isActive ? 1 : 0.4,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <ProjectCard project={project} />
              </div>
            );
          })}

          <button
            aria-label="Previous project"
            onClick={() => go(-1)}
            className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
          >
            ‹
          </button>
          <button
            aria-label="Next project"
            onClick={() => go(1)}
            className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
          >
            ›
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {projects.map((project, i) => (
            <button
              key={project.title}
              aria-label={`Go to ${project.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
