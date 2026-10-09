"use client";

import { Smartphone, Monitor, Globe, Cpu, Sparkles, type LucideIcon } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";
import { motion } from "framer-motion";

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

export function SkillsSection({ navigate }: SectionProps) {
  const skills = SECTION_MAP.skills;

  return (
    <SectionFrame section={skills}>
      <div className="mb-12 max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
            Skills
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            One standard, across every stack
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
            From low-level native code to immersive web experiences, I keep the
            same bar: clarity, performance, and craftsmanship.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => {
          const Icon = group.icon;
          return (
            <Reveal key={group.title} delay={0.1 + i * 0.08}>
              <motion.article
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="group h-full rounded-[1.5rem] bg-white/75 p-8 ring-1 ring-black/5 backdrop-blur transition-shadow hover:shadow-[0_50px_100px_-70px_rgba(15,15,18,0.9)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-aurora-violet/20 via-aurora-cyan/15 to-aurora-amber/15 text-ink">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                  {group.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
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
              </motion.article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.25}>
        <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm text-ink-soft ring-1 ring-black/5 backdrop-blur">
          <Sparkles size={16} strokeWidth={1.5} />
          Always choosing the right tool for the story
        </div>
      </Reveal>
    </SectionFrame>
  );
}