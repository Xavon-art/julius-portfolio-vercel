/* ------------------------------------------------------------------
   ClientPortalDemo — the Client Portal interactive demo.
   ------------------------------------------------------------------
   The richest demo of the three: a four-tab web dashboard
   (Projects / Files / Invoices / Updates) whose layout adapts to the
   chosen device — a left sidebar on laptop view, a top tab strip on
   phone view. All state lives here (seeded from <Project.demo.portal>)
   so nothing is lost when the visitor switches device view, and every
   visit starts fresh.
   Nested state: milestones drive the parent project's progress bar,
   invoice statuses drive the running ₱ total, and files link back to
   their project's expanded view.
------------------------------------------------------------------ */

import { useState } from "react";
import { FolderKanban, FolderOpen, MessageSquare, Receipt, type LucideIcon } from "lucide-react";
import type {
  DemoSlot,
  NotesRow,
  PortalFileKind,
  PortalFileRow,
  PortalInvoiceRow,
  PortalProjectRow,
  Project,
} from "@/lib/projects";
import { getDemoTheme } from "./theme";
import { FeedScreen } from "./FeedScreen";
import {
  PortalProjectsScreen,
  type ProjectInput,
  COVER_POOL,
  STATUS_TONES,
} from "./PortalProjectsScreen";
import { PortalFilesScreen, type FileInput } from "./PortalFilesScreen";
import { PortalInvoicesScreen, type InvoiceInput } from "./PortalInvoicesScreen";

export type DeviceView = "laptop" | "phone";

interface TabDef {
  id: DemoSlot;
  label: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "updates", label: "Updates", icon: MessageSquare },
];

const INVOICE_CYCLE = ["Pending", "Paid", "Overdue"] as const;

const progressOf = (milestones: PortalProjectRow["milestones"]) =>
  milestones.length > 0
    ? Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100)
    : 0;

interface ClientPortalDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
  device: DeviceView;
}

