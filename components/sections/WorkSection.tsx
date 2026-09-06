"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import {
  PhoneMockup,
  LaptopMockup,
  BrowserMockup,
} from "@/components/mockups/DeviceMockups";
import { SECTION_MAP } from "@/lib/sections";
import { PROJECTS, type Project } from "@/lib/projects";

/* ------------------------------------------------------------------
   Work — Apple-style alternating product showcase cards.
   ------------------------------------------------------------------
   Each card: large device mockup + title + one-liner + platform tags
   + "View Project". Layouts alternate left/right like Apple product
   pages. Everything is data-driven from lib/projects.ts — each card
   links through to its live detail page at /work/[slug].

   The mockups are CSS-built stand-ins for real app screenshots (see
   DeviceMockups); the detail page now serves the real interactive
   preview.
------------------------------------------------------------------- */

function mockupFor(project: Project) {
  if (project.mockupKind === "phone") return PhoneMockup;
  if (project.mockupKind === "laptop") return LaptopMockup;
  return BrowserMockup;
}

export function WorkSection() {
  const work = SECTION_MAP.work;

  return (
    <SectionFrame section={work}>
      <div className="mb-12 max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Selected Work
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Software, built to ship.
          </h2>
        </Reveal>
      </div>

      <div className="space-y-8">
        {PROJECTS.map((project, i) => {
          const Mockup = mockupFor(project);
          const reversed = i % 2 === 1;
          const href = `/work/${project.slug}`;
          return (
            <Reveal key={project.slug} delay={0.08} y={34}>
              <Link
                href={href}
                className={`group grid items-center gap-8 overflow-hidden rounded-3xl bg-white/60 p-6 ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 ease-apple hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] md:grid-cols-2 md:gap-6 md:p-10 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Visual */}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center rounded-2xl bg-gradient-to-b from-white via-[#f2f2f4] to-[#e7e7ea] px-6 py-10 transition-transform duration-500 ease-apple group-hover:scale-[1.01]"
                >
                  <Mockup />
                </div>

                {/* Copy */}
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {project.platforms.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold tracking-tight text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base">
                    {project.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-ink-soft">
                    View Project
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform duration-300 ease-apple group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </SectionFrame>
  );
}