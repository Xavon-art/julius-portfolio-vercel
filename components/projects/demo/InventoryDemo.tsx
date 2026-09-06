/* ------------------------------------------------------------------
   InventoryDemo — the Inventory Manager interactive demo.
   ------------------------------------------------------------------
   Desktop software, so it uses its own three-tab layout (Stock / Bins
   / Activity) with a top tab strip instead of the shared phone-style
   bottom nav. Stock is the same full-CRUD EntityScreen the other
   themes use; Bins and Activity are inventory-native screens. All
   state is local and seeded from <Project.demo> — fresh every visit.
------------------------------------------------------------------ */

import { useState } from "react";
import { Boxes, History, Warehouse, type LucideIcon } from "lucide-react";
import type {
  DemoBinRow,
  DemoMoveRow,
  DemoSlot,
  JobRow,
  Project,
} from "@/lib/projects";
import { getDemoTheme } from "./theme";
import { EntityScreen, type EntityInput } from "./EntityScreen";
import { BinsScreen } from "./BinsScreen";
import { MovementsScreen } from "./MovementsScreen";

interface TabDef {
  id: DemoSlot;
  label: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: "stock", label: "Stock", icon: Boxes },
  { id: "bins", label: "Bins", icon: Warehouse },
  { id: "activity", label: "Activity", icon: History },
];

interface InventoryDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
}

export function InventoryDemo({ project, tab, onTabChange }: InventoryDemoProps) {
  const demo = project.demo;
  const theme = getDemoTheme(project.slug);

  const [items, setItems] = useState<JobRow[]>(demo.jobs);
  const [bins, setBins] = useState<DemoBinRow[]>(demo.bins ?? []);
  const [movements, setMovements] = useState<DemoMoveRow[]>(demo.movements ?? []);

  const activeId: DemoSlot = TABS.some((t) => t.id === tab) ? tab : "stock";

  const normalize = (row: JobRow): JobRow => {
    const next = theme.derive(row);
    return { ...row, status: next.status, tone: next.tone, eta: next.eta };
  };

  const addItem = (row: EntityInput) =>
    setItems((rows) => [
      { ...normalize({ ...row, status: "", tone: "outline" }), highlighted: true },
      ...rows,
    ]);

  const updateItem = (id: string, patch: Partial<JobRow>) =>
    setItems((rows) =>
      rows.map((row) =>
        row.id === id ? { ...normalize({ ...row, ...patch }), highlighted: true } : row,
      ),
    );

  const deleteItem = (id: string) =>
    setItems((rows) => rows.filter((row) => row.id !== id));

  const addBin = (name: string) =>
    setBins((rows) => [{ id: `bin-${Date.now()}`, name, items: [] }, ...rows]);

  const renameBin = (id: string, name: string) =>
    setBins((rows) => rows.map((bin) => (bin.id === id ? { ...bin, name } : bin)));

  const deleteBin = (id: string) =>
    setBins((rows) => rows.filter((bin) => bin.id !== id));

  const addMove = (delta: number, ref: string, bin: string) =>
    setMovements((rows) => [
      { id: `mv-${Date.now()}`, ref, delta, bin, time: "now" },
      ...rows,
    ]);

  return (
    <div className="flex h-full select-none flex-col bg-[#f4f4f6] text-ink">
      {/* window header */}
      <div className="flex items-center justify-between px-3 pb-1.5 pt-2">
        <p className="text-[11px] font-semibold tracking-tight text-ink">
          {project.name}
        </p>
        <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          Live demo
        </span>
      </div>

      {/* top tab strip */}
      <nav
        className="flex shrink-0 items-center gap-1 border-b border-black/5 px-3 pb-2"
        aria-label="App sections"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-tight transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon size={12} strokeWidth={2.25} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* active screen */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {activeId === "stock" && (
          <EntityScreen
            theme={theme}
            rows={items}
            memberOptions={[]}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onCycle={() => {}}
            onSetStatus={() => {}}
          />
        )}
        {activeId === "bins" && (
          <BinsScreen
            bins={bins}
            onAdd={addBin}
            onRename={renameBin}
            onDelete={deleteBin}
          />
        )}
        {activeId === "activity" && (
          <MovementsScreen
            movements={movements}
            itemOptions={items.map((i) => i.title)}
            binOptions={bins.map((b) => b.name)}
            onAdd={addMove}
          />
        )}
      </div>
    </div>
  );
}