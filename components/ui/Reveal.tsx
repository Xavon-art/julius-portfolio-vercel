"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------
   Reveal — entrance micro-animation for blocks inside a section.
   Sections mount fresh on every navigation, so these animations run
   whenever a section enters. The Apple ease-out curve gives the
   signature "smooth deceleration" feel.
------------------------------------------------------------------- */

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before animating (used to stagger siblings). */
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 26, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}