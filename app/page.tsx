"use client";

import { useState } from "react";
import GlyphField from "./components/GlyphField";
import Hero from "./components/Hero";
import Dock, { DockItem } from "./components/Dock";
import SocialLinks from "./components/SocialLinks";
import ResumeModal from "./components/ResumeModal";
import ProjectsSection from "./components/ProjectsSection";
import ActivitiesSection from "./components/ActivitiesSection";

export default function Home() {
  const [open, setOpen] = useState<DockItem | null>(null);

  return (
    <div className="relative w-full bg-black">
      <section className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <GlyphField />
        <Hero />
      </section>

      <section className="sticky top-0 z-10 h-screen w-full overflow-hidden rounded-t-[2.5rem] bg-black shadow-[0_-24px_60px_rgba(0,0,0,0.6)]">
        <GlyphField />
        <ProjectsSection />
      </section>

      <section className="sticky top-0 z-20 h-screen w-full overflow-hidden rounded-t-[2.5rem] bg-black shadow-[0_-24px_60px_rgba(0,0,0,0.6)]">
        <GlyphField />
        <ActivitiesSection />
      </section>

      <Dock onOpen={setOpen} />
      <SocialLinks />

      {open === "resume" && <ResumeModal onClose={() => setOpen(null)} />}
    </div>
  );
}
