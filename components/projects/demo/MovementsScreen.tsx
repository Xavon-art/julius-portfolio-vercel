/* ------------------------------------------------------------------
   MovementsScreen — the Activity / Movement log tab of the inventory
   demo.
   ------------------------------------------------------------------
   A time-ordered feed of stock movement: "+20 units added to …" /
   "−5 units shipped from …". A small composer (item, quantity change,
   bin) writes a new entry to the top with a "just now" stamp and a
   slide-in — the same shape every movement takes in the real product.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { DemoMoveRow } from "@/lib/projects";
import { EASE } from "./primitives";

interface MovementsScreenProps {
  movements: DemoMoveRow[];
  itemOptions: string[];
  binOptions: string[];
  onAdd: (delta: number, ref: string, bin: string) => void;
}

export function MovementsScreen({
  movements,
  itemOptions,
  binOptions,
  onAdd,
}: MovementsScreenProps) {
  const [ref, setRef] = useState("");
  const [delta, setDelta] = useState("");
  const [bin, setBin] = useState("");

  const qty = delta.trim() ? Number.parseInt(delta.trim(), 10) : Number.NaN;
  const canSubmit = !!ref && !!bin && !Number.isNaN(qty) && qty !== 0;

  const submit = () => {
    if (!canSubmit) return;
    onAdd(qty, ref, bin);
    setDelta("");
  };

  const selectBase =
    "mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30";

  return (
    <div className="flex h-full flex-col">
      <p className="mb-2 text-[10px] leading-relaxed text-ink-faint">
        Every unit added or shipped, timestamped — even the manual ones.
      </p>

      <div className="min-h-0 flex-1 space-y-2">
        {movements.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center">
            <p className="text-[12px] leading-relaxed text-ink-faint">
              No movements yet — log the first one below.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {movements.map((movement) => (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="rounded-2xl bg-white p-3 ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0 truncate text-[11px] font-semibold tracking-tight text-ink">
                  {movement.delta > 0 ? "+" : ""}
                  {movement.delta} units{" "}
                  {movement.delta > 0 ? "added to" : "shipped from"}
                </p>
                <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {movement.time === "now" ? "just now" : movement.time}
                </p>
              </div>
              <p className="mt-1 truncate text-[11px] leading-relaxed text-ink-soft">
                {movement.ref} · {movement.bin}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-2 space-y-1.5 rounded-2xl bg-white p-2 ring-1 ring-black/5">
        <div className="flex items-center gap-1.5">
          <select
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className={selectBase}
          >
            <option value="">Item…</option>
            {itemOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Qty"
            className="w-16 shrink-0 rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
          />
          <button
            type="button"
            aria-label="Log movement"
            disabled={!canSubmit}
            onClick={submit}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>
        <select
          value={bin}
          onChange={(e) => setBin(e.target.value)}
          className={selectBase}
        >
          <option value="">Bin…</option>
          {binOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}