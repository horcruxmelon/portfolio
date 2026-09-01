export default function DockIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#a855f7]/40 bg-[#a855f7]/10 text-[#c084fc] shadow-[0_0_18px_rgba(168,85,247,0.35)] backdrop-blur-sm transition-all group-hover:border-[#a855f7]/80 group-hover:bg-[#a855f7]/20 group-hover:text-white group-hover:shadow-[0_0_28px_rgba(168,85,247,0.6)]"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
