"use client";

import { Smartphone, Globe, AppWindow, Workflow, Sparkles, type LucideIcon } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";
import { motion } from "framer-motion";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native or cross-platform apps that feel right at home on Android and iOS — fast, offline-capable, and dependable in the field.",
  },
  {
    icon: Globe,
    title: "Web App Development",
    description:
      "Fast, secure web applications and APIs. Dashboards, portals, customer-facing platforms — built to scale with your workflow.",
  },
  {
    icon: AppWindow,
    title: "Desktop Software",
    description:
      "Polished macOS, Windows, and Linux applications for teams whose work deserves a better tool than a spreadsheet.",
  },
  {
    icon: Workflow,
    title: "Automation & Consulting",
    description:
      "I find where your process slows down and engineer it out. Workflow automation and software consulting that remove the repetitive work.",
  },
];

export function ServicesSection({ navigate }: SectionProps) {
  const services = SECTION_MAP.services;

  return (
    <SectionFrame section={services}>
      <div className="mb-12 max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
            Services
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            Software that does the heavy lifting
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
            From first concept to production, I build tools that feel cinematic
            and work flawlessly in the real world.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={0.1 + i * 0.07}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className="flex h-full flex-col rounded-[1.5rem] bg-white/80 p-7 ring-1 ring-black/5 backdrop-blur transition-shadow hover:shadow-[0_50px_100px_-70px_rgba(15,15,18,0.9)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-aurora-violet/15 via-aurora-cyan/15 to-aurora-amber/15 text-ink">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {service.description}
                </p>
              </motion.article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.25}>
        <div className="mt-12 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#15151d] to-ink px-8 py-12 text-white shadow-[0_60px_120px_-80px_rgba(15,15,18,1)] md:px-14">
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-violet/10 via-aurora-cyan/10 to-aurora-amber/10" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <Sparkles size={18} strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Ready to build
                </p>
              </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Every slow process can be rebuilt
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80 md:text-lg">
              Businesses don&apos;t need more software — they need the right
              software, built well. Let&apos;s find yours.
            </p>
            </div>
            <Button variant="light" onClick={() => navigate("contact")}>
              Start a Conversation
            </Button>
          </div>
        </div>
      </Reveal>
    </SectionFrame>
  );
}