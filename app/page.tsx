"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { ComponentType } from "react";
import { SECTIONS, type SectionId, type SectionProps } from "@/lib/sections";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import { Navbar } from "@/components/nav/Navbar";
import { SectionIndicator } from "@/components/nav/SectionIndicator";
import { HeroSection } from "@/components/sections/HeroSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";

/* ==================================================================
   PortfolioShell — the "section-as-page" transition engine.
   ==================================================================
   HOW NAVIGATION WORKS
   This is a single route, but it is NOT a scrolling page. The App
   Router serves one viewport; useSectionNavigation holds the active
   section index, and AnimatePresence crossfades between sections:

     - Every section is absolutely positioned (inset-0), so during a
       transition the outgoing and incoming sections overlap in place.
     - The section-level motion.div applies a 550ms crossfade with a
       slight scale + vertical shift (Apple-ease curve).
       Outgoing: opacity → 0, scale → 1.012, y → −16
       Incoming: opacity → 1, scale 0.985 → 1, y 16 → 0

   Sections are opaque flat surfaces now (white for home, paper for the
   rest — see lib/sections.ts), so the crossfade cleanly blends one
   solid panel into the next; there is no animated background layer.

   The section registry (lib/sections.ts) is the single source of
   truth for ids, labels, titles, and surface tones.
=================================================================== */

const SECTION_COMPONENTS: Record<SectionId, ComponentType<SectionProps>> = {
  home: HeroSection,
  capabilities: CapabilitiesSection,
  about: AboutSection,
  skills: SkillsSection,
  work: WorkSection,
  services: ServicesSection,
  contact: ContactSection,
};

export default function Page() {
  const { index, goTo, goToId, next, prev } = useSectionNavigation();
  const active = SECTIONS[index];
  const ActiveSection = SECTION_COMPONENTS[active.id];

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 overflow-hidden bg-white text-ink">
        <Navbar activeId={active.id} navigate={goToId} />

        <main className="relative z-10 h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.012, y: -18, pointerEvents: "none" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActiveSection navigate={goToId} next={next} prev={prev} />
            </motion.div>
          </AnimatePresence>
        </main>

        <SectionIndicator current={index} navigate={goTo} />

        {/* Thin Apple-style progress line at the bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 z-40 h-[3px] bg-ink"
          style={{
            width: `${((index + 1) / SECTIONS.length) * 100}%`,
            transition: "width 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Screen-reader announcement on navigation */}
        <p className="sr-only" role="status" aria-live="polite">
          Now showing: {active.label}
        </p>
      </div>
    </MotionConfig>
  );
}