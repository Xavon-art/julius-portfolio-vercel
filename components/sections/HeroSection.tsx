"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";

export function HeroSection({ navigate, next }: SectionProps) {
  const home = SECTION_MAP.home;
  const reduce = useReducedMotion();

  return (
    <SectionFrame section={home} fullHeight>
      <div className="flex flex-col items-start text-left">
        <Reveal delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
            Julius Matro · Software Developer
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <h1 className="mt-8 max-w-5xl text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink">
            Software, engineered
            <br />
            for every platform
          </h1>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Full-time developer in the Philippines. I craft immersive digital
            products — native apps, cross-platform tools, and web experiences
            that feel cinematic without losing their speed.
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button onClick={() => navigate("work")}>
              View My Work
              <ArrowRight size={17} strokeWidth={2} />
            </Button>
            <Button variant="ghost" onClick={() => navigate("contact")}>
              Get in Touch
            </Button>
          </div>
        </Reveal>

        <button
          onClick={next}
          aria-label="Next section"
          className="mt-16 flex flex-col items-center gap-2 text-ink-soft transition-colors hover:text-ink"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em]">
            Scroll
          </span>
          <motion.span
            animate={reduce ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} strokeWidth={1.5} />
          </motion.span>
        </button>
      </div>
    </SectionFrame>
  );
}