"use client";

import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { DeveloperIllustration } from "@/components/mockups/DeveloperIllustration";
import { SECTION_MAP } from "@/lib/sections";

/* ------------------------------------------------------------------
   About — short confident bio + a stats row styled like Apple's spec
   comparison rows, paired with a monochrome desk illustration.
------------------------------------------------------------------- */

// PLACEHOLDER: replace each "[X]" only with numbers Julius confirms.
// (The old "5+ / 4 / 20+" looked like real claims — placed here so any
// real figure must be verified first, not guessed.)
const STATS = [
  { value: "[X]", label: "Years of professional development" },
  { value: "[X]", label: "Platforms shipped" },
  { value: "[X]", label: "Projects delivered" },
];

export function AboutSection() {
  const about = SECTION_MAP.about;

  return (
    <SectionFrame section={about}>
      <div className="grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
              About
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              The developer behind the software.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-ink-soft md:text-lg">
              <p>
                I&apos;m Julius Matro — a full-time software developer based in
                the Philippines. I&apos;ve spent years building production
                software across platforms, for businesses that depend on it
                staying up.
              </p>
              <p>
                I don&apos;t reach for a favorite framework and defend it. Native
                or cross-platform, I pick the tool that performs best for each
                job — then build it to be fast, reliable, and easy to live
                with.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            {/* Stats row — Apple spec-row styling */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 text-4xl font-semibold tracking-tight text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          {/* PLACEHOLDER: swap for a real portrait/photo (grayscale it) */}
          <div className="mx-auto max-w-sm rounded-3xl bg-white/70 p-6 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.4)] ring-1 ring-black/5 backdrop-blur-sm">
            <DeveloperIllustration />
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );
}