"use client";

import { ConvergenceShader } from "@/components/sections/ConvergenceShader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import type { SectionProps } from "@/lib/sections";

/* ------------------------------------------------------------------
   WhyMeContent — the "Why work with me" block, now a continuation of
   the Home slide instead of a standalone section-as-page.
   ------------------------------------------------------------------
   FOUR truthful claims (approved copy):
     01 one developer, every platform
     02 right tool for the job
     03 full-time commitment
     04 business-first thinking

   Rendered behind the cards is the ConvergenceShader — several strands
   converging on a single hub ("many platforms, one solution") at quiet
   INTENSITY 0.5 so the text stays legible.

   STATS: confirmed real figures only (updated per Julius, 2026).
     5+  Years of Hands-On Development    — development/coding, NOT
          "professional experience"
     20+ Production Systems Shipped       — corrected from the draft 50+
     Multiple Industries Served           — qualitative by design,
                                            no invented number
------------------------------------------------------------------ */

const STATS = [
  { value: "5+", label: "Years of Hands-On Development" },
  { value: "20+", label: "Production Systems Shipped" },
  { value: "Multiple", label: "Industries Served" },
];

interface Capability {
  n: string;
  title: string;
  body: string;
}

const CAPABILITIES: Capability[] = [
  {
    n: "01",
    title: "Cross-platform range",
    body: "One developer, every platform: Android, iOS, macOS, and the web — so you don\u2019t need to hire separate teams for each.",
  },
  {
    n: "02",
    title: "Right tool for the job",
    body: "I choose the tech stack based on what actually performs best for your use case — native when native wins, cross-platform when speed-to-market matters more.",
  },
  {
    n: "03",
    title: "Full-time commitment",
    body: "This isn\u2019t a side gig: software development is my full-time profession, so response times and delivery stay reliable.",
  },
  {
    n: "04",
    title: "Business-first thinking",
    body: "Every project starts with one question: what\u2019s actually slowing your business down? The code follows the answer.",
  },
];

export function WhyMeContent({ navigate }: Pick<SectionProps, "navigate">) {
  return (
    <div className="relative">
      <ConvergenceShader />

      <div className="relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
              Why work with me
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              Capability across every platform.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
              Full-time developer in the Philippines. It&apos;s software built
              to make work faster — whatever platforms your business runs on.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.n} delay={0.12 + i * 0.07}>
              <article className="flex h-full flex-col rounded-3xl bg-white/70 p-7 ring-1 ring-black/5 backdrop-blur-sm transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-[0_32px_70px_-42px_rgba(0,0,0,0.35)]">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    {cap.title}
                  </h3>
                  <span className="text-sm font-bold tabular-nums tracking-tight text-ink/30">
                    {cap.n}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {cap.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <figure className="mt-6 overflow-hidden rounded-3xl ring-1 ring-black/5">
            <img
              src="/capabilities-workspace.jpg"
              alt="A clean, focused workspace"
              loading="lazy"
              className="h-44 w-full object-cover grayscale md:h-64"
            />
          </figure>
        </Reveal>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-w-[9rem] flex-col items-center rounded-2xl border-2 border-dashed border-ink/20 px-6 py-4 text-center"
                >
                  <span className="text-3xl font-bold tabular-nums tracking-tight text-ink/60">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate("work")}>See how I build it</Button>
              <Button variant="ghost" onClick={() => navigate("contact")}>
                Get in touch
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}