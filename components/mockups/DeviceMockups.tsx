"use client";

/* ------------------------------------------------------------------
   DeviceMockups — CSS-built phone / laptop / browser "screens" filled
   with abstract monochrome UI skeletons.
   ------------------------------------------------------------------
   PLACEHOLDER VISUALS: these represent where a real app screenshot
   will go. When Julius has real product shots, replace the body of
   PhoneMockup / LaptopMockup / BrowserMockup (or swap each card's
   <mockup> for an <img srcset=…> with `filter: grayscale(100%)` to
   preserve the monochrome look).

   Keeping them as code means the site never ships broken image URLs
   and every placeholder stays on-theme (pure black/white/gray).
------------------------------------------------------------------- */

function SkeletonBar({ className }: { className?: string }) {
  return <div className={`rounded-full bg-ink/15 ${className ?? ""}`} />;
}

/* ------------------------------- Phone ------------------------------- */
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[230px] sm:w-[250px]">
      {/* device bezel */}
      <div className="rounded-[2.75rem] bg-[#101010] p-2 shadow-2xl ring-1 ring-black/10">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#f4f4f6]">
          {/* Dynamic-Island-style notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-[#101010]" />
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[9px] font-semibold tracking-tight text-ink/70">
            <span>9:41</span>
            <span className="tracking-[0.15em]">●●●</span>
          </div>
          {/* app header */}
          <div className="flex items-center justify-between px-5 pt-2">
            <SkeletonBar className="h-3 w-20" />
            <div className="flex gap-1.5">
              <div className="h-5 w-5 rounded-full bg-ink/10" />
              <div className="h-5 w-5 rounded-full bg-ink/10" />
            </div>
          </div>
          {/* KPI card */}
          <div className="mx-5 mt-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <SkeletonBar className="h-2 w-14" />
            <div className="mt-2 flex items-baseline gap-2">
              <div className="h-8 w-16 rounded-lg bg-ink/5" />
              <SkeletonBar className="h-2.5 w-10" />
            </div>
          </div>
          {/* list rows */}
          <div className="space-y-2.5 px-5 pb-6 pt-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-3.5 ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between">
                  <SkeletonBar className="h-2.5 w-24" />
                  <SkeletonBar className="h-4 w-8" />
                </div>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-black/70"
                    style={{ width: `${35 + i * 27}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Laptop ------------------------------ */
export function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* display */}
      <div className="rounded-t-xl border border-black/5 bg-[#161617] p-2 pb-0 shadow-2xl">
        <div className="relative overflow-hidden rounded-t-lg bg-[#f4f4f6]">
          {/* in-app: sidebar + main */}
          <div className="flex h-[200px]">
            <div className="w-16 shrink-0 space-y-3 bg-white/70 px-3 pt-6">
              {[12, 16, 14, 14, 12].map((w, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded-full bg-ink/15"
                  style={{ width: `${w * 3}px` }}
                />
              ))}
            </div>
            <div className="flex-1 space-y-4 px-5 pt-6">
              {/* header */}
              <div className="flex items-center justify-between">
                <SkeletonBar className="h-3.5 w-32" />
                <div className="h-7 w-20 rounded-full bg-black/80" />
              </div>
              {/* stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                    <SkeletonBar className="h-2 w-10" />
                    <div className="mt-2 h-6 w-12 rounded bg-ink/5" />
                  </div>
                ))}
              </div>
              {/* table */}
              <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <SkeletonBar className="h-2.5 w-24" />
                  <SkeletonBar className="h-2.5 w-12" />
                </div>
                <div className="mt-3 space-y-2.5">
                  {[90, 70, 80].map((w, i) => (
                    <div key={i} className="h-2.5 rounded bg-ink/8">
                      <div
                        className="h-full rounded bg-black/50"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* keyboard deck — drawn slightly wider to fake perspective */}
      <div className="relative mx-auto h-3.5 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-[#2a2a2c] to-[#101012]" />
      <div className="mx-auto h-1 w-[104%] -translate-x-[2%] rounded-b-lg bg-black" />
    </div>
  );
}

/* ------------------------------- Browser ------------------------------ */
export function BrowserMockup() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#f4f4f6] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <div className="mx-auto flex h-6 w-2/3 items-center rounded-md bg-white px-3 ring-1 ring-black/5">
          <SkeletonBar className="h-2 w-16" />
        </div>
        <div className="w-12" />
      </div>
      {/* page */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 p-5">
        <div className="space-y-3">
          <SkeletonBar className="h-2 w-16" />
          <SkeletonBar className="h-6 w-44" />
          <SkeletonBar className="h-2.5 w-36" />
          <div className="pt-2">
            <SkeletonBar className="h-3 w-28" />
            <div className="mt-3 space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-ink/10" />
                  <SkeletonBar className="h-2.5 w-40" />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <div className="h-9 w-32 rounded-full bg-black/85" />
          </div>
        </div>
        <div className="rounded-xl bg-[#f4f4f6] p-4 ring-1 ring-black/5">
          <SkeletonBar className="h-2 w-10" />
          <div className="mt-2 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-white p-2.5 ring-1 ring-black/5">
                <SkeletonBar className="h-2 w-16" />
                <SkeletonBar className="mt-2 h-2 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}