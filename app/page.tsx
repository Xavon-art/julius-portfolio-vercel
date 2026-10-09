"use client";

import { ScrollDrivenLayout } from "@/components/layout/ScrollDrivenLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { useReducedMotion } from "framer-motion";
import type { SectionId } from "@/lib/sections";

export default function Page() {
  const reduce = useReducedMotion();

  const go = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <ScrollDrivenLayout>
      <div className="flex flex-col">
        <HeroSection navigate={go} next={() => go("about")} prev={() => {}} />
        <AboutSection navigate={go} next={() => go("skills")} prev={() => go("home")} />
        <SkillsSection navigate={go} next={() => go("work")} prev={() => go("about")} />
        <WorkSection navigate={go} next={() => go("services")} prev={() => go("skills")} />
        <ServicesSection navigate={go} next={() => go("contact")} prev={() => go("work")} />
        <ContactSection navigate={go} next={() => {}} prev={() => go("services")} />
      </div>
    </ScrollDrivenLayout>
  );
}