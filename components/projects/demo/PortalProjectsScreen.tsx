/* ------------------------------------------------------------------
   PortalProjectsScreen — the Projects tab of the Client Portal demo.
   ------------------------------------------------------------------
   The most complex screen in the site's demos:
     • "+ New Project" inline form (name, client, status, due) — the
       cover thumbnail auto-assigns from a rotating stock-pool seed.
     • Expanding a project reveals a progress bar + draggable slider,
       a nested milestone list (add / check off / remove — checking a
       milestone drives the parent's progress), the linked files, and
       a mini activity feed for that project.
     • Edit (re-opens the form pre-filled) and remove (inline confirm).
   All animations use the shared ease-apple curve.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import type { PortalProjectRow, PortalFileRow, PillTone } from "@/lib/projects";
import { ConfirmRow, DashedAction, EmptyState, EASE, Pill } from "./primitives";
import { avatarUrl, coverUrl } from "./portal";

export type ProjectInput = {
  name: string;
  client: string;
  status: string;
  due: string;
};

const STATUS_OPTIONS = ["Queued", "Active", "In review", "On track", "Complete"];
const COVER_SEEDS = ["cov1", "cov2", "cov3", "cov4", "cov5"];

interface PortalProjectsScreenProps {
  projects: PortalProjectRow[];
  files: PortalFileRow[];
  clientOptions: string[];
  onAdd: (input: ProjectInput) => void;
  onUpdate: (id: string, patch: Partial<PortalProjectRow>) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
  onAddMilestone: (projectId: string, label: string) => void;
  onDeleteMilestone: (projectId: string, milestoneId: string) => void;
  onSetProgress: (projectId: string, value: number) => void;
}

export function PortalProjectsScreen({
  projects,
  files,
  clientOptions,
  onAdd,
  onUpdate,
  onDelete,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onSetProgress,
}: PortalProjectsScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectInput>({
    name: "",
    client: "",
    status: "Queued",
    due: "",
  });
  const [milestoneDraft, setMilestoneDraft] = useState("");

  const allClients = [...new Set([...clientOptions, ...projects.map((p) => p.client)])];

  const openAdd = () => {
    setEditingId(null);
    setDraft({ name: "", client: "", status: "Queued", due: "" });
    setFormOpen(true);
  };

  const openEdit = (row: PortalProjectRow) => {
    setEditingId(row.id);
    setDraft({ name: row.name, client: row.client, status: row.status, due: row.due });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!draft.name.trim()) return;
    if (editingId) {
      onUpdate(editingId, {
        name: draft.name.trim(),
        client: draft.client.trim(),
        status: draft.status,
        due: draft.due.trim(),
      });
    } else {
      onAdd({
        name: draft.name.trim(),
        client: draft.client.trim(),
        status: draft.status,
        due: draft.due.trim(),
      });
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const addMilestone = (projectId: string) => {
    const label = milestoneDraft.trim();
    if (!label) return;
    onAddMilestone(projectId, label);
    setMilestoneDraft("");
  };

  return (
    <div className="space-y-2">
      {!formOpen && <DashedAction label="New Project" onClick={openAdd} />}

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="project-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
            className="rounded-2xl bg-white p-3 ring-1 ring-black/10"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-tight text-ink">
              {editingId ? "Edit project" : "Add a project"}
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <label className="col-span-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Project name
                </span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Website Redesign"
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                />
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Client
                </span>
                <select
                  value={draft.client}
                  onChange={(e) => setDraft((d) => ({ ...d, client: e.target.value }))}
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                >
                  <option value="">Choose…</option>
                  {allClients.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Status
                </span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Due date
                </span>
                <input
                  value={draft.due}
                  onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))}
                  placeholder="e.g. Due Nov 12"
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                />
              </label>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!draft.name.trim()}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
              >
                {editingId ? "Save changes" : "Add"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {projects.length === 0 && (
        <EmptyState text="No projects yet — add the first one with + New Project." />
      )}

      <AnimatePresence initial={false}>
        {projects.map((project) => {
          const expanded = expandedId === project.id;
          const confirming = confirmId === project.id;
          const linkedFiles = files.filter((f) => f.projectId === project.id);
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.99]"
              onClick={() => setExpandedId(expanded ? null : project.id)}
            >
              {!formOpen && (
                <img
                  src={coverUrl(project.cover)}
                  alt=""
                  loading="lazy"
                  className="h-24 w-full object-cover"
                />
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                      {project.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                      {project.due}
                    </p>
                  </div>
                  <Pill tone={project.tone}>{project.status}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <img
                    src={avatarUrl(project.client)}
                    alt=""
                    loading="lazy"
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <p className="min-w-0 truncate text-[11px] font-semibold text-ink-soft">
                    {project.client}
                  </p>
                </div>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2.5 border-t border-black/5 pt-2.5">
                      {/* progress */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                            Progress
                          </span>
                          <span className="text-[11px] font-bold tabular-nums text-ink">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            className="h-full rounded-full bg-ink"
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 0.3, ease: EASE }}
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={project.progress}
                          onChange={(e) =>
                            onSetProgress(project.id, Number.parseInt(e.target.value, 10))
                          }
                          aria-label="Progress"
                          className="mt-1.5 w-full accent-ink"
                        />
                      </div>

                      {/* milestones */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          Milestones
                        </p>
                        <div className="mt-1.5 space-y-1">
                          {project.milestones.map((ms) => (
                            <div key={ms.id} className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-label={ms.done ? "Mark incomplete" : "Mark complete"}
                                onClick={() => onToggleMilestone(project.id, ms.id)}
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                                  ms.done ? "bg-ink text-white" : "ring-1 ring-ink/25 hover:ring-ink/50"
                                }`}
                              >
                                {ms.done && <Check size={10} strokeWidth={3} />}
                              </button>
                              <span
                                className={`min-w-0 flex-1 truncate text-[11px] font-medium ${
                                  ms.done ? "text-ink-faint line-through" : "text-ink"
                                }`}
                              >
                                {ms.label}
                              </span>
                              <button
                                type="button"
                                aria-label="Remove milestone"
                                onClick={() => onDeleteMilestone(project.id, ms.id)}
                                className="shrink-0 rounded-full p-1 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <input
                            value={milestoneDraft}
                            onChange={(e) => setMilestoneDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addMilestone(project.id);
                            }}
                            placeholder="Add a milestone…"
                            className="min-w-0 flex-1 rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                          />
                          <button
                            type="button"
                            aria-label="Add milestone"
                            onClick={() => addMilestone(project.id)}
                            disabled={!milestoneDraft.trim()}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* linked files */}
                      {linkedFiles.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                            Linked files
                          </p>
                          <div className="mt-1 space-y-1">
                            {linkedFiles.map((file) => (
                              <p key={file.id} className="truncate text-[11px] font-semibold text-ink">
                                · {file.name}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* mini activity feed */}
                      {project.feed.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                            Activity
                          </p>
                          <div className="mt-1 space-y-1.5">
                            {project.feed.map((entry, i) => (
                              <div key={`${entry.time}-${i}`} className="flex items-start gap-2">
                                <span className="mt-0.5 shrink-0 rounded bg-ink/5 px-1 py-px text-[9px] font-semibold tabular-nums text-ink-faint">
                                  {entry.time === "now" ? "now" : entry.time}
                                </span>
                                <p className="text-[11px] leading-snug text-ink-soft">
                                  {entry.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div onClick={(e) => e.stopPropagation()}>
                        {confirming ? (
                          <ConfirmRow
                            text="Remove this project?"
                            confirmLabel="Remove"
                            onConfirm={() => {
                              onDelete(project.id);
                              setConfirmId(null);
                              setExpandedId(null);
                            }}
                            onCancel={() => setConfirmId(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 border-t border-black/5 pt-2.5">
                            <button
                              type="button"
                              onClick={() => openEdit(project)}
                              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                            >
                              <Pencil size={11} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(project.id)}
                              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                            >
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export const STATUS_TONES: Record<string, PillTone> = {
  Queued: "outline",
  Active: "soft",
  "In review": "outline",
  "On track": "soft",
  Complete: "solid",
};

export const COVER_POOL = COVER_SEEDS;