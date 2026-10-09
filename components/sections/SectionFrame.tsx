"use client";

import type { ReactNode } from "react";
import type { SectionDef } from "@/lib/sections";
import { useReducedMotion, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionFrameProps {
  section: SectionDef;
  children: ReactNode;
  fullHeight?: boolean;
}

export function SectionFrame({ section, children, fullHeight = false }: SectionFrameProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section
      id={section.id}
      ref={ref}
      role="region"
      aria-label={section.label}
      className={`${fullHeight ? "min-h-screen" : "min-h-[90vh]"} relative flex items-center py-24`}
    >
      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 md:px-10"
      >
        {children}
      </motion.div>
    </section>
  );
}