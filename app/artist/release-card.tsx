"use client";

import { useState } from "react";

const TYPE_LABEL: Record<string, string> = {
  income: "Inkomsten",
  cost: "Kosten",
  advance: "Voorschot",
};

const TYPE_STYLE: Record<string, string> = {
  income: "bg-green-50 text-green-700",
  cost: "bg-red-50 text-red-700",
  advance: "bg-amber-50 text-amber-700",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

export default function ReleaseCard({ release }: { release: any }) {
  const [open, setOpen] = useState(false);

  const entries = release.entries ?? [];
  const income = entries
    .filter((e: any) => e.type === "income")
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const costs = entries
    .filter((e: any) => e.type === "cost")
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const advances = entries
    .filter((e: any) => e.type === "advance")
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const net = income - costs;
  const yours = Math.max(net * (release.artist_split / 100) - advances, 0);

  const sortedEntries = [...entries].sort((a, b) =>
    (b.entry_date ?? "").localeCompare(a.entry_date ?? "")
  );

  return (
    <div className="bg-surface rounded-xl2 shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-6 hover:bg-canvas/40 transition-colors duration-100"
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-ink">{release.title}</span>
          <span className="text-[11.5px] font-mono text-artist">
            {release.artist_split}% jouw deel
          </span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <div className="text-[30px] font-semibold text-ink tracking-tight">{fmt(yours)}</div>
            <div className="text-[11.5px] text-muted mt-0.5">te ontvangen</div>
          </div>
          <span
            className={`text-muted text-[12px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-line divide-y divide-line">
          {sortedEntries.length === 0 && (
            <p className="text-muted text-[12.5px] p-5 text-center">Nog geen boekingen.</p>
          )}
          {sortedEntries.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between px-6 py-3 text-[13px]">
              <div className="min-w-0">
                <span
                  className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 ${TYPE_STYLE[e.type]}`}
                >
                  {TYPE_LABEL[e.type]}
                </span>
                <span className="text-ink">{e.description || "—"}</span>
                {e.entry_date && (
                  <span className="text-muted ml-2 text-[11px]">{e.entry_date}</span>
                )}
              </div>
              <span className="font-mono text-ink flex-shrink-0">
                {fmt(Number(e.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
