"use client";

import { useState } from "react";
import { formatEUR, formatDate } from "@/lib/format";

type Platform = { platform: string; amount: number };
type Entry = {
  id: string;
  entry_date: string;
  platform: string;
  gross_amount: number;
  artist_amount: number;
};

type Release = {
  id: string;
  title: string;
  releaseDate: string | null;
  artistPercent: number;
  gross: number;
  net: number;
  costs: number;
  advances: number;
  platforms: Platform[];
  entries: Entry[];
};

export default function ReleaseCard({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);
  const hasDeductions = release.costs > 0 || release.advances > 0;

  return (
    <div className="bg-surface rounded-xl2 shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 hover:bg-surfaceHover transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">{release.title}</span>
          <span className="text-xs font-mono text-artist">{release.artistPercent}% jouw deel</span>
        </div>
        <div className="text-3xl font-semibold text-ink mt-3 tracking-tight">
          {formatEUR(release.net)}
        </div>
        <div className="text-xs text-muted mt-1 flex items-center gap-1.5">
          te ontvangen
          {hasDeductions && (
            <span className="text-[11px] text-muted">
              &middot; {formatEUR(release.gross * (release.artistPercent / 100))} bruto minus kosten/voorschot
            </span>
          )}
          <span className="ml-auto text-accent text-[12px]">{open ? "Verbergen" : "Details"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-line px-6 py-4 animate-pop-in">
          {release.platforms.length === 0 ? (
            <p className="text-[12.5px] text-muted py-2">Nog geen inkomsten geboekt.</p>
          ) : (
            <>
              <div className="text-[11px] font-medium text-muted tracking-wide uppercase mb-2">
                Per platform (jouw aandeel)
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {release.platforms.map((p) => (
                  <div key={p.platform} className="flex items-center justify-between text-[13px]">
                    <span className="text-ink">{p.platform}</span>
                    <span className="font-mono text-muted">{formatEUR(p.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] font-medium text-muted tracking-wide uppercase mb-2">
                Alle betalingen
              </div>
              <div className="flex flex-col divide-y divide-line">
                {release.entries
                  .slice()
                  .sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1))
                  .map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-[12.5px] py-2">
                      <span className="text-muted">
                        {formatDate(e.entry_date)} &middot; {e.platform}
                      </span>
                      <span className="font-mono text-ink">{formatEUR(e.artist_amount)}</span>
                    </div>
                  ))}
              </div>
            </>
          )}

          {hasDeductions && (
            <div className="mt-4 pt-3 border-t border-line text-[12px] text-muted flex flex-col gap-1">
              {release.costs > 0 && <span>Kosten ingehouden: -{formatEUR(release.costs)}</span>}
              {release.advances > 0 && <span>Voorschot ingehouden: -{formatEUR(release.advances)}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
