"use client";

import { useCallback, useEffect, useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/hero/Hero";
import { SelectedWork } from "@/components/work/SelectedWork";
import { Experience } from "@/components/experience/Experience";
import { Education } from "@/components/education/Education";
import { Capabilities } from "@/components/skills/Capabilities";
import { Certifications } from "@/components/credentials/Certifications";
import { Contact } from "@/components/contact/Contact";
import { CommandPalette } from "@/components/command/CommandPalette";
import { AskJeethesh } from "@/components/chat/AskJeethesh";
import { useAmbientMusic } from "@/components/providers/AmbientMusicProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function PortfolioShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { chatOpen, setChatOpen } = useAmbientMusic();

  const openAsk = useCallback(() => setChatOpen(true), [setChatOpen]);

  useEffect(() => {
    return () => setChatOpen(false);
  }, [setChatOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SmoothScroll locked={paletteOpen}>
      <div className="noise" aria-hidden />
      <div className="dot-grid" aria-hidden />
      <Nav onOpenCommand={() => setPaletteOpen(true)} />
      <main className="relative z-10">
        <Hero onAsk={openAsk} />
        <Experience />
        <SelectedWork />
        <Education />
        <Capabilities />
        <Certifications />
        <AskJeethesh open={chatOpen} onOpenChange={setChatOpen} />
        <Contact />
      </main>
      <CommandPalette
        key={paletteOpen ? "open" : "closed"}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAsk={openAsk}
      />
    </SmoothScroll>
  );
}
