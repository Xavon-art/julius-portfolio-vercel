"use client";

/* ------------------------------------------------------------------
   ProjectDetailPage — the reusable template for /work/[slug].
   ------------------------------------------------------------------
   Renders one project from lib/projects.ts:

     - Fixed "All projects" pill (top-left) that returns to /#work.
     - Hero: WebGL shader backdrop (route / grid, lazy-loaded), app
       icon chip, platform pills, headline, Apple-style copy, and the
       two CTAs (Explore the demo + Purchase on WhatsApp).
     - Interactive preview section (ProjectDemoSection).
     - Closing statement + CTA, and a sticky purchase bar that stays
       pinned to the bottom of the viewport while scrolling.

   The reviewer page is a real scrolling page (the shell's sections are
   viewport-fixed), so on mount this restores body/html overflow to
   auto and restores it on unmount.
------------------------------------------------------------------- */

import { useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Project } from "@/lib/projects";
import { whatsappUrl } from "@/lib/projects";
import { ProjectPictogram } from "@/lib/projectIcons";
import { ProjectDemoSection } from "@/components/projects/ProjectDemoSection";
import { Button } from "@/components/ui/Button";

const ProjectShader = dynamic(
  () =>
    import("@/components/projects/ProjectShader").then((m) => ({
      default: m.ProjectShader,
    })),
  { ssr: false },
);

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectDetailPageProps {
  project: Project;
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  // The portfolio shell locks body overflow; a detail page is a normal
  // scrolling document, so hand scrolling back to the page on mount and
  // restore the shell's locked state on unmount.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      html: html.style.overflow,
      body: body.style.overflow,
    };
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
    };
  }, []);

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  const purchaseHref = whatsappUrl(project);

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Back to the Work grid */}
      <Link
        href="/#work"
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold tracking-tight text-ink shadow-sm ring-1 ring-black/10 backdrop-blur transition-all duration-300 ease-apple hover:scale-[1.03] hover:bg-white"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        All projects
      </Link>

      {/* ------------------------------ Hero ---------------------------- */}
      <header className="relative flex min-h-screen items-center overflow-hidden">
        <ProjectShader theme={project.shaderTheme} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 pb-32 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="flex items-center gap-4">
              <span
                aria-label={project.iconLabel}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-ink shadow-sm ring-1 ring-black/10"
              >
                <ProjectPictogram id={project.icon} size={26} strokeWidth={2} />
              </span>
              <ul className="flex flex-wrap gap-2">
                {project.platforms.map((platform) => (
                  <li
                    key={platform}
                    className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-tight text-ink-soft ring-1 ring-black/5"
                  >
                    {platform}
                  </li>
                ))}
              </ul>
            </div>

            <h1 className="mt-8 text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink">
              {project.name}
            </h1>
            <p className="mt-5 text-xl font-medium tracking-tight text-ink-soft md:text-2xl">
              {project.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
              {project.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button onClick={scrollToDemo}>Explore the demo</Button>
              <a
                href={purchaseHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-[15px] font-medium tracking-tight text-ink transition-all duration-300 ease-apple hover:scale-[1.03] hover:border-ink/50 hover:bg-white/60 active:scale-[0.98]"
              >
                <MessageCircle size={16} />
                Purchase on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ------------------------ Interactive demo ---------------------- */}
      <ProjectDemoSection project={project} />

      {/* --------------------------- Closing ---------------------------- */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <p className="text-2xl font-semibold leading-snug tracking-tight text-ink md:text-4xl">
            Ready to make {project.name} yours?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-base">
            Explore the demo above, or reach out directly — a custom build
            starts with a conversation, not a contract.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={purchaseHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium tracking-tight text-white transition-all duration-300 ease-apple hover:scale-[1.03] hover:bg-black active:scale-[0.98]"
            >
              <MessageCircle size={16} />
              Purchase on WhatsApp
            </a>
            <Link
              href="/#work"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-7 py-3.5 text-[15px] font-medium tracking-tight text-ink transition-all duration-300 ease-apple hover:scale-[1.03] hover:border-ink/50 hover:bg-white/60 active:scale-[0.98]"
            >
              <ArrowLeft size={16} strokeWidth={2.25} />
              View all projects
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ Sticky purchase bar ------------------- */}
      <div className="sticky bottom-0 z-30 border-t border-black/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight text-ink">
              {project.name}
            </p>
            <p className="hidden truncate text-xs text-ink-faint sm:block">
              {project.tagline}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Button variant="ghost" size="sm" onClick={scrollToDemo}>
              Explore
            </Button>
            <a
              href={purchaseHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-medium tracking-tight text-white transition-all duration-300 ease-apple hover:scale-[1.03] hover:bg-black active:scale-[0.98]"
            >
              <MessageCircle size={14} />
              Purchase
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}