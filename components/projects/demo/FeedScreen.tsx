/* ------------------------------------------------------------------
   FeedScreen — the notes / alerts / messages tab.
   ------------------------------------------------------------------
   A time-ordered feed. Typing a line and hitting the + appends it to
   the top with a "just now" stamp and a slide-in animation — the same
   shape every report/alert/inbox entry takes in the real product.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { NotesRow } from "@/lib/projects";
import type { DemoTheme } from "./theme";
import { EASE } from "./primitives";

interface FeedScreenProps {
  theme: DemoTheme;
  notes: NotesRow[];
  onAddNote: (body: string) => void;
}

export function FeedScreen({ notes, onAddNote }: FeedScreenProps) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    onAddNote(body);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 space-y-2">
        {notes.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center">
            <p className="text-[12px] leading-relaxed text-ink-faint">
              Nothing logged yet — the feed starts when you do.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="rounded-2xl bg-white p-3 ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-tight text-ink">
                  {note.author}
                </p>
                <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {note.time === "now" ? "just now" : note.time}
                </p>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                {note.body}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white p-2 ring-1 ring-black/5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Type a note…"
          className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint"
        />
        <button
          type="button"
          aria-label="Add note"
          disabled={!draft.trim()}
          onClick={submit}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}