export function ClientPortalDemo({
  project,
  tab,
  onTabChange,
  device,
}: ClientPortalDemoProps) {
  const demo = project.demo;
  const theme = getDemoTheme(project.slug);
  const portal = demo.portal ?? { projects: [], files: [], invoices: [] };

  const [projects, setProjects] = useState<PortalProjectRow[]>(portal.projects);
  const [files, setFiles] = useState<PortalFileRow[]>(portal.files);
  const [invoices, setInvoices] = useState<PortalInvoiceRow[]>(portal.invoices);
  const [updates, setUpdates] = useState<NotesRow[]>(demo.notes);

  const activeId: DemoSlot = TABS.some((t) => t.id === tab) ? tab : "projects";

  const addProject = (input: ProjectInput) =>
    setProjects((rows) => [
      {
        id: `p-${Date.now()}`,
        name: input.name,
        client: input.client,
        status: input.status,
        tone: STATUS_TONES[input.status] ?? "outline",
        due: input.due,
        cover: COVER_POOL[rows.length % COVER_POOL.length],
        progress: 0,
        milestones: [],
        feed: [{ time: "now", text: "Project created." }],
      },
      ...rows,
    ]);

  const updateProject = (id: string, patch: Partial<PortalProjectRow>) =>
    setProjects((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };
        if (patch.milestones) next.progress = progressOf(patch.milestones);
        if (patch.status) next.tone = STATUS_TONES[patch.status] ?? row.tone;
        return next;
      }),
    );

  const deleteProject = (id: string) => {
    setProjects((rows) => rows.filter((row) => row.id !== id));
    setFiles((rows) =>
      rows.map((file) => (file.projectId === id ? { ...file, projectId: undefined } : file)),
    );
  };

  const toggleMilestone = (projectId: string, milestoneId: string) =>
    setProjects((rows) =>
      rows.map((row) => {
        if (row.id !== projectId) return row;
        const milestone = row.milestones.find((m) => m.id === milestoneId);
        const next = row.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m,
        );
        const feedText = milestone?.done
          ? `Milestone '${milestone.label}' reopened.`
          : `Milestone '${milestone?.label ?? ""}' marked complete.`;
        return {
          ...row,
          milestones: next,
          progress: progressOf(next),
          feed: [...row.feed, { time: "now", text: feedText }],
        };
      }),
    );

  const addMilestone = (projectId: string, label: string) =>
    setProjects((rows) =>
      rows.map((row) => {
        if (row.id !== projectId) return row;
        const next = [...row.milestones, { id: `ms-${Date.now()}`, label, done: false }];
        return {
          ...row,
          milestones: next,
          progress: progressOf(next),
          feed: [...row.feed, { time: "now", text: `Milestone '${label}' added.` }],
        };
      }),
    );

  const deleteMilestone = (projectId: string, milestoneId: string) =>
    setProjects((rows) =>
      rows.map((row) => {
        if (row.id !== projectId) return row;
        const next = row.milestones.filter((m) => m.id !== milestoneId);
        return { ...row, milestones: next, progress: progressOf(next) };
      }),
    );

  const setProgress = (projectId: string, value: number) =>
    setProjects((rows) =>
      rows.map((row) => (row.id === projectId ? { ...row, progress: value } : row)),
    );

  const addFile = (input: FileInput) =>
    setFiles((rows) => [
      {
        id: `f-${Date.now()}`,
        name: input.name,
        kind: input.kind as PortalFileKind,
        projectId: input.projectId,
        uploaded: "Today",
        by: "You",
      },
      ...rows,
    ]);

  const deleteFile = (id: string) =>
    setFiles((rows) => rows.filter((row) => row.id !== id));

  const addInvoice = (input: InvoiceInput) =>
    setInvoices((rows) => {
      const max = rows.reduce((acc, inv) => {
        const n = Number.parseInt(inv.number.replace(/\D/g, ""), 10);
        return Number.isNaN(n) ? acc : Math.max(acc, n);
      }, 0);
      return [
        {
          id: `i-${Date.now()}`,
          number: `INV-${max + 1}`,
          client: input.client,
          amount: input.amount,
          status: "Pending",
          due: input.due,
        },
        ...rows,
      ];
    });

  const cycleInvoice = (id: string) =>
    setInvoices((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const idx = (INVOICE_CYCLE.indexOf(row.status) + 1) % INVOICE_CYCLE.length;
        return { ...row, status: INVOICE_CYCLE[idx] };
      }),
    );

  const deleteInvoice = (id: string) =>
    setInvoices((rows) => rows.filter((row) => row.id !== id));

  const addUpdate = (body: string) =>
    setUpdates((rows) => [
      { id: `u-${Date.now()}`, author: "You", time: "now", body },
      ...rows,
    ]);

  const clientOptions = [...new Set(projects.map((p) => p.client))];

  const header = (
    <div className="flex items-center justify-between px-3 pb-1.5 pt-2">
      <p className="text-[11px] font-semibold tracking-tight text-ink">{project.name}</p>
      <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
        Live demo
      </span>
    </div>
  );

  const tabButton = (t: TabDef, vertical: boolean) => {
    const Icon = t.icon;
    const active = activeId === t.id;
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => onTabChange(t.id)}
        aria-current={active ? "page" : undefined}
        className={
          vertical
            ? `flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-semibold tracking-tight transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`
            : `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-tight transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`
        }
      >
        <Icon size={12} strokeWidth={2.25} />
        <span>{t.label}</span>
      </button>
    );
  };

  const screens = (
    <>
      {activeId === "projects" && (
        <PortalProjectsScreen
          projects={projects}
          files={files}
          clientOptions={clientOptions}
          onAdd={addProject}
          onUpdate={updateProject}
          onDelete={deleteProject}
          onToggleMilestone={toggleMilestone}
          onAddMilestone={addMilestone}
          onDeleteMilestone={deleteMilestone}
          onSetProgress={setProgress}
        />
      )}
      {activeId === "files" && (
        <PortalFilesScreen
          files={files}
          projects={projects}
          onAdd={addFile}
          onDelete={deleteFile}
        />
      )}
      {activeId === "invoices" && (
        <PortalInvoicesScreen
          invoices={invoices}
          clientOptions={clientOptions}
          onAdd={addInvoice}
          onCycle={cycleInvoice}
          onDelete={deleteInvoice}
        />
      )}
      {activeId === "updates" && (
        <FeedScreen theme={theme} notes={updates} onAddNote={addUpdate} />
      )}
    </>
  );

  if (device === "laptop") {
    return (
      <div className="flex h-full select-none bg-[#f4f4f6] text-ink">
        {/* left sidebar */}
        <aside className="flex w-[96px] shrink-0 flex-col border-r border-black/5 bg-white px-2 py-3">
          <p className="px-1 pb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            Portal
          </p>
          <nav className="space-y-1" aria-label="App sections">
            {TABS.map((t) => tabButton(t, true))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-0">{screens}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full select-none flex-col bg-[#f4f4f6] text-ink">
      {header}
      <nav
        className="flex shrink-0 items-center gap-1 border-b border-black/5 px-3 pb-2"
        aria-label="App sections"
      >
        {TABS.map((t) => tabButton(t, false))}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">{screens}</div>
    </div>
  );
}