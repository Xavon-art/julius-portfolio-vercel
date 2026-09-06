/* ------------------------------------------------------------------
   PortalFilesScreen — the Files tab of the Client Portal demo.
   ------------------------------------------------------------------
   A file list where every row shows a type icon (PDF / DOCX / PNG /
   XLSX), the uploader, the upload date, and which project it's linked
   to. "+ Upload File" is a simulated upload — pick a fake extension
   and optionally associate the file with a project; that link is
   reflected back in the Projects tab's "Linked files" section.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { PortalFileKind, PortalFileRow, PortalProjectRow } from "@/lib/projects";
import { KIND_META } from "./portal";
import { ConfirmRow, DashedAction, EmptyState, EASE } from "./primitives";

export type FileInput = {
  name: string;
  kind: PortalFileKind;
  projectId?: string;
};

interface PortalFilesScreenProps {
  files: PortalFileRow[];
  projects: PortalProjectRow[];
  onAdd: (input: FileInput) => void;
  onDelete: (id: string) => void;
}

const KIND_OPTIONS: PortalFileKind[] = ["pdf", "docx", "png", "xlsx"];

export function PortalFilesScreen({ files, projects, onAdd, onDelete }: PortalFilesScreenProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; kind: PortalFileKind; projectId: string }>({
    name: "",
    kind: "pdf",
    projectId: "",
  });

  const nameOf = (id?: string) => projects.find((p) => p.id === id)?.name;

  const submit = () => {
    if (!draft.name.trim()) return;
    onAdd({
      name: draft.name.trim(),
      kind: draft.kind,
      projectId: draft.projectId || undefined,
    });
    setDraft({ name: "", kind: "pdf", projectId: "" });
    setFormOpen(false);
  };

  return (
    <div className="space-y-2">
      {!formOpen && <DashedAction label="Upload File" onClick={() => setFormOpen(true)} />}

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="file-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="rounded-2xl bg-white p-3 ring-1 ring-black/10"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-tight text-ink">
              Simulated upload
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <label className="col-span-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  File name
                </span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Contract-draft.pdf"
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                />
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Type
                </span>
                <select
                  value={draft.kind}
                  onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value as PortalFileKind }))}
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                >
                  {KIND_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {KIND_META[k].label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Project
                </span>
                <select
                  value={draft.projectId}
                  onChange={(e) => setDraft((d) => ({ ...d, projectId: e.target.value }))}
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                >
                  <option value="">Unlinked</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!draft.name.trim()}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
              >
                Upload
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {files.length === 0 && (
        <EmptyState text="No files yet — upload the first one to see it here." />
      )}

      <AnimatePresence initial={false}>
        {files.map((file) => {
          const Meta = KIND_META[file.kind];
          const projectName = nameOf(file.projectId);
          const confirming = confirmId === file.id;
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full rounded-2xl bg-white p-3 ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink">
                  <Meta.icon size={16} strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                    {file.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                    {file.by} · {file.uploaded}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => setConfirmId(file.id)}
                  className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-ink-soft">
                {projectName ? `Linked to ${projectName}` : "Unlinked"}
              </p>

              {confirming && (
                <div className="mt-1.5">
                  <ConfirmRow
                    text="Remove this file?"
                    confirmLabel="Remove"
                    onConfirm={() => {
                      onDelete(file.id);
                      setConfirmId(null);
                    }}
                    onCancel={() => setConfirmId(null)}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}