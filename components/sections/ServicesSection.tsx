"use client";

import { Smartphone, Globe, AppWindow, Workflow, type LucideIcon } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";

/* ------------------------------------------------------------------
   Services — icon-led cards (no photos, purely iconographic). Each
   entry is pitched around speed, reliability, and picking the right
   tool for the job. Closes with a dark CTA strip.
------------------------------------------------------------------- */

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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Services
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Software that does the heavy lifting.
          </h2>
        </Reveal>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={0.1 + i * 0.07}>
              <article className="flex h-full flex-col rounded-2xl bg-white/70 p-7 ring-1 ring-black/5 transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-[0_32px_70px_-42px_rgba(0,0,0,0.35)]">
                <Icon size={24} strokeWidth={1.5} className="text-ink" />
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {service.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.25}>
        {/* Closing strip — simple, confident, no buzzwords */}
        <div className="mt-12 flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink px-8 py-10 text-white md:flex-row md:items-center md:px-12">
          <div className="max-w-xl">
            <p className="text-2xl font-semibold tracking-tight md:text-3xl">
              Every slow process can be rebuilt.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Businesses don&apos;t need more software — they need the right
              software, built well. Let&apos;s find yours.
            </p>
          </div>
          <Button variant="light" onClick={() => navigate("contact")}>
            Start a Conversation
          </Button>
        </div>
      </Reveal>
    </SectionFrame>
  );
}