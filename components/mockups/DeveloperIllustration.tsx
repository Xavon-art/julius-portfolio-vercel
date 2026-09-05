"use client";

/* ------------------------------------------------------------------
   DeveloperIllustration — a clean, monochrome line illustration of a
   developer's desk (monitor, laptop, phone, coffee, plant).
   ------------------------------------------------------------------
   PLACEHOLDER ART: replace with a real portrait or photograph of
   Julius if preferred (apply `filter: grayscale(100%)` to keep the
   monochrome treatment). This SVG keeps the About section visually
   focused without any stock-photo clichés.
------------------------------------------------------------------- */

export function DeveloperIllustration() {
  return (
    <svg
      viewBox="0 0 360 320"
      role="img"
      aria-label="Minimal monochrome illustration of a developer's desk"
      className="h-auto w-full"
    >
      {/* soft backdrop blob */}
      <circle cx="180" cy="150" r="128" fill="#f1f1f3" />
      <circle cx="180" cy="150" r="128" fill="none" stroke="#d2d2d7" strokeWidth="1" />

      {/* desk surface */}
      <rect x="30" y="238" width="300" height="7" rx="3.5" fill="#1d1d1f" />
      <rect x="46" y="247" width="8" height="52" fill="#d2d2d7" />
      <rect x="306" y="247" width="8" height="52" fill="#d2d2d7" />

      {/* monitor */}
      <rect
        x="96"
        y="76"
        width="150"
        height="100"
        rx="10"
        fill="#1d1d1f"
      />
      <rect x="104" y="84" width="134" height="84" rx="6" fill="#fafafa" />
      {/* code lines on screen */}
      <g fill="#c7c7cc">
        <rect x="114" y="98" width="34" height="5" rx="2.5" />
        <rect x="156" y="98" width="24" height="5" rx="2.5" />
        <rect x="118" y="112" width="60" height="5" rx="2.5" />
        <rect x="130" y="126" width="42" height="5" rx="2.5" />
        <rect x="118" y="140" width="66" height="5" rx="2.5" />
        <rect x="114" y="154" width="48" height="5" rx="2.5" />
      </g>
      {/* caret */}
      <rect x="202" y="154" width="3" height="5" fill="#1d1d1f" />
      {/* monitor stand */}
      <rect x="158" y="176" width="26" height="12" fill="#d2d2d7" />
      <rect x="148" y="188" width="46" height="6" rx="3" fill="#1d1d1f" />

      {/* laptop */}
      <rect x="214" y="176" width="88" height="56" rx="8" fill="#1d1d1f" />
      <rect x="220" y="182" width="76" height="44" rx="5" fill="#fafafa" />
      {/* laptop screen content */}
      <g fill="#c7c7cc">
        <rect x="228" y="190" width="30" height="5" rx="2.5" />
        <rect x="228" y="202" width="20" height="5" rx="2.5" />
        <rect x="228" y="214" width="26" height="5" rx="2.5" />
      </g>
      <rect x="240" y="221" width="44" height="5" rx="2.5" fill="#8e8e93" />
      {/* laptop base */}
      <path d="M212 240 L306 240 L314 254 L204 254 Z" fill="#434344" />
      <path d="M204 254 L314 254 L310 260 L208 260 Z" fill="#161617" />

      {/* phone */}
      <rect x="44" y="170" width="28" height="56" rx="7" fill="#1d1d1f" />
      <rect x="47" y="174" width="22" height="48" rx="4.5" fill="#fafafa" />
      <g fill="#c7c7cc">
        <rect x="51" y="180" width="14" height="4" rx="2" />
        <rect x="51" y="188" width="12" height="3" rx="1.5" />
        <rect x="51" y="194" width="12" height="3" rx="1.5" />
        <rect x="51" y="200" width="12" height="3" rx="1.5" />
      </g>
      <rect x="54" y="210" width="8" height="3" rx="1.5" fill="#8e8e93" />

      {/* coffee mug + steam */}
      <rect x="316" y="212" width="22" height="24" rx="4" fill="#fafafa" stroke="#1d1d1f" strokeWidth="1.5" />
      <path d="M338 218 q6 4 0 9" fill="none" stroke="#1d1d1f" strokeWidth="1.5" />
      <g fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round">
        <path d="M318 204 q3 -6 0 -12" />
        <path d="M327 204 q-3 -6 0 -12" />
        <path d="M336 204 q3 -6 0 -12" />
      </g>
      <rect x="319" y="224" width="16" height="5" rx="2.5" fill="#d2d2d7" />

      {/* small plant */}
      <g stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M120 236 q-10 -18 -4 -32 q14 8 4 32" />
        <path d="M132 236 q0 -22 10 -32 q8 14 -10 32" />
        <path d="M144 236 q12 -16 6 -30 q-14 4 -6 30" />
      </g>
      <path d="M112 238 h44 v6 a22 5 0 0 1 -44 0 z" fill="#fafafa" stroke="#1d1d1f" strokeWidth="1.5" />

      {/* floor shadow */}
      <ellipse cx="180" cy="302" rx="120" ry="6" fill="#d2d2d7" opacity="0.6" />
    </svg>
  );
}