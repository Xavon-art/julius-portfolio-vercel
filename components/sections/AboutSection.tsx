"use client";

import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { DeveloperIllustration } from "@/components/mockups/DeveloperIllustration";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";
import { motion } from "framer-motion";

const STATS = [
  { value: "5+", label: "Years of Hands-On Development" },
  { value: "20+", label: "Production Systems Shipped" },
  { value: "Multiple", label: "Industries Served" },
];

export function AboutSection({ navigate }: SectionProps) {
  const about = SECTION_MAP.about;

  return (
    <SectionFrame section={about}>
      <div className="grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
              About
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
              The developer behind the software
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-soft md:text-lg">
              <p>
                I&apos;m Julius Matro — a full-time software developer based in the
                Philippines. I spend my days building production software across
                platforms for businesses that rely on it to run smoothly.
              </p>
              <p>
                I don&apos;t chase trends. I chase clarity. Native or cross-platform,
                I pick the tool that performs best for each job and craft it to
                be fast, reliable, and quietly delightful to use.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-8 border-t border-line pt-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative mx-auto max-w-sm rounded-[2rem] bg-white/70 p-8 shadow-[0_40px_90px_-60px_rgba(15,15,18,0.8)] ring-1 ring-black/5 backdrop-blur"
          >
            <DeveloperIllustration />
            <div className="mt-6 flex flex-col gap-2">
              <span className="text-sm font-medium tracking-tight text-ink">
                Precision, playfulness, purpose
              </span>
              <span className="text-sm text-ink-soft">
                Every detail is considered from first line of code to final pixel
              </span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </SectionFrame>
  );
}