"use client";

/* ------------------------------------------------------------------
   useSectionNavigation — the heart of the "section-as-page" model.
   ------------------------------------------------------------------
   A single piece of state (the active index) drives everything:
     - the animated crossfade in app/page.tsx (AnimatePresence),
     - the navbar / section indicator.

   Inputs beyond the navbar:
     - Keyboard  : ArrowUp/ArrowLeft = previous, ArrowDown/ArrowRight =
                   next (ignored while typing in form fields).
     - Wheel     : accumulated delta triggers the next/previous section.
                   Native scrolling inside a section's own scrollable
                   panel takes priority (checked via [data-scrollable]).
     - Touch     : vertical/horizontal swipes on mobile.

   A short cooldown debounces all of these so a scroll-fling or a held
   arrow key advances one section at a time.
------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, SECTION_MAP, type SectionId } from "@/lib/sections";

const COOLDOWN_MS = 850; // > the 550ms transition time
const WHEEL_THRESHOLD = 70; // px of accumulated delta before advancing
const SWIPE_THRESHOLD = 60; // px of finger travel before advancing

export function useSectionNavigation() {
  // Always start at Home. The initializer must be identical on server and
  // client or hydration mismatches on links like /#about.
  const [index, setIndex] = useState<number>(0);

  // Ref mirror of `index` so wheel/keyboard handlers never close over
  // stale state.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const cooldownRef = useRef(0);

  const goTo = useCallback((target: number) => {
    if (Date.now() - cooldownRef.current < COOLDOWN_MS) return;
    const next = Math.max(0, Math.min(SECTIONS.length - 1, target));
    if (next === indexRef.current) return;
    cooldownRef.current = Date.now();
    setIndex(next);
  }, []);

  const goToId = useCallback(
    (id: SectionId) => {
      goTo(SECTION_MAP[id].index);
    },
    [goTo],
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // Deep links (#about, #work, …) are resolved after the first paint so the
  // server-rendered HTML and the client state stay in sync. The navigation
  // is deferred out of the effect body (react-hooks setState-in-effect).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash.replace("#", "") as SectionId;
    const target = SECTION_MAP[id]?.index ?? 0;
    if (target === 0) return;
    const raf = requestAnimationFrame(() => goTo(target));
    return () => cancelAnimationFrame(raf);
  }, [goTo]);

  // Keep the browser chrome in sync: document title per section + a
  // shareable hash URL (#about, #work, …). replaceState keeps history clean.
  useEffect(() => {
    const section = SECTIONS[index];
    document.title = section.title;
    const hash = section.id === "home" ? "/" : `#${section.id}`;
    history.replaceState(null, "", hash);
  }, [index]);

  // --- Keyboard, wheel, and touch input live on the window level since
  //     sections swap in and out of the DOM on every transition.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;

      // Don't hijack arrow keys while the user is typing.
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SECTIONS.length - 1);
          break;
      }
    };

    const wheelAccum = { value: 0 };

    const onWheel = (e: WheelEvent) => {
      // A section's own scrollable panel keeps the gesture as long as it can
      // still scroll in that direction. When it hits its boundary (top with
      // a negative delta, bottom with a positive one), the wheel flows
      // through to section-level navigation — so you can always "scroll on"
      // to the next view.
      const scroller = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-scrollable]",
      );
      if (scroller) {
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >=
          scroller.scrollHeight - 1;
        const atTop = scroller.scrollTop <= 1;
        const consumesScroll =
          (e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop);
        if (consumesScroll) {
          wheelAccum.value = 0;
          return;
        }
      }

      if (e.deltaY === 0) {
        wheelAccum.value = 0;
        return;
      }
      wheelAccum.value += e.deltaY;
      if (Math.abs(wheelAccum.value) > WHEEL_THRESHOLD) {
        const dir = wheelAccum.value > 0 ? 1 : -1;
        wheelAccum.value = 0;
        if (dir === 1) next();
        else prev();
      }
    };

    const touchStart = { x: 0, y: 0 };

    const onTouchStart = (e: TouchEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      touchStart.x = e.touches[0]?.clientX ?? 0;
      touchStart.y = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.x;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStart.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;
      if (absY >= absX) {
        if (dy < 0) next();
        else prev();
      } else {
        if (dx < 0) next();
        else prev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev, goTo]);

  return { index, goTo, goToId, next, prev };
}