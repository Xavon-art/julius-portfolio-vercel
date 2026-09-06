/* ------------------------------------------------------------------
   EntityScreen — the primary list with full CRUD.
   ------------------------------------------------------------------
   Generic across the three themes. Renders the project's main entity
   (jobs / stock items / projects) as tappable cards:
     • "+ New …" dashed trigger opens the inline add form
     • each card expands for full details (location, contact, log)
     • a pencil opens the inline edit form (pre-filled)
     • a trash asks for inline confirmation before removing
     • the status pill cycles the theme's ladder; the expanded panel
       also offers a manual status menu
     • adding/removing animates with the site's ease-apple curve
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { JobRow, PillTone } from "@/lib/projects";
import type { DemoTheme, EntityKey } from "./theme";
import { Avatar, ConfirmRow, DashedAction, EmptyState, Pill, EASE } from "./primitives";

export type EntityInput = {
  id: string;
  title: string;
  sub: string;
  eta: string;
  member?: string;
  qty?: number;
  threshold?: number;
};

interface EntityScreenProps {
  theme: DemoTheme;
  rows: JobRow[];
  memberOptions: string[];
  onAdd: (row: EntityInput) => void;
  onUpdate: (id: string, patch: Partial<JobRow>) => void;
  onDelete: (id: string) => void;
  onCycle: (id: string) => void;
  onSetStatus: (id: string, status: string, tone: PillTone) => void;
}

type Draft = Record<EntityKey, string>;

function emptyDraftK(fields: { key: EntityKey }[]): Draft {
  const out = {} as Draft;
  for (const f of fields) out[f.key] = "";
  return out;
}

export function EntityScreen({
  theme,
  rows,
  memberOptions,
  onAdd,
  onUpdate,
  onDelete,
  onCycle,
  onSetStatus,
}: EntityScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraftK(theme.fields));

  const fieldLabel = (key: EntityKey) =>
    theme.fields.find((f) => f.key === key)?.label ?? "";

  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraftK(theme.fields));
    setFormOpen(true);
  };

  const openEdit = (row: JobRow) => {
    setEditingId(row.id);
    setDraft({
      title: row.title ?? "",
      sub: row.sub ?? "",
      eta: row.eta ?? "",
      member: row.member ?? "",
      qty: row.qty !== undefined ? String(row.qty) : "",
      threshold: row.threshold !== undefined ? String(row.threshold) : "",
    });
    setFormOpen(true);
  };

  const setField = (key: EntityKey, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submitForm = () => {
    const patch: EntityInput = {
      id: editingId ?? `new-${Date.now()}`,
      title: draft.title.trim(),
      sub: draft.sub.trim(),
      eta: draft.eta.trim(),
      member: draft.member.trim() || undefined,
      qty: draft.qty.trim() ? Number.parseInt(draft.qty, 10) : undefined,
      threshold: draft.threshold.trim()
        ? Number.parseInt(draft.threshold, 10)
        : undefined,
    };
    if (!patch.title) return;
    if (editingId) onUpdate(editingId, patch);
    else onAdd(patch);
    setFormOpen(false);
    setEditingId(null);
  };

  const isStock = (row: JobRow) => row.qty !== undefined;

  return (
    <div className="space-y-2">
      {!formOpen && (
        <DashedAction label={theme.newButton} onClick={openAdd} />
      )}

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="entity-form"
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
              {editingId ? theme.editTitle : theme.addTitle}
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {theme.fields.map((field) => (
                <label
                  key={field.key}
                  className={field.grow ? "col-span-2" : "col-span-1"}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                    {field.label}
                  </span>
                  {field.kind === "select" ? (
                    <select
                      value={draft[field.key]}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                    >
                      <option value="">Unassigned</option>
                      {memberOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.kind}
                      value={draft[field.key]}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                    />
                  )}
                </label>
              ))}
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
                disabled={!draft.title.trim()}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
              >
                {editingId ? "Save changes" : "Add"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {rows.length === 0 && (
        <EmptyState text={theme.emptyEntity} />
      )}

      <AnimatePresence initial={false}>
        {rows.map((row) => {
          const expanded = expandedId === row.id;
          const confirming = confirmId === row.id;
          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full cursor-pointer rounded-2xl bg-white p-3 text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.99]"
              onClick={() => setExpandedId(expanded ? null : row.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {row.highlighted && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                    )}
                    <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                      {row.title}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                    {row.sub}
                  </p>
                </div>
                {theme.canCycleStatus ? (
                  <Pill
                    tone={row.tone}
                    asButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onCycle(row.id);
                    }}
                    ariaLabel={`Status: ${row.status}. Tap to advance`}
                  >
                    {row.status}
                  </Pill>
                ) : (
                  <Pill tone={row.tone}>{row.status}</Pill>
                )}
              </div>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {row.eta}
              </p>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2 border-t border-black/5 pt-2.5">
                    <DetailRow label={fieldLabel("sub")} value={row.sub} />
                    {isStock(row) ? (
                      <>
                        <DetailRow
                          label={fieldLabel("qty")}
                          value={String(row.qty ?? 0)}
                        />
                        <DetailRow
                          label={fieldLabel("threshold")}
                          value={String(row.threshold ?? 0)}
                        />
                      </>
                    ) : (
                      <DetailRow label={fieldLabel("eta")} value={row.eta} />
                    )}
                    {row.member && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          {fieldLabel("member")}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                          <Avatar name={row.member} size={18} />
                          {row.member}
                        </span>
                      </div>
                    )}

                    {row.history && row.history.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          Log
                        </p>
                        {row.history.map((entry) => (
                          <div
                            key={`${entry.at}-${entry.text}`}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-0.5 shrink-0 rounded bg-ink/5 px-1 py-px text-[9px] font-semibold tabular-nums text-ink-faint">
                              {entry.at}
                            </span>
                            <p className="text-[11px] leading-snug text-ink-soft">
                              {entry.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {theme.canCycleStatus && (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          Set status
                        </span>
                        {theme.statusLadder.map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetStatus(row.id, s.label, s.tone);
                            }}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-tight transition-colors ${
                              s.label === row.status
                                ? "bg-ink text-white"
                                : "ring-1 ring-ink/15 text-ink-soft hover:ring-ink/40 hover:text-ink"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="pt-0.5">
                      {confirming ? (
                        <ConfirmRow
                          text={theme.removeConfirm}
                          confirmLabel="Remove"
                          onConfirm={() => {
                            onDelete(row.id);
                            setConfirmId(null);
                            setExpandedId(null);
                          }}
                          onCancel={() => setConfirmId(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 border-t border-black/5 pt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(row);
                            }}
                            className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmId(row.id);
                            }}
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </span>
      <span className="truncate text-[11px] font-semibold text-ink">{value}</span>
    </div>
  );
}