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
import { SECTION_MAP, type SectionProps } from "@/lib/sections";
import { PROJECTS, type Project } from "@/lib/projects";
import { motion } from "framer-motion";

function mockupFor(project: Project) {
  if (project.mockupKind === "phone") return PhoneMockup;
  if (project.mockupKind === "laptop") return LaptopMockup;
  return BrowserMockup;
}

export function WorkSection({ navigate }: SectionProps) {
  const work = SECTION_MAP.work;

  return (
    <SectionFrame section={work}>
      <div className="mb-12 max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
            Selected Work
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            Software, built to ship
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
            Each project tells a story — from field operations to client portals.
            Every detail designed for clarity and speed.
          </p>
        </Reveal>
      </div>

      <div className="space-y-8">
        {PROJECTS.map((project, i) => {
          const Mockup = mockupFor(project);
          const reversed = i % 2 === 1;
          const href = `/work/${project.slug}`;
          return (
            <Reveal key={project.slug} delay={0.08} y={40}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
              >
                <Link
                  href={href}
                  className={`group grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white/80 p-6 ring-1 ring-black/5 backdrop-blur transition-shadow hover:shadow-[0_60px_120px_-80px_rgba(15,15,18,0.95)] md:grid-cols-2 md:gap-10 md:p-12 ${
                    reversed ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="relative flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-white via-[#f7f8ff] to-[#f2f4ff] px-6 py-12"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-aurora-violet/5 via-aurora-cyan/5 to-aurora-amber/5" />
                    <div className="relative">
                      <Mockup />
                    </div>
                  </div>

                  <div>
                    <ul className="flex flex-wrap gap-2">
                      {project.platforms.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold tracking-tight text-ink-soft"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <h3 className="mt-6 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-lg">
                      {project.description}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-ink-soft">
                      View Project
                      <ArrowUpRight
                        size={18}
                        strokeWidth={2}
                        className="transition-transform duration-300 ease-apple group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </SectionFrame>
  );
}