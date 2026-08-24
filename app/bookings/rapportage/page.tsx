"use client";

import React, { useMemo, useState } from "react";

type Periode = "maand" | "kwartaal" | "jaar";

interface Booking {
  id: number;
  actNaam: string;
  datum: string;
  locatie: string;
  gage: number;
  commissie: number;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 1, actNaam: "DJ Lumo", datum: "2026-08-28", locatie: "Club Vault, Arnhem", gage: 350, commissie: 100 },
  { id: 2, actNaam: "Sanne de Wilde", datum: "2026-08-29", locatie: "Café De Kroon, Doetinchem", gage: 1000, commissie: 150 },
  { id: 3, actNaam: "The Riverbeats", datum: "2026-08-29", locatie: "Bruiloft, Zutphen", gage: 1400, commissie: 200 },
  { id: 4, actNaam: "DJ Lumo", datum: "2026-09-04", locatie: "Warehouse XL, Nijmegen", gage: 350, commissie: 100 },
  { id: 5, actNaam: "Sanne de Wilde", datum: "2026-09-12", locatie: "Festivaltent, Ede", gage: 1000, commissie: 150 },
];

function formatEuro(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function getQuarter(month: number): number {
  return Math.floor(month / 3) + 1;
}

function periodeLabel(periode: Periode, datum: Date): string {
  if (periode === "jaar") return `${datum.getFullYear()}`;
  if (periode === "kwartaal") return `Q${getQuarter(datum.getMonth())} ${datum.getFullYear()}`;
  return new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(datum);
}

export default function RapportagePage() {
  const [periode, setPeriode] = useState<Periode>("maand");
  const [referentieDatum, setReferentieDatum] = useState(new Date("2026-08-15"));

  const gefilterdeBoekingen = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => {
      const d = new Date(b.datum);
      if (periode === "jaar") return d.getFullYear() === referentieDatum.getFullYear();
      if (periode === "kwartaal")
        return (
          d.getFullYear() === referentieDatum.getFullYear() &&
          getQuarter(d.getMonth()) === getQuarter(referentieDatum.getMonth())
        );
      return d.getFullYear() === referentieDatum.getFullYear() && d.getMonth() === referentieDatum.getMonth();
    });
  }, [periode, referentieDatum]);

  const totaalGage = gefilterdeBoekingen.reduce((sum, b) => sum + b.gage, 0);
  const totaalCommissie = gefilterdeBoekingen.reduce((sum, b) => sum + b.commissie, 0);

  function verschuifPeriode(richting: -1 | 1) {
    const nieuw = new Date(referentieDatum);
    if (periode === "jaar") nieuw.setFullYear(nieuw.getFullYear() + richting);
    else if (periode === "kwartaal") nieuw.setMonth(nieuw.getMonth() + richting * 3);
    else nieuw.setMonth(nieuw.getMonth() + richting);
    setReferentieDatum(nieuw);
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 px-6 py-10 sm:px-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Rapportage</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-800"
          >
            Download als PDF
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="inline-flex rounded-xl bg-neutral-100 p-1">
            {(
              [
                { id: "maand", label: "Maand" },
                { id: "kwartaal", label: "Kwartaal" },
                { id: "jaar", label: "Jaar" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriode(p.id)}
                className={`rounded-lg px-4 py-1.5 text-[13px] font-medium transition ${
                  periode === p.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => verschuifPeriode(-1)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-neutral-50"
            >
              ←
            </button>
            <span className="min-w-[140px] text-center text-[13px] font-medium text-neutral-700">
              {periodeLabel(periode, referentieDatum)}
            </span>
            <button
              onClick={() => verschuifPeriode(1)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-neutral-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="mb-6 hidden print:block">
          <h1 className="text-xl font-semibold text-neutral-900">{periodeLabel(periode, referentieDatum)}</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          {gefilterdeBoekingen.length === 0 ? (
            <p className="text-[13px] text-neutral-400">Geen boekingen in deze periode.</p>
          ) : (
            <div className="space-y-2">
              {gefilterdeBoekingen.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b border-neutral-100 pb-2 text-[13px] last:border-0"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{b.actNaam}</p>
                    <p className="text-neutral-500">
                      {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(new Date(b.datum))} ·{" "}
                      {b.locatie}
                    </p>
                  </div>
                  <span className="font-medium text-neutral-900">{formatEuro(b.gage)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-1.5 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-neutral-500">Totale gage (facturen aan opdrachtgevers)</span>
              <span className="font-medium text-neutral-900">{formatEuro(totaalGage)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] print:hidden">
              <span className="text-neutral-500">Totale commissie (alleen zichtbaar voor jou)</span>
              <span className="font-medium text-neutral-900">{formatEuro(totaalCommissie)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
