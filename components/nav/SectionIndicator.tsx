"use client";

import { SECTIONS } from "@/lib/sections";

/* ------------------------------------------------------------------
   SectionIndicator — Apple-style vertical dot rail (desktop only).
   Hovering a dot reveals its label; the active dot stretches into a
   thin pill. Each dot is a real <button> for keyboard access.
------------------------------------------------------------------- */

interface SectionIndicatorProps {
  current: number;
  navigate: (index: number) => void;
}

export function SectionIndicator({ current, navigate }: SectionIndicatorProps) {
  return (
    <nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {SECTIONS.map((s, i) => {
        const active = i === current;
        return (
          <div key={s.id} className="group flex items-center">
            <span
              aria-hidden="true"
              className={`pointer-events-none mr-3 whitespace-nowrap text-xs font-medium tracking-tight text-ink transition-all duration-300 ${
                active
                  ? "opacity-100"
                  : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <button
              onClick={() => navigate(i)}
              aria-label={`Go to ${s.label}`}
              aria-current={active ? "true" : undefined}
              className={`block rounded-full transition-all duration-500 ease-apple focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:outline-none ${
                active
                  ? "h-2.5 w-7 bg-ink"
                  : "h-2 w-2 bg-ink/25 hover:bg-ink/60"
              }`}
            />
          </div>
        );
      })}
    </nav>
  );
}