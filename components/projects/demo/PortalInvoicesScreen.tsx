/* ------------------------------------------------------------------
   PortalInvoicesScreen — the Invoices tab of the Client Portal demo.
   ------------------------------------------------------------------
   Invoice rows show number, client, amount and due date. The status
   badge cycles Pending → Paid → Overdue on tap; the running "Total
   outstanding" (₱) recomputes live from Pending + Overdue invoices —
   the nested-state flex point. New invoices default to Pending, and
   any invoice can be removed with an inline confirm.
------------------------------------------------------------------ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { PortalInvoiceRow, PortalInvoiceStatus } from "@/lib/projects";
import { avatarUrl, peso } from "./portal";
import { ConfirmRow, DashedAction, EmptyState, EASE } from "./primitives";

export type InvoiceInput = {
  client: string;
  amount: number;
  due: string;
};

const STATUS_CLASS: Record<PortalInvoiceStatus, string> = {
  Paid: "bg-ink text-white",
  Pending: "ring-1 ring-ink/20 text-ink-soft",
  Overdue: "border border-dashed border-ink/40 text-ink",
};

interface PortalInvoicesScreenProps {
  invoices: PortalInvoiceRow[];
  clientOptions: string[];
  onAdd: (input: InvoiceInput) => void;
  onCycle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PortalInvoicesScreen({
  invoices,
  clientOptions,
  onAdd,
  onCycle,
  onDelete,
}: PortalInvoicesScreenProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ client: string; amount: string; due: string }>({
    client: "",
    amount: "",
    due: "",
  });

  const outstanding = invoices.reduce(
    (sum, inv) => (inv.status === "Paid" ? sum : sum + inv.amount),
    0,
  );

  const submit = () => {
    const amount = Number.parseInt(draft.amount.trim(), 10);
    if (!draft.client || Number.isNaN(amount) || amount <= 0) return;
    onAdd({ client: draft.client, amount, due: draft.due.trim() });
    setDraft({ client: "", amount: "", due: "" });
    setFormOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* running total */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
          Total outstanding
        </p>
        <p className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-ink">
          {peso(outstanding)}
        </p>
        <p className="mt-0.5 text-[10px] text-ink-faint">
          Updates live as invoices move between Pending, Paid, and Overdue.
        </p>
      </div>

      {!formOpen && <DashedAction label="New Invoice" onClick={() => setFormOpen(true)} />}

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="invoice-form"
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
              Add an invoice
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <label className="col-span-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Client
                </span>
                <select
                  value={draft.client}
                  onChange={(e) => setDraft((d) => ({ ...d, client: e.target.value }))}
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-ink/30"
                >
                  <option value="">Choose…</option>
                  {clientOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Amount (₱)
                </span>
                <input
                  type="number"
                  value={draft.amount}
                  onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
                  placeholder="e.g. 80000"
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                />
              </label>
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Due date
                </span>
                <input
                  value={draft.due}
                  onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))}
                  placeholder="e.g. Due Nov 30"
                  className="mt-0.5 w-full rounded-xl bg-[#f4f4f6] px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint focus:ring-1 focus:ring-ink/30"
                />
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
                disabled={!draft.client || !draft.amount.trim()}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {invoices.length === 0 && (
        <EmptyState text="No invoices yet — create the first one above." />
      )}

      <AnimatePresence initial={false}>
        {invoices.map((invoice) => {
          const confirming = confirmId === invoice.id;
          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full rounded-2xl bg-white p-3 ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={avatarUrl(invoice.client)}
                  alt=""
                  loading="lazy"
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                      {invoice.number}
                    </p>
                    <span className="text-[10px] text-ink-faint">{invoice.due}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                    {invoice.client} · {peso(invoice.amount)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Status: ${invoice.status}. Tap to change`}
                  onClick={() => onCycle(invoice.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-tight transition-colors active:scale-[0.95] ${STATUS_CLASS[invoice.status]}`}
                >
                  {invoice.status}
                </button>
                <button
                  type="button"
                  aria-label="Remove invoice"
                  onClick={() => setConfirmId(invoice.id)}
                  className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {confirming && (
                <div className="mt-1.5">
                  <ConfirmRow
                    text="Remove this invoice?"
                    confirmLabel="Remove"
                    onConfirm={() => {
                      onDelete(invoice.id);
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