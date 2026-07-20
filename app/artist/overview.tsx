"use client";

import { useMemo, useState } from "react";
import ReleaseCard from "./release-card";

const STATUS_LABEL: Record<string, string> = {
  niet_gestart: "Nog niet gestart",
  in_onderhandeling: "In onderhandeling",
  getekend: "Getekend",
};

const STATUS_STYLE: Record<string, string> = {
  niet_gestart: "bg-line/60 text-muted",
  in_onderhandeling: "bg-amber-500/15 text-amber-400",
  getekend: "bg-green-500/15 text-green-400",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

function defaultFrom() {
  const d = new Date();
  return `${d.getFullYear()}-01-01`;
}
function defaultTo() {
  const d = new Date();
  return `${d.getFullYear()}-12-31`;
}

export default function ArtistOverview({
  artistName,
  contractStatus,
  contractNotes,
  releases,
}: {
  artistName?: string;
  contractStatus: string;
  contractNotes?: string | null;
  releases: any[];
}) {
  const [from, setFrom] = useState(defaultFrom());
  const [to, setTo] = useState(defaultTo());

  const filteredReleases = useMemo(() => {
    return releases.map((r) => ({
      ...r,
      entries: (r.entries ?? []).filter(
        (e: any) => !e.entry_date || (e.entry_date >= from && e.entry_date <= to)
      ),
    }));
  }, [releases, from, to]);

  const allFilteredEntries = filteredReleases.flatMap((r) => r.entries);
  const totalIncome = allFilteredEntries
    .filter((e: any) => e.type === "income")
    .reduce((s: number, e: any) => s + Number(e.amount), 0);

  const byPlatform = new Map<string, number>();
  for (const e of allFilteredEntries) {
    if (e.type !== "income") continue;
    const key = e.platform || "Overig";
    byPlatform.set(key, (byPlatform.get(key) ?? 0) + Number(e.amount));
  }
  const platformRows = [...byPlatform.entries()].sort((a, b) => b[1] - a[1]);

  let totalYours = 0;
  for (const r of filteredReleases) {
    const income = r.entries
      .filter((e: any) => e.type === "income")
      .reduce((s: number, e: any) => s + Number(e.amount), 0);
    const costs = r.entries
      .filter((e: any) => e.type === "cost")
      .reduce((s: number, e: any) => s + Number(e.amount), 0);
    const advances = r.entries
      .filter((e: any) => e.type === "advance")
      .reduce((s: number, e: any) => s + Number(e.amount), 0);
    const net = income - costs;
    totalYours += Math.max(net * (r.artist_split / 100) - advances, 0);
  }

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
          <h1 className="text-[28px] font-semibold text-ink tracking-tight">
            {artistName ? `Hoi ${artistName}` : "Mijn releases"}
          </h1>
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[contractStatus]}`}
          >
            Contract: {STATUS_LABEL[contractStatus]}
          </span>
        </div>
        <p className="text-muted text-[13px] mb-1">Jouw verdiensten per release</p>
        {contractNotes && (
          <p className="text-muted text-[12px] mb-6 leading-relaxed">{contractNotes}</p>
        )}
        {!contractNotes && <div className="mb-6" />}

        {/* Periode + samenvatting */}
        <div className="bg-surface rounded-xl2 shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <span className="text-[11px] font-medium text-muted tracking-wide">PERIODE</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[12.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
              <span className="text-muted text-[12px]">t/m</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[12.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[11px] text-muted">Totale omzet in periode</div>
              <div className="text-[20px] font-semibold text-ink tracking-tight">
                {fmt(totalIncome)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted">Jouw deel (netto)</div>
              <div className="text-[20px] font-semibold text-accent tracking-tight">
                {fmt(totalYours)}
              </div>
            </div>
          </div>

          {platformRows.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-muted tracking-wide mb-2">
                PER PLATFORM
              </div>
              <div className="flex flex-col gap-1.5">
                {platformRows.map(([platform, amount]) => (
                  <div key={platform} className="flex justify-between text-[12.5px]">
                    <span className="text-ink">{platform}</span>
                    <span className="text-muted font-mono">{fmt(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {filteredReleases.length === 0 && (
            <div className="p-10 text-center bg-surface rounded-xl2 shadow-card">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-line mx-auto mb-3" />
              <p className="text-muted text-[13px]">
                Nog geen releases gekoppeld aan jouw account.
              </p>
            </div>
          )}

          {filteredReleases.map((r) => (
            <ReleaseCard key={r.id} release={r} />
          ))}
        </div>
      </div>
    </main>
  );
}
