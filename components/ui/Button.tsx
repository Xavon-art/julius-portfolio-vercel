"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ------------------------------------------------------------------
   Button — pill-shaped CTA. Monochrome only:
     primary : black fill / white text (Apple "Buy" style)
     ghost   : hairline outline, quiet
     light   : white fill / black text (for dark panels)
   Subtle scale on hover, strong ease-out curve on transition.
------------------------------------------------------------------- */

type Variant = "primary" | "ghost" | "light";
type Size = "default" | "sm";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-black hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)]",
  ghost:
    "border border-ink/15 text-ink hover:border-ink/50 hover:bg-white/60",
  light: "bg-white text-ink shadow-sm hover:bg-mist",
};

const SIZE_CLASSES: Record<Size, string> = {
  default: "px-7 py-3.5 text-[15px]",
  sm: "px-5 py-2 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-apple hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:outline-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </button>
  );
}