/* ------------------------------------------------------------------
   ChecklistScreen — the ordered checklist (route stops / replenish
   steps / milestones).
   ------------------------------------------------------------------
   Rows can be checked off and re-ordered with the chevrons (float
   animations via framer-motion `layout`). A "Recalculate" action plays
   a short optimizing pulse, then the screen shuffles into a fresh,
   contiguous order and flashes an "optimized" confirmation — echoing
   the live route logic the product actually ships with.
------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, RotateCw } from "lucide-react";
import type { RouteStopRow } from "@/lib/projects";
import type { DemoTheme } from "./theme";
import { EASE } from "./primitives";

interface ChecklistScreenProps {
  theme: DemoTheme;
  steps: RouteStopRow[];
  onToggle: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onRecalc: () => void;
}

export function ChecklistScreen({
  theme,
  steps,
  onToggle,
  onMove,
  onRecalc,
}: ChecklistScreenProps) {
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
    },
    [],
  );

  const recalc = () => {
    if (optimizing) return;
    setOptimizing(true);
    timers.current.push(
      window.setTimeout(() => {
        onRecalc();
        setOptimizing(false);
        setOptimized(true);
        timers.current.push(
          window.setTimeout(() => setOptimized(false), 1600),
        );
      }, 750),
    );
  };

  const completed = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-tight text-ink">
            {theme.checklistTitle}
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {completed}/{steps.length} done
          </p>
        </div>
        <button
          type="button"
          onClick={recalc}
          disabled={optimizing || steps.length === 0}
          className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1.5 text-[10px] font-semibold text-white transition-opacity disabled:opacity-40"
        >
          <RotateCw
            size={11}
            className={optimizing ? "animate-spin" : undefined}
          />
          {optimizing ? "Recalculating…" : theme.recalcLabel}
        </button>
      </div>

      {optimized && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="rounded-xl bg-ink/5 px-3 py-1.5 text-[10px] font-semibold tracking-tight text-ink"
        >
          ✓ {theme.optimizedLabel} — order updated
        </motion.p>
      )}

      {steps.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center">
          <p className="text-[12px] leading-relaxed text-ink-faint">
            No {theme.checklistNoun} to show.
          </p>
        </div>
      )}

      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          layout
          transition={{ duration: 0.3, ease: EASE }}
          className="flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/5"
        >
          <button
            type="button"
            aria-label={step.done ? `Mark ${step.label} incomplete` : `Mark ${step.label} complete`}
            onClick={() => onToggle(step.id)}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
              step.done
                ? "bg-ink text-white"
                : "ring-1 ring-ink/20 text-transparent hover:ring-ink/50"
            }`}
          >
            <Check size={12} strokeWidth={3} />
          </button>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-[12px] font-semibold tracking-tight ${
                step.done ? "text-ink-faint line-through" : "text-ink"
              }`}
            >
              {i + 1}. {step.label}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-ink-faint">
              {step.detail}
            </p>
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={`Move ${step.label} up`}
              disabled={i === 0 || optimizing}
              onClick={() => onMove(step.id, -1)}
              className="rounded p-0.5 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              aria-label={`Move ${step.label} down`}
              disabled={i === steps.length - 1 || optimizing}
              onClick={() => onMove(step.id, 1)}
              className="rounded p-0.5 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}