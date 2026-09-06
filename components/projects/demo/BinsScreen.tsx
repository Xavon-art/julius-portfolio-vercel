/* ------------------------------------------------------------------
   BinsScreen — the Bins / Locations tab of the inventory demo.
   ------------------------------------------------------------------
   Maps the warehouse floor: every bin card shows its name and how
   many items live inside it. Expand a bin to see its contents, rename
   it inline, or add a brand-new bin. Removing a bin asks for inline
   confirmation — same monochrome, eased interactions as the rest.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { DemoBinRow } from "@/lib/projects";
import { ConfirmRow, DashedAction, EmptyState, EASE } from "./primitives";

interface BinsScreenProps {
  bins: DemoBinRow[];
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function BinsScreen({ bins, onAdd, onRename, onDelete }: BinsScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const submitAdd = () => {
    const name = draft.trim();
    if (!name) return;
    onAdd(name);
    setDraft("");
    setFormOpen(false);
  };

  const startRename = (bin: DemoBinRow) => {
    setRenameDraft(bin.name);
    setEditingId(bin.id);
  };

  const submitRename = (id: string) => {
    const name = renameDraft.trim();
    if (!name) return;
    onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] leading-relaxed text-ink-faint">
        Map your shelves — every bin and what lives inside it.
      </p>

      {!formOpen && (
        <DashedAction
          label="New Bin"
          onClick={() => {
            setEditingId(null);
            setFormOpen(true);
          }}
        />
      )}

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="bin-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            onSubmit={(e) => {
              e.preventDefault();
              submitAdd();
            }}
            className="rounded-2xl bg-white p-3 ring-1 ring-black/10"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-tight text-ink">
              Add a bin
            </p>
            <label className="block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Bin name
              </span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. Aisle 3 · Bin B13"
                className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
              />
            </label>
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setDraft("");
                }}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {bins.length === 0 && (
        <EmptyState text="No bins yet — add one to start mapping your shelves." />
      )}

      <AnimatePresence initial={false}>
        {bins.map((bin) => {
          const expanded = expandedId === bin.id;
          const confirming = confirmId === bin.id;
          const editing = editingId === bin.id;
          return (
            <motion.div
              key={bin.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full cursor-pointer rounded-2xl bg-white p-3 text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.99]"
              onClick={() => setExpandedId(expanded ? null : bin.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0 truncate text-[12px] font-semibold tracking-tight text-ink">
                  {bin.name}
                </p>
                <span className="shrink-0 text-[10px] font-semibold tabular-nums text-ink-faint">
                  {bin.items.length} {bin.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {editing && (
                <div onClick={(e) => e.stopPropagation()}>
                  <form
                    className="mt-3 flex items-center gap-1.5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitRename(bin.id);
                    }}
                  >
                    <input
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      className="min-w-0 flex-1 rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                    />
                    <button
                      type="submit"
                      disabled={!renameDraft.trim()}
                      className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:text-ink"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {!editing && expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-1.5 border-t border-black/5 pt-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                      Stored here
                    </p>
                    {bin.items.length > 0 ? (
                      bin.items.map((title) => (
                        <p
                          key={title}
                          className="truncate text-[11px] font-semibold text-ink"
                        >
                          · {title}
                        </p>
                      ))
                    ) : (
                      <p className="text-[11px] text-ink-faint">
                        This bin is empty — add stock to it.
                      </p>
                    )}

                    {confirming ? (
                      <ConfirmRow
                        text="Remove this bin?"
                        confirmLabel="Remove"
                        onConfirm={() => {
                          onDelete(bin.id);
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
                            startRename(bin);
                          }}
                          className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                        >
                          <Pencil size={11} /> Rename
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmId(bin.id);
                          }}
                          className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                        >
                          <Trash2 size={11} /> Remove
                        </button>
                      </div>
                    )}
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