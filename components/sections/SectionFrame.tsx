"use client";

import type { ReactNode } from "react";
import type { SectionDef } from "@/lib/sections";

/* ------------------------------------------------------------------
   SectionFrame — the layout shell every section renders inside.
   ------------------------------------------------------------------
   - Absolutely fills the viewport (sections stack for the crossfade).
   - Scrolls internally when its content is taller than the screen
     (`data-scrollable` lets useSectionNavigation defer the wheel).
   - Carries the section's flat surface tone (white / paper) so each
     view is a clean, opaque panel with no animated backdrop.

   The transition wrapper in app/page.tsx animates the <section>
   element itself; this frame handles per-section layout + surface.
------------------------------------------------------------------- */

interface SectionFrameProps {
  section: SectionDef;
  children: ReactNode;
}

export function SectionFrame({ section, children }: SectionFrameProps) {
  return (
    <section
      id={section.id}
      role="region"
      aria-label={section.label}
      tabIndex={-1}
      data-scrollable
      className={`absolute inset-0 z-10 overflow-y-auto overscroll-contain outline-none ${
        section.tone === "white" ? "bg-white" : "bg-paper"
      }`}
    >
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-6 pb-24 pt-28 md:px-10">
        {children}
      </div>
    </section>
  );
}