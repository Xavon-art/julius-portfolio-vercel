"use client";

import { Smartphone, Monitor, Globe, Cpu, type LucideIcon } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_MAP } from "@/lib/sections";

/* ------------------------------------------------------------------
   Skills — Apple "feature tile" grid. Four categories, each a minimal
   card: icon + name + description + a few technology chips. Quality
   over quantity.
------------------------------------------------------------------- */

// PLACEHOLDER: adjust the technology list to Julius' actual stack.
interface SkillGroup {
  icon: LucideIcon;
  title: string;
  blurb: string;
  chips: string[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    icon: Smartphone,
    title: "Mobile",
    blurb: "Native and cross-platform apps for Android & iOS.",
    chips: ["Swift", "Kotlin", "Java", "Flutter", "React Native"],
  },
  {
    icon: Monitor,
    title: "Desktop",
    blurb: "Polished, responsive apps for macOS, Windows & Linux.",
    chips: ["C#", "C++", "Swift", ".NET", "Electron"],
  },
  {
    icon: Globe,
    title: "Web",
    blurb: "Frontends that feel effortless and backends that stay up.",
    chips: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    icon: Cpu,
    title: "Tools & Infra",
    blurb: "Automation, delivery pipelines, and cloud operations.",
    chips: ["Docker", "Git", "GitHub Actions", "AWS", "Firebase"],
  },
];

export function SkillsSection() {
  const skills = SECTION_MAP.skills;

  return (
    <SectionFrame section={skills}>
      <div className="mb-12 max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Skills
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            One standard, across every stack.
          </h2>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => {
          const Icon = group.icon;
          return (
            <Reveal key={group.title} delay={0.1 + i * 0.08}>
              <article className="group h-full rounded-2xl bg-white/70 p-8 ring-1 ring-black/5 transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-[0_32px_70px_-40px_rgba(0,0,0,0.35)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                  {group.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {group.blurb}
                </p>
                <ul
                  aria-label={`${group.title} technologies`}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {group.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-ink/80"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionFrame>
  );
}