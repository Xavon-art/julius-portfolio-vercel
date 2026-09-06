/* ------------------------------------------------------------------
   primitives.tsx — small monochrome building blocks shared by the
   demo screens (pills, avatars, states, action chips). No colors —
   strictly ink grays on white, matching the site's design tokens.
------------------------------------------------------------------ */

import type { MouseEvent } from "react";
import type { PillTone } from "@/lib/projects";

export const EASE = [0.16, 1, 0.3, 1] as const;

const TONE_CLASS: Record<PillTone, string> = {
  solid: "bg-ink text-white",
  soft: "bg-ink/10 text-ink ring-1 ring-ink/10",
  outline: "ring-1 ring-ink/15 text-ink-soft",
};

export function Pill({
  tone,
  children,
  asButton = false,
  active = false,
  onClick,
  ariaLabel,
}: {
  tone: PillTone;
  children: string;
  asButton?: boolean;
  active?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}) {
  const cls = `inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-tight transition-colors ${TONE_CLASS[tone]} ${
    active ? "ring-2 ring-ink/60 ring-offset-1 ring-offset-white" : ""
  } ${asButton ? "cursor-pointer active:scale-[0.95]" : ""}`;
  if (asButton) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={cls}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={`${cls} select-none`} aria-label={ariaLabel}>
      {children}
    </span>
  );
}

export function Avatar({
  name,
  size = 26,
}: {
  name: string;
  size?: number;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-ink/10 text-[11px] font-bold text-ink"
    >
      {initial}
    </span>
  );
}

export function DashedAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink/20 px-3 py-2.5 text-[11px] font-semibold tracking-tight text-ink-soft transition-all duration-200 ease-apple hover:border-ink/40 hover:text-ink active:scale-[0.99]"
    >
      <span className="text-[13px] font-medium leading-none">+</span>
      {label}
    </button>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center">
      <p className="text-[12px] leading-relaxed text-ink-faint">{text}</p>
    </div>
  );
}

export function ConfirmRow({
  text,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-black/5 pt-2.5">
      <p className="text-[11px] font-semibold text-ink">{text}</p>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white transition-colors active:scale-[0.95]"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}