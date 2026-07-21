"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatEUR, formatDate } from "@/lib/format";

type IncomeEntry = {
  id: string;
  entry_date: string;
  platform: string;
  gross_amount: number;
  label_amount: number;
  artist_amount: number;
  label_percent: number;
  notes: string | null;
};

type AdjustmentEntry = {
  id: string;
  entry_date: string;
  type: "cost" | "advance";
  amount: number;
  description: string | null;
};

export default function EntryRow({
  kind,
  entry,
}: {
  kind: "income" | "adjustment";
  entry: IncomeEntry | AdjustmentEntry;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Deze boeking verwijderen?")) return;
    setDeleting(true);
    const endpoint = kind === "income" ? "/api/income" : "/api/adjustments";
    await fetch(`${endpoint}?id=${entry.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (kind === "income") {
    const e = entry as IncomeEntry;
    return (
      <div className="group flex items-center justify-between px-6 py-3.5 text-sm">
        <div className="min-w-0">
          <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 bg-accentSoft text-accent">
            {e.platform}
          </span>
          <span className="text-ink">{formatDate(e.entry_date)}</span>
          {e.notes && <span className="text-muted"> &middot; {e.notes}</span>}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-[11px] text-muted font-mono">{e.label_percent}% label</span>
          <span className="font-mono text-ink">{formatEUR(e.gross_amount)}</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 text-danger text-[12px] transition disabled:opacity-50"
          >
            Verwijderen
          </button>
        </div>
      </div>
    );
  }

  const a = entry as AdjustmentEntry;
  return (
    <div className="group flex items-center justify-between px-6 py-3.5 text-sm">
      <div className="min-w-0">
        <span
          className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 ${
            a.type === "cost" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {a.type === "cost" ? "Kosten" : "Voorschot"}
        </span>
        <span className="text-ink">{formatDate(a.entry_date)}</span>
        {a.description && <span className="text-muted"> &middot; {a.description}</span>}
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="font-mono text-ink">{formatEUR(a.amount)}</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 text-danger text-[12px] transition disabled:opacity-50"
        >
          Verwijderen
        </button>
      </div>
    </div>
  );
}
