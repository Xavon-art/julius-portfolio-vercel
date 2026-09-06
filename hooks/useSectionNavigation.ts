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
                   panel takes priority (checked via [data-scrollable]);
                   only an overscroll past its edge reaches navigation.
     - Touch     : same boundary rule as the wheel. While a section's
                   scrollable panel can move under a swipe (or already
                   moved during it), the gesture belongs to content —
                   navigation only fires on a deliberate swipe past the
                   panel's top/bottom edge (or on panels that can't
                   scroll at all). A small flick while reading no longer
                   jumps sections.

   nav-intent cooldown gates next/prev (scroll, swipe, keyboard,
   chevrons) so a fling chains one section at a time. Deliberate jumps
   (navbar links, section dots, deep links) bypass the cooldown — they
   are intentional actions, not accidental gestures.
------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, SECTION_MAP, type SectionId } from "@/lib/sections";

const COOLDOWN_MS = 1000; // > 550ms transition + ~450ms settle after it
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

  // Direct jump. No cooldown: navbar links, section dots, and deep links
  // are deliberate actions and must always respond instantly.
  const goTo = useCallback((target: number) => {
    const next = Math.max(0, Math.min(SECTIONS.length - 1, target));
    if (next === indexRef.current) return;
    setIndex(next);
  }, []);

  const goToId = useCallback(
    (id: SectionId) => {
      goTo(SECTION_MAP[id].index);
    },
    [goTo],
  );

  // Step navigation — scroll/swipe/keyboard/chevrons. These are the
  // accidental-gesture-prone paths, so they share one cooldown that keeps
  // a strong fling from chaining through several sections.
  const next = useCallback(() => {
    if (Date.now() - cooldownRef.current < COOLDOWN_MS) return;
    cooldownRef.current = Date.now();
    goTo(indexRef.current + 1);
  }, [goTo]);
  const prev = useCallback(() => {
    if (Date.now() - cooldownRef.current < COOLDOWN_MS) return;
    cooldownRef.current = Date.now();
    goTo(indexRef.current - 1);
  }, [goTo]);

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

    // Touch mirrors the wheel's boundary rule. Per gesture we remember:
    //   - the scrollable panel under the finger (the section frame),
    //   - whether the gesture pushed OUTWARD past the panel's edge
    //     (outDir/boundaryY) — the only case that may navigate.
    // A gesture that scrolls (or could scroll) the panel while reading
    // is always consumed by content and never navigates.
    const touch = {
      x0: 0,
      y0: 0,
      lastY: 0,
      scroller: null as HTMLElement | null,
      outDir: 0, // +1 = pushed past the bottom, -1 = pushed past the top
      boundaryY: 0,
    };

    const onTouchStart = (e: TouchEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const target = e.target as HTMLElement | null;
      touch.x0 = e.touches[0]?.clientX ?? 0;
      touch.y0 = e.touches[0]?.clientY ?? 0;
      touch.lastY = touch.y0;
      touch.outDir = 0;
      touch.scroller = target?.closest<HTMLElement>("[data-scrollable]") ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touch.lastY;
      const dy = y - touch.lastY;
      touch.lastY = y;
      const scroller = touch.scroller;
      if (!scroller || touch.outDir !== 0) return;
      const atBottom =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
      const atTop = scroller.scrollTop <= 1;
      // Only an outward pull past the panel's own edge counts; mark the
      // first such move so the travel past it can be measured at touchend.
      if (atBottom && dy < -1) {
        touch.outDir = 1;
        touch.boundaryY = y;
      } else if (atTop && dy > 1) {
        touch.outDir = -1;
        touch.boundaryY = y;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const changed = e.changedTouches[0];
      const endX = changed?.clientX ?? touch.x0;
      const endY = changed?.clientY ?? touch.y0;
      const dx = endX - touch.x0;
      const dy = endY - touch.y0;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

      if (absY >= absX) {
        // Over a scrollable panel, navigation only happens on a clear
        // overscroll — the finger kept moving PAST the content edge by a
        // full threshold. Ordinary reading scrolls never navigate.
        if (touch.scroller) {
          if (touch.outDir === 1) {
            if (touch.boundaryY - endY < SWIPE_THRESHOLD) return;
            next();
          } else if (touch.outDir === -1) {
            if (endY - touch.boundaryY < SWIPE_THRESHOLD) return;
            prev();
          }
          return;
        }
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
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev, goTo]);

  return { index, goTo, goToId, next, prev };
}