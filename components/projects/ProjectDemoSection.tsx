"use client";

/* ------------------------------------------------------------------
   ProjectDemoSection — the "Interactive preview" block on a project
   detail page.
   ------------------------------------------------------------------
   Left: a numbered feature list; the active feature drives the demo's
   tab, so clicking a feature switches what the app is showing.
   Right: the project's interactive demo (PhoneDemo) wrapped in the
   right device frame — phone bezel for field apps, laptop window for
   desktop apps, browser chrome for web apps. The phone column is
   sticky on desktop and full-width-ish on mobile.

   A one-time per-session intro popup (keyed per project slug in
   sessionStorage) invites the visitor to click around the live demo.
------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { X, Settings2 } from "lucide-react";
import type { DemoSlot, Project } from "@/lib/projects";
import { FeaturePictogram, ProjectPictogram } from "@/lib/projectIcons";
import { PhoneDemo } from "@/components/projects/PhoneDemo";
import { Button } from "@/components/ui/Button";

/* ------------------------------ Frames ------------------------------ */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[246px] sm:w-[266px]">
      <div className="rounded-[2.75rem] bg-[#101010] p-2 shadow-2xl ring-1 ring-black/10">
        <div className="relative overflow-hidden rounded-[2.25rem]">
          {/* Dynamic-Island-style notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-[#101010]" />
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[9px] font-semibold tracking-tight text-ink/70">
            <span>9:41</span>
            <span className="tracking-[0.15em]">●●●</span>
          </div>
          <div className="h-[500px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-t-xl border border-black/5 bg-[#161617] p-2 pb-0 shadow-2xl">
        <div className="flex items-center gap-1.5 px-1.5 pb-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="relative overflow-hidden rounded-t-lg bg-[#f4f4f6]">
          <div className="h-[400px]">{children}</div>
        </div>
      </div>
      {/* keyboard deck — slightly wider to fake perspective */}
      <div className="relative mx-auto h-3.5 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-[#2a2a2c] to-[#101012]" />
    </div>
  );
}

function BrowserFrame({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#f4f4f6] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <div className="mx-auto flex h-6 w-2/3 items-center justify-center rounded-md bg-white px-3 ring-1 ring-black/5">
          <span className="truncate text-[10px] font-medium text-ink-faint">
            app.{project.slug}.dev
          </span>
        </div>
        <div className="w-12" />
      </div>
      <div className="h-[430px]">{children}</div>
    </div>
  );
}

/* ------------------------------- Section ------------------------------ */

interface ProjectDemoSectionProps {
  project: Project;
}

export function ProjectDemoSection({ project }: ProjectDemoSectionProps) {
  const [slot, setSlot] = useState<DemoSlot>("jobs");
  const [showIntro, setShowIntro] = useState(false);

  const storageKey = `project-demo-intro-${project.slug}`;

  // Popup shows once per session. Deferred out of the effect body to
  // dodge react-hooks setState-in-effect (same pattern as the shell's
  // hash deep-linking).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setShowIntro(!sessionStorage.getItem(storageKey));
      } catch {
        setShowIntro(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [storageKey]);

  const dismissIntro = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* private mode — just hide for this visit */
    }
  };

  const frame =
    project.mockupKind === "phone" ? (
      <PhoneFrame>
        <PhoneDemo project={project} tab={slot} onTabChange={setSlot} />
      </PhoneFrame>
    ) : project.mockupKind === "laptop" ? (
      <LaptopFrame>
        <PhoneDemo project={project} tab={slot} onTabChange={setSlot} />
      </LaptopFrame>
    ) : (
      <BrowserFrame project={project}>
        <PhoneDemo project={project} tab={slot} onTabChange={setSlot} />
      </BrowserFrame>
    );

  return (
    <section
      id="demo"
      aria-label="Interactive preview"
      className="relative scroll-mt-10 border-t border-black/5 bg-[#fafafa]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Interactive preview
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Try {project.name} live.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-base">
            This is a real, tappable version of the app running on sample
            data — every interaction works. Pick a feature on the left and
            watch it play out on the device.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-12 md:grid-cols-[1fr_420px] md:gap-8">
          {/* Feature list + active feature copy */}
          <div className="order-2 md:order-1">
            <ul className="space-y-2">
              {project.demo.features.map((feature, i) => {
                const active = feature.id === slot;
                return (
                  <li key={feature.id}>
                    <button
                      type="button"
                      onClick={() => setSlot(feature.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 ease-apple ${
                        active
                          ? "bg-white shadow-sm ring-1 ring-black/10"
                          : "ring-1 ring-black/5 hover:bg-white/60 hover:ring-black/10"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          active ? "bg-ink text-white" : "bg-ink/5 text-ink"
                        }`}
                      >
                        <FeaturePictogram id={feature.id} size={18} strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-[10px] font-bold tabular-nums tracking-tight text-ink-faint">
                            0{i + 1}
                          </span>
                          <span className="text-[15px] font-semibold tracking-tight text-ink">
                            {feature.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
                          {feature.body}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Customizable value prop — everything is negotiable */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-ink/15 bg-ink/[0.03] p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <Settings2 size={12} strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-[13px] font-semibold tracking-tight text-ink">
                  Made to fit your way of working
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  {project.demo.customizable}
                </p>
              </div>
            </div>

            {/* Active feature hint */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-ink/15 p-4">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ink/40" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Try it:</span>{" "}
                {project.demo.tryIt}
              </p>
            </div>
          </div>

          {/* The live device */}
          <div className="relative order-1 md:order-2 md:sticky md:top-24 md:self-start">
            <div className="flex justify-center py-2 md:py-0">{frame}</div>
            <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Tap the screen to explore
            </p>

            {/* One-time intro popup */}
            {showIntro && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/70 p-6 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label={project.demo.popupTitle}
              >
                <div className="relative flex max-w-[280px] flex-col items-center rounded-3xl bg-white p-6 text-center shadow-2xl ring-1 ring-black/10">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={dismissIntro}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
                    <ProjectPictogram id={project.icon} size={20} strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink">
                    {project.demo.popupTitle}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                    {project.demo.popupBody}
                  </p>
                  <Button size="sm" className="mt-5" onClick={dismissIntro}>
                    {project.demo.popupCta}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}