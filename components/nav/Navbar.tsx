"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, CircuitBoard } from "lucide-react";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------
   Navbar — Apple-style frosted-glass global bar.
   ------------------------------------------------------------------
   - Always frosted (blur + hairline border) so it stays legible over
     the plain white/paper surfaces as content scrolls beneath it.
   - Desktop: inline links + a "Let's Talk" pill. The active link gets a
     hairline underline.
   - Mobile : hamburger → full-screen frosted overlay.

   NOTE: the overlay is a SIBLING of <header>, not a child. The header's
   backdrop-filter would otherwise make itself the containing block for
   `position: fixed` descendants and squash the overlay.
------------------------------------------------------------------- */

interface NavbarProps {
  activeId: SectionId;
  navigate: (id: SectionId) => void;
}

export function Navbar({ activeId, navigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasOpenRef = useRef(false);

  // Focus moves into the overlay on open and back to the trigger on close
  // (skipping the very first render so we never steal focus on page load).
  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
    } else if (wasOpenRef.current) {
      openBtnRef.current?.focus();
    }
    wasOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const select = (id: SectionId) => {
    setMenuOpen(false);
    navigate(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl transition-all duration-700 ease-apple">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:h-16 md:px-8"
        >
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="group flex items-center gap-2 rounded-full text-[17px] font-semibold tracking-tight text-ink transition-opacity hover:opacity-70"
          >
            <CircuitBoard
              aria-hidden="true"
              size={17}
              strokeWidth={1.5}
              className="text-ink"
            />
            Julius Matro
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {SECTIONS.map((s) => {
              const active = s.id === activeId;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => navigate(s.id)}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1.5 text-sm tracking-tight transition-colors duration-300 ${
                      active ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {s.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-500 ease-apple ${
                        active ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate("contact")}
              className="hidden lg:inline-flex"
            >
              Let&apos;s Talk
            </Button>

            {/* Mobile toggle */}
            <button
              ref={openBtnRef}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 lg:hidden"
            >
              {menuOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen frosted menu (sibling of the header — see note) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[45] overflow-y-auto bg-white/95 pt-24 backdrop-blur-2xl lg:hidden"
          >
            <ul className="flex flex-col px-8">
              {SECTIONS.map((s, i) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id} className="border-b border-black/5">
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        select(s.id);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-5 text-3xl font-semibold tracking-tight transition-colors ${
                        active ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="text-xs font-medium tracking-[0.2em] text-ink-soft/60">
                        0{i + 1}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="px-8 pb-12 pt-8">
              <Button
                className="w-full"
                onClick={() => select("contact")}
              >
                Let&apos;s Talk
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}