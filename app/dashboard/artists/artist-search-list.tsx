"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ArtistRow from "./artist-row";
import { exportToCSV } from "@/lib/csv-export";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "niet_gestart", label: "Nog niet gestart" },
  { value: "in_onderhandeling", label: "In onderhandeling" },
  { value: "getekend", label: "Getekend" },
];

type Artist = {
  id: string;
  name: string;
  artist_code: string | null;
  contract_status: string;
  contract_notes: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
};

export default function ArtistSearchList({ artists }: { artists: Artist[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState(STATUS_OPTIONS[0].value);
  const [applying, setApplying] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter((a) =>
      [a.name, a.artist_code].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [artists, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
    }
  }

  async function applyBulkStatus() {
    if (selected.size === 0) return;
    setApplying(true);
    await supabase
      .from("artists")
      .update({ contract_status: bulkStatus })
      .in("id", [...selected]);
    setApplying(false);
    setSelected(new Set());
    router.refresh();
  }

  function handleExport() {
    const toExport = selected.size > 0 ? filtered.filter((a) => selected.has(a.id)) : filtered;
    exportToCSV(
      "artiesten",
      toExport.map((a) => ({
        Naam: a.name,
        Artiestcode: a.artist_code ?? "",
        Contractstatus: a.contract_status,
        "Contract start": a.contract_start_date ?? "",
        "Contract einde": a.contract_end_date ?? "",
        Notities: a.contract_notes ?? "",
      }))
    );
  }

  return (
    <>
      <div className="mb-3 flex gap-2">
        {artists.length > 5 && (
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek op artiestnaam of code…"
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
        )}
        {artists.length > 0 && (
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="text-[13px] font-medium bg-surface border border-line px-3.5 py-2.5 rounded-lg hover:bg-surfaceHover transition disabled:opacity-40 shrink-0"
          >
            Exporteren{selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="bg-accentSoft rounded-xl2 p-3.5 mb-3 flex items-center gap-3 flex-wrap animate-pop-in">
          <span className="text-[12.5px] font-medium text-accent">
            {selected.size} geselecteerd
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="text-[12.5px] rounded-md border border-line bg-surface px-2 py-1.5"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={applyBulkStatus}
            disabled={applying}
            className="text-[12.5px] font-medium bg-accent text-white px-3 py-1.5 rounded-md hover:bg-accent/90 transition disabled:opacity-50"
          >
            {applying ? "Bezig…" : "Status toepassen"}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-[12.5px] text-muted hover:text-ink ml-auto"
          >
            Selectie wissen
          </button>
        </div>
      )}

      <div className="bg-surface rounded-xl2 shadow-card overflow-hidden">
        {artists.length > 0 && (
          <div className="flex items-center gap-3 px-6 py-2.5 border-b border-line bg-canvas/50">
            <input
              type="checkbox"
              checked={filtered.length > 0 && selected.size === filtered.length}
              onChange={toggleAll}
              className="accent-accent"
            />
            <span className="text-[11px] text-muted">Alles selecteren</span>
          </div>
        )}
        <div className="divide-y divide-line">
          {artists.length === 0 && (
            <p className="text-muted text-[13px] p-8 text-center">
              Nog geen artiesten. Voeg er hierboven een toe.
            </p>
          )}
          {artists.length > 0 && filtered.length === 0 && (
            <p className="text-muted text-[13px] p-8 text-center">Niks gevonden.</p>
          )}
          {filtered.map((a) => (
            <div key={a.id} className="flex items-center">
              <div className="pl-6">
                <input
                  type="checkbox"
                  checked={selected.has(a.id)}
                  onChange={() => toggle(a.id)}
                  className="accent-accent"
                />
              </div>
              <div className="flex-1 min-w-0">
                <ArtistRow artist={a} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
