"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatEUR, formatDate } from "@/lib/format";
import { exportToCSV } from "@/lib/csv-export";

type Artist = { id: string; name: string };
type Release = { id: string; title: string; label_percent: number };
type Entry = any;

export default function SettlementView({
  artists,
  selectedArtistId,
  selectedArtistName,
  from,
  to,
  releases,
  entries,
}: {
  artists: Artist[];
  selectedArtistId: string;
  selectedArtistName: string;
  from: string;
  to: string;
  releases: Release[];
  entries: Entry[];
}) {
  const router = useRouter();

  function updateParams(next: Partial<{ artistId: string; from: string; to: string }>) {
    const params = new URLSearchParams({
      artistId: next.artistId ?? selectedArtistId,
      from: next.from ?? from,
      to: next.to ?? to,
    });
    router.push(`/dashboard/afrekening?${params.toString()}`);
  }

  const income = entries.filter((e) => e.kind === "income");
  const costs = entries.filter((e) => e.kind === "adjustment" && e.type === "cost");
  const advances = entries.filter((e) => e.kind === "adjustment" && e.type === "advance");

  const totalGross = income.reduce((s, e) => s + Number(e.gross_amount), 0);
  const totalLabel = income.reduce((s, e) => s + Number(e.label_amount), 0);
  const totalArtistGross = income.reduce((s, e) => s + Number(e.artist_amount), 0);
  const totalCosts = costs.reduce((s, e) => s + Number(e.amount), 0);
  const totalAdvances = advances.reduce((s, e) => s + Number(e.amount), 0);
  const netToArtist = Math.max(totalArtistGross - totalCosts - totalAdvances, 0);

  const releaseTitle = (id: string) => releases.find((r) => r.id === id)?.title ?? "";

  function handleExport() {
    exportToCSV(
      `afrekening-${selectedArtistName}-${from}-${to}`,
      income.map((e) => ({
        Datum: e.entry_date,
        Platform: e.platform,
        Titel: releaseTitle(e.release_id),
        "Bruto bedrag": e.gross_amount,
        "Label %": e.label_percent,
        "Artiest bedrag": e.artist_amount,
      }))
    );
  }

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="no-print mb-7 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Afrekening</h1>
            <p className="text-muted text-[13px] mt-0.5">
              Kies een artiest en periode voor een net overzicht om te printen of te delen
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="text-[13px] font-medium bg-surface border border-line px-4 py-2 rounded-lg hover:bg-surfaceHover transition"
            >
              Exporteren (CSV)
            </button>
            <button
              onClick={() => window.print()}
              className="text-[13px] font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition"
            >
              Printen / PDF
            </button>
          </div>
        </header>

        <div className="no-print bg-surface rounded-xl2 shadow-card p-6 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Artiest</label>
            <ArtistCombobox
              artists={artists}
              selectedArtistId={selectedArtistId}
              selectedArtistName={selectedArtistName}
              onSelect={(artistId) => updateParams({ artistId })}
            />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Periode van</label>
            <input
              type="date"
              value={from}
              onChange={(e) => updateParams({ from: e.target.value })}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Periode t/m</label>
            <input
              type="date"
              value={to}
              onChange={(e) => updateParams({ to: e.target.value })}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
        </div>

        {/* Printbaar overzicht */}
        <div className="bg-surface rounded-xl2 shadow-card p-8">
          <div className="flex items-center justify-between mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Artiestenportaal.nl"
              className="hidden print:block h-8 w-auto"
            />
            <span className="text-[12px] text-muted ml-auto">
              {formatDate(from)} — {formatDate(to)}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-ink tracking-tight
