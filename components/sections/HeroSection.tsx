"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";

/* ------------------------------------------------------------------
   Hero — first view. Pure white surface, center-aligned, single focus.
------------------------------------------------------------------- */

export function HeroSection({ navigate, next }: SectionProps) {
  const home = SECTION_MAP.home;

  return (
    <SectionFrame section={home}>
      <div className="relative z-10 flex flex-col items-center text-center">
        <Reveal delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Julius Matro · Software Developer
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <h1 className="mt-7 max-w-5xl text-[clamp(2.9rem,8vw,6.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
            Software, engineered
            <br />
            for every platform.
          </h1>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            I&apos;m a full-time developer in the Philippines. I build fast,
            dependable software for Android, iOS, macOS, and the web — engineered
            to make work faster.
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
            <Button onClick={() => navigate("work")}>
              View My Work
              <ArrowRight size={17} strokeWidth={2} />
            </Button>
            <Button variant="ghost" onClick={() => navigate("contact")}>
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </div>

      {/* "scroll"/next-section cue — Apple-style downward chevron */}
      <button
        onClick={next}
        aria-label="Next section"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-ink-soft transition-colors hover:text-ink"
      >
        <span className="text-xs font-medium uppercase tracking-[0.25em]">
          Explore
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} strokeWidth={1.5} />
        </motion.span>
      </button>
    </SectionFrame>
  );
}