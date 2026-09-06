/* ------------------------------------------------------------------
   portal.ts — small shared helpers for the Client Portal demo.
   ------------------------------------------------------------------
   Stock photography is served from picsum.photos (Unsplash-sourced,
   free / royalty-free / commercial-safe, NOT Pinterest) and requested
   grayscale so it keeps the site's monochrome treatment. Seeded URLs
   stay stable across visits.
------------------------------------------------------------------ */

import { FileText, FileSpreadsheet, Image, type LucideIcon } from "lucide-react";
import type { PortalFileKind } from "@/lib/projects";

export const coverUrl = (seed: string, w = 480, h = 270) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const avatarUrl = (name: string) =>
  `https://picsum.photos/seed/ava-${name.replace(/[^a-z0-9]/gi, "").toLowerCase()}/64/64?grayscale`;

export const peso = (n: number) => `₱${n.toLocaleString("en-US")}`;

export const KIND_META: Record<PortalFileKind, { icon: LucideIcon; label: string }> = {
  pdf: { icon: FileText, label: "PDF" },
  docx: { icon: FileText, label: "DOCX" },
  png: { icon: Image, label: "PNG" },
  xlsx: { icon: FileSpreadsheet, label: "XLSX" },
};