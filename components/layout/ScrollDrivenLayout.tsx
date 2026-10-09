"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useMotionValueEvent, motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/nav/Navbar";
import { AuroraBackground } from "@/components/3d/AuroraBackground";
import { SECTION_MAP, SECTIONS, type SectionId } from "@/lib/sections";

interface ScrollDrivenLayoutProps {
  children: ReactNode;
}

export function ScrollDrivenLayout({ children }: ScrollDrivenLayoutProps) {
  const [activeId, setActiveId] = useState<SectionId>("home");
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
    if (reduce) {
      setActiveId("home");
      return;
    }
    if (latest < 0.1) {
      setActiveId("home");
    } else if (latest < 0.3) {
      setActiveId("about");
    } else if (latest < 0.5) {
      setActiveId("skills");
    } else if (latest < 0.7) {
      setActiveId("work");
    } else if (latest < 0.9) {
      setActiveId("services");
    } else {
      setActiveId("contact");
    }
  });

  const goToId = (id: SectionId) => {
    const sectionDef = SECTION_MAP[id];
    if (!sectionDef) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
  };

  useEffect(() => {
    const section = SECTIONS.find((s) => s.id === activeId);
    if (!section) return;
    document.title = section.title;
    const hash = section.id === "home" ? "/" : `#${section.id}`;
    history.replaceState(null, "", hash);
  }, [activeId]);

  return (
    <div ref={ref} className="relative min-h-[1000svh]">
      <AuroraBackground scrollProgress={progress} />
      <Navbar activeId={activeId} navigate={goToId} />
      <main className="relative z-10">{children}</main>
    </div>
  );
}