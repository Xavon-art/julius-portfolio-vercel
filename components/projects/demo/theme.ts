/* ------------------------------------------------------------------
   theme.ts — per-project config for the interactive demo.
   ------------------------------------------------------------------
   Every project is an app that fits the same four-screen template
   (entities / checklist / roster / feed), but the nouns, fields, and
   status ladders differ. This module maps a project slug to its
   "theme" — the text, fields, and rules the demo screens render with.
   Client-only (imported by the demo components), so functions are fine
   here. The seed rows themselves live in lib/projects.ts.
------------------------------------------------------------------ */

import type { JobRow, PillTone } from "@/lib/projects";

export type EntityKey = "title" | "sub" | "eta" | "member" | "qty" | "threshold" | "sku";

export interface DemoField {
  key: EntityKey;
  label: string;
  placeholder?: string;
  kind?: "text" | "number" | "select";
  grow?: boolean;
}

export interface StatusStep {
  label: string;
  tone: PillTone;
}

export interface DemoTheme {
  entityNoun: string;
  entityNounUpper: string;
  teamTabLabel: string;
  newButton: string;
  addTitle: string;
  editTitle: string;
  removeConfirm: string;
  fields: DemoField[];
  statusLadder: StatusStep[];
  canCycleStatus: boolean;
  rosterStatuses: StatusStep[];
  rosterNote: string;
  checklistTitle: string;
  checklistNoun: string;
  recalcLabel: string;
  optimizedLabel: string;
  emptyEntity: string;
  derive: (row: JobRow) => { status: string; tone: PillTone; eta: string };
}

function matchTone(label: string, ladder: StatusStep[]): PillTone {
  return ladder.find((s) => s.label === label)?.tone ?? ladder[0].tone;
}

const FIELD_OPS: DemoTheme = {
  entityNoun: "job",
  entityNounUpper: "Jobs",
  teamTabLabel: "Team",
  newButton: "New Job",
  addTitle: "Add a job",
  editTitle: "Edit job",
  removeConfirm: "Remove this job?",
  fields: [
    { key: "title", label: "Title", placeholder: "e.g. Install router", grow: true },
    { key: "sub", label: "Location", placeholder: "Building · floor", grow: true },
    { key: "eta", label: "ETA", placeholder: "e.g. 14:30" },
    { key: "member", label: "Assigned to", kind: "select", grow: true },
  ],
  statusLadder: [
    { label: "Open", tone: "outline" },
    { label: "Assigned", tone: "outline" },
    { label: "In progress", tone: "soft" },
    { label: "Complete", tone: "solid" },
  ],
  canCycleStatus: true,
  rosterStatuses: [
    { label: "Available", tone: "outline" },
    { label: "On the way", tone: "soft" },
    { label: "On a job", tone: "solid" },
  ],
  rosterNote: "Who's free and who's busy, without a single call.",
  checklistTitle: "Route",
  checklistNoun: "stop",
  recalcLabel: "Recalculate",
  optimizedLabel: "Route optimized",
  emptyEntity: "No jobs yet — tap + New Job to add one.",
  derive: (row) => ({
    status: row.status ?? FIELD_OPS.statusLadder[0].label,
    tone: row.tone ?? matchTone(row.status, FIELD_OPS.statusLadder),
    eta: row.eta ?? "",
  }),
};

const INVENTORY: DemoTheme = {
  entityNoun: "item",
  entityNounUpper: "Stock",
  teamTabLabel: "Staff",
  newButton: "New Item",
  addTitle: "Add a stock item",
  editTitle: "Edit item",
  removeConfirm: "Remove this item?",
  fields: [
    { key: "title", label: "Item", placeholder: "e.g. USB-C Cable · 2m", grow: true },
    { key: "sku", label: "SKU", placeholder: "e.g. CBL-USB2M" },
    { key: "sub", label: "Bin / Location", placeholder: "Aisle 3 · Bin B12", grow: true },
    { key: "qty", label: "Qty on hand", kind: "number" },
    { key: "threshold", label: "Reorder at", kind: "number" },
  ],
  statusLadder: [
    { label: "Out", tone: "solid" },
    { label: "Low", tone: "soft" },
    { label: "In stock", tone: "solid" },
  ],
  canCycleStatus: false,
  rosterStatuses: [
    { label: "On floor", tone: "soft" },
    { label: "Counter", tone: "outline" },
    { label: "Backroom", tone: "outline" },
  ],
  rosterNote: "Who's where — floor, counter, or backroom.",
  checklistTitle: "Replenish",
  checklistNoun: "step",
  recalcLabel: "Recalculate",
  optimizedLabel: "Order optimized",
  emptyEntity: "No items yet — tap + New Item to add one.",
  derive: (row) => {
    const qty = row.qty ?? 0;
    const threshold = row.threshold ?? 0;
    const status = qty <= 0 ? "Out" : qty <= threshold ? "Low" : "In stock";
    return {
      status,
      tone: status === "Low" ? "soft" : "solid",
      eta: `${qty} in stock`,
    };
  },
};

const CLIENT_PORTAL: DemoTheme = {
  entityNoun: "project",
  entityNounUpper: "Projects",
  teamTabLabel: "Clients",
  newButton: "New Project",
  addTitle: "Add a project",
  editTitle: "Edit project",
  removeConfirm: "Remove this project?",
  fields: [
    { key: "title", label: "Project", placeholder: "e.g. Website Redesign", grow: true },
    { key: "sub", label: "Client", placeholder: "e.g. North & Co.", grow: true },
    { key: "eta", label: "Due", placeholder: "e.g. Due Nov 12" },
    { key: "member", label: "Account", kind: "select", grow: true },
  ],
  statusLadder: [
    { label: "Queued", tone: "outline" },
    { label: "Active", tone: "soft" },
    { label: "In review", tone: "outline" },
    { label: "On track", tone: "soft" },
    { label: "Complete", tone: "solid" },
  ],
  canCycleStatus: true,
  rosterStatuses: [
    { label: "Active", tone: "soft" },
    { label: "Onboarding", tone: "outline" },
    { label: "Archived", tone: "solid" },
  ],
  rosterNote: "Every account and how many projects are active.",
  checklistTitle: "Milestones",
  checklistNoun: "step",
  recalcLabel: "Re-plan",
  optimizedLabel: "Plan updated",
  emptyEntity: "No projects yet — tap + New Project to add one.",
  derive: (row) => ({
    status: row.status ?? CLIENT_PORTAL.statusLadder[0].label,
    tone: row.tone ?? matchTone(row.status, CLIENT_PORTAL.statusLadder),
    eta: row.eta ?? "",
  }),
};

const THEMES: Record<string, DemoTheme> = {
  "field-ops-suite": FIELD_OPS,
  "inventory-manager": INVENTORY,
  "client-portal": CLIENT_PORTAL,
};

export function getDemoTheme(slug: string): DemoTheme {
  return THEMES[slug] ?? FIELD_OPS;
}