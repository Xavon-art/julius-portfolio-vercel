"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import {
  PhoneMockup,
  LaptopMockup,
  BrowserMockup,
} from "@/components/mockups/DeviceMockups";
import { SECTION_MAP } from "@/lib/sections";

/* ------------------------------------------------------------------
   Work — Apple-style alternating product showcase cards.
   ------------------------------------------------------------------
   Each card: large device mockup + title + one-liner + platform tags
   + "View Project". Layouts alternate left/right like Apple product
   pages.

   PLACEHOLDER PROJECTS: titles, descriptions, and URLs below are
   placeholders — swap in Julius' real case studies. The mockups are
   CSS-built stand-ins for real app screenshots (see DeviceMockups).
------------------------------------------------------------------- */

// PLACEHOLDER: replace the three projects below with real work.
const PROJECTS = [
  {
    title: "Field Ops Suite",
    description:
      "A cross-platform app that keeps field teams coordinated in real time — jobs, routes, and reporting in one place.",
    tags: ["Android", "iOS"],
    url: "#",
    Mockup: PhoneMockup,
  },
  {
    title: "Inventory Manager",
    description:
      "Desktop software that turns inventory tracking from a daily chore into a live dashboard — built for macOS and Windows.",
    tags: ["macOS", "Windows"],
    url: "#",
    Mockup: LaptopMockup,
  },
  {
    title: "Client Portal",
    description:
      "A secure web platform where clients track projects, files, and invoices in a single clean view.",
    tags: ["Web"],
    url: "#",
    Mockup: BrowserMockup,
  },
];

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
          const { Mockup } = project;
          const reversed = i % 2 === 1;
          return (
            <Reveal key={project.title} delay={0.08} y={34}>
              <article className="grid items-center gap-8 overflow-hidden rounded-3xl bg-white/60 p-6 ring-1 ring-black/5 backdrop-blur-sm md:grid-cols-2 md:gap-6 md:p-10">
                {/* Visual */}
                <div
                  aria-hidden="true"
                  className={`flex items-center justify-center rounded-2xl bg-gradient-to-b from-white via-[#f2f2f4] to-[#e7e7ea] px-6 py-10 ${
                    reversed ? "md:order-2" : ""
                  }`}
                >
                  <Mockup />
                </div>

                {/* Copy */}
                <div className={reversed ? "md:order-1" : ""}>
                  <ul className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold tracking-tight text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base">
                    {project.description}
                  </p>
                  <a
                    href={project.url}
                    onClick={(e) => e.preventDefault()} // PLACEHOLDER: link to the live project
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-ink transition-colors hover:text-ink-soft"
                  >
                    View Project
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionFrame>
  );
}