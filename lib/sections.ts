/* ------------------------------------------------------------------
   Central registry for the portfolio's "sections" (views).
   ------------------------------------------------------------------
   This app is NOT a single scrolling page. Each entry below is a
   full-viewport "screen" (Apple product-page style). Navigating
   between them triggers an animated crossfade handled by
   app/page.tsx + useSectionNavigation.

   Every section also carries:
     - tone: the flat background surface for that view. Home sits on
       pure white; the other views drop to the off-white paper tone,
       keeping the backdrop clean and Apple-quiet (no shader anymore).
------------------------------------------------------------------- */

export type SectionId =
  | "home"
  | "capabilities"
  | "about"
  | "skills"
  | "work"
  | "services"
  | "contact";

export interface SectionDef {
  id: SectionId;
  index: number;
  /** Nav label. */
  label: string;
  /** Full document.title for this section. */
  title: string;
  /** Flat surface tone: "white" (home) or "paper" (off-white views). */
  tone: "white" | "paper";
}

export const SECTIONS: SectionDef[] = [
  {
    id: "home",
    index: 0,
    label: "Home",
    title: "Julius Matro — Software Developer",
    tone: "white",
  },
  {
    id: "capabilities",
    index: 1,
    label: "Why Me",
    title: "Why Work With Me — Julius Matro",
    tone: "paper",
  },
  {
    id: "about",
    index: 2,
    label: "About",
    title: "About — Julius Matro",
    tone: "paper",
  },
  {
    id: "skills",
    index: 3,
    label: "Skills",
    title: "Skills — Julius Matro",
    tone: "paper",
  },
  {
    id: "work",
    index: 4,
    label: "Work",
    title: "Work — Julius Matro",
    tone: "paper",
  },
  {
    id: "services",
    index: 5,
    label: "Services",
    title: "Services — Julius Matro",
    tone: "paper",
  },
  {
    id: "contact",
    index: 6,
    label: "Contact",
    title: "Contact — Julius Matro",
    tone: "paper",
  },
];

export const SECTION_MAP: Record<SectionId, SectionDef> = SECTIONS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SectionId, SectionDef>,
);

/** Props every section component receives from the Shell (app/page.tsx). */
export interface SectionProps {
  /** Jump directly to a section by id (used by navbar, buttons, …). */
  navigate: (id: SectionId) => void;
  /** Move to the next / previous section (keyboard, wheels, swipes…). */
  next: () => void;
  prev: () => void;
}