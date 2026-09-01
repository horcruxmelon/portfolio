"use client";

import { useState } from "react";
import GlyphField from "./components/GlyphField";
import Hero from "./components/Hero";
import Dock, { DockItem } from "./components/Dock";
import SocialLinks from "./components/SocialLinks";
import ResumeModal from "./components/ResumeModal";
import ProjectsModal from "./components/ProjectsModal";

export default function Home() {
  const [open, setOpen] = useState<DockItem | null>(null);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <GlyphField />
      <Hero />
      <Dock onOpen={setOpen} />
      <SocialLinks />

      {open === "resume" && <ResumeModal onClose={() => setOpen(null)} />}
      {open === "projects" && <ProjectsModal onClose={() => setOpen(null)} />}
    </div>
  );
}
