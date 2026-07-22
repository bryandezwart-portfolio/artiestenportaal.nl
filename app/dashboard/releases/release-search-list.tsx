"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { exportToCSV } from "@/lib/csv-export";

type Release = {
  id: string;
  title: string;
  release_date: string | null;
  label_percent: number;
  distributor: string | null;
  isrc: string | null;
  upc: string | null;
  iswc: string | null;
  artists: { name: string } | null;
};

export default function ReleaseSearchList({ releases }: { releases: Release[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return releases;

    return releases.filter((r) => {
      const year = r.release_date ? new Date(r.release_date).getFullYear().toString() : "";
      const dateFormatted = r.release_date ? formatDate(r.release_date).toLowerCase() : "";
      const haystack = [
        r.title,
        r.artists?.name,
        r.distributor,
        r.isrc,
        r.upc,
        r.iswc,
        year,
        dateFormatted,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [releases, query]);

  function handleExport() {
    exportToCSV(
      "releases",
      filtered.map((r) => ({
        Titel: r.title,
        Artiest: r.artists?.name ?? "",
        Releasedatum: r.release_date ?? "",
        Distributeur: r.distributor ?? "",
        ISRC: r.isrc ?? "",
        UPC: r.upc ?? "",
        ISWC: r.iswc ?? "",
        "Label %": r.label_percent,
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
            placeholder="Zoek op artiest, titel, jaar, datum of code (ISRC/UPC/ISWC)…"
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

      {query && (
        <p className="text-[11.5px] text-muted mt-2 mb-0">
          {filtered.length} resultaat{filtered.length === 1 ? "" : "aten"} voor &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden mt-3">
        {filtered.length === 0 && (
          <p className="text-muted text-[13px] p-8 text-center">
            {query ? "Niks gevonden." : "Nog geen releases toegevoegd."}
          </p>
        )}
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/releases/${r.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-surfaceHover transition"
          >
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-ink truncate">{r.title}</div>
              <div className="text-[12.5px] text-muted mt-0.5 truncate">
                {r.artists?.name} &middot; {formatDate(r.release_date)}
                {r.distributor ? ` \u00b7 ${r.distributor}` : ""}
                {r.isrc ? ` \u00b7 ISRC ${r.isrc}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-mono shrink-0 ml-3">
              <span className="text-artist">{100 - r.label_percent}%</span>
              <span className="text-line">/</span>
              <span className="text-label">{r.label_percent}%</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
