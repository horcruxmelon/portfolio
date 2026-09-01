export default function SocialLinks() {
  return (
    <div className="fixed bottom-6 right-6 z-20 flex flex-row items-center gap-4 sm:bottom-8 sm:right-10">
      <a
        href="https://www.linkedin.com/in/hrishi-menon-m"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
      >
        in
      </a>
      <a
        href="https://github.com/horcruxmelon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
        </svg>
      </a>
      <a
        href="https://www.strava.com/athletes/173244651"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Strava"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066M13.828 0L7.28 13.828h3.065l3.483-6.869 3.483 6.869h3.065z" />
        </svg>
      </a>
    </div>
  );
}
