"use client";

import { useMemo, useState } from "react";

interface Boeking {
  id: string;
  datum: string;
  locatie: string;
  status: string;
  gage?: number | null;
  commissie?: number | null;
}

function euro(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function datumKort(d: string): string {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(new Date(d));
}

export default function ActJaaroverzicht({ bookingen }: { bookingen: Boeking[] }) {
  const jaren = useMemo(() => {
    const set = new Set(bookingen.map((b) => b.datum.slice(0, 4)));
    return [...set].sort().reverse();
  }, [bookingen]);

  const [jaar, setJaar] = useState(jaren[0] ?? String(new Date().getFullYear()));

  const vanJaar = bookingen
    .filter((b) => b.datum.startsWith(jaar))
    .sort((a, b) => a.datum.localeCompare(b.datum));

  const telt = vanJaar.filter((b) => b.status !== "geannuleerd");
  const totaalGage = telt.reduce((s, b) => s + (Number(b.gage) || 0), 0);
  const totaalCommissie = telt.reduce((s, b) => s + (Number(b.commissie) || 0), 0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-neutral-900">Jaaroverzicht</h2>
        {jaren.length > 1 && (
          <div className="flex gap-1.5">
            {jaren.map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => setJaar(j)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                  j === jaar ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        )}
      </div>

      {vanJaar.length === 0 ? (
        <p className="mt-4 text-[13px] text-neutral-400">Geen boekingen in {jaar}.</p>
      ) : (
        <>
          <div className="mt-4 space-y-1">
            {vanJaar.map((b) => {
              const af = b.status === "geannuleerd";
              const gage = Number(b.gage) || 0;
              const commissie = Number(b.commissie) || 0;
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b border-neutral-100 py-2.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className={`text-[13px] ${af ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                      {datumKort(b.datum)} · {b.locatie}
                    </p>
                    {af && <p className="text-[11px] text-red-500">geannuleerd</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-[13px] font-medium ${af ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                      {euro(gage)}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      act {euro(gage - commissie)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-[13px]">
            <div className="flex justify-between">
              <span className="text-neutral-500">Optredens in {jaar}</span>
              <span className="font-medium text-neutral-900">{telt.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Totaal gefactureerd</span>
              <span className="font-medium text-neutral-900">{euro(totaalGage)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Naar de act</span>
              <span className="font-medium text-neutral-900">{euro(totaalGage - totaalCommissie)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Jouw commissie</span>
              <span className="font-medium text-neutral-900">{euro(totaalCommissie)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
