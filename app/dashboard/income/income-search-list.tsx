"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatEUR, formatDate } from "@/lib/format";
import { exportToCSV } from "@/lib/csv-export";

type Entry = {
  id: string;
  entry_date: string;
  platform: string;
  gross_amount: number;
  release_id: string;
  releases: { title: string; artists: { name: string } | null } | null;
};

export default function IncomeSearchList({ income }: { income: Entry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return income;
    return income.filter((e) => {
      const year = e.entry_date ? new Date(e.entry_date).getFullYear().toString() : "";
      const dateFormatted = e.entry_date ? formatDate(e.entry_date).toLowerCase() : "";
      const haystack = [e.releases?.title, e.releases?.artists?.name, e.platform, year, dateFormatted]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [income, query]);

  function handleExport() {
    exportToCSV(
      "inkomsten",
      filtered.map((e) => ({
        Datum: e.entry_date,
        Platform: e.platform,
        Titel: e.releases?.title ?? "",
        Artiest: e.releases?.artists?.name ?? "",
        "Bruto bedrag": e.gross_amount,
      }))
    );
  }

  return (
    <>
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op artiest, titel, platform, jaar of datum…"
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition shadow-card"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[12px]"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="text-[13px] font-medium bg-surface border border-line px-3.5 py-2.5 rounded-lg hover:bg-surfaceHover transition disabled:opacity-40 shrink-0"
        >
          Exporteren
        </button>
      </div>

      <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden mt-3">
        {income.length === 0 && (
          <p className="text-muted text-[13px] p-8 text-center">Nog geen boekingen.</p>
        )}
        {income.length > 0 && filtered.length === 0 && (
          <p className="text-muted text-[13px] p-8 text-center">Niks gevonden.</p>
        )}
        {filtered.map((e) => (
          <Link
            key={e.id}
            href={`/dashboard/releases/${e.release_id}`}
            className="flex items-center justify-between px-6 py-3.5 hover:bg-surfaceHover transition text-[13px]"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 bg-accentSoft text-accent">
                {e.platform}
              </span>
              <span className="text-ink font-medium">{e.releases?.title}</span>
              <span className="text-muted"> &middot; {e.releases?.artists?.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <span className="text-muted">{formatDate(e.entry_date)}</span>
              <span className="font-mono text-ink">{formatEUR(e.gross_amount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
