"use client";

import React, { useState } from "react";
import Link from "next/link";
import ExtraPosten, { ExtraPost, totaalVoor } from "@/components/bookings/ExtraPosten";

const STATUSSEN = [
  "optie",
  "telefonisch bevestigd",
  "definitief",
  "uitgevoerd",
  "geannuleerd",
] as const;

interface Boeking {
  id: string;
  act_naam: string;
  act_tarief_type: string;
  act_tarief_bedrag: number;
  datum: string;
  eind_datum: string;
  start_tijd: string;
  eind_tijd: string;
  locatie: string;
  bezoekers: number | null;
  basistarief: number;
  toeslag: number;
  commissie: number;
  gage: number;
  status: string;
  soundcheck_notitie: string | null;
}

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function langeDag(datum: string) {
  if (!datum) return "";
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(datum + "T12:00:00")
  );
}

export default function BookingBeheer({ boeking }: { boeking: Boeking }) {
  const [draft, setDraft] = useState({
    datum: boeking.datum,
    eind_datum: boeking.eind_datum,
    start_tijd: boeking.start_tijd.slice(0, 5),
    eind_tijd: boeking.eind_tijd.slice(0, 5),
    locatie: boeking.locatie,
    status: boeking.status,
    soundcheck_notitie: boeking.soundcheck_notitie || "",
  });
  const [bezig, setBezig] = useState(false);
  const [bedragen, setBedragen] = useState({
    basistarief: Number(boeking.basistarief),
    commissie: Number(boeking.commissie),
    gage: Number(boeking.gage),
  });

  function naarMinuten(t: string) {
    const [u, m] = t.split(":").map(Number);
    return u * 60 + (m || 0);
  }

  // 23:59 geldt als middernacht, net als in het boekingsformulier
  const startMin = naarMinuten(draft.start_tijd === "23:59" ? "00:00" : draft.start_tijd);
  let eindMin = naarMinuten(draft.eind_tijd);
  if (eindMin <= startMin) eindMin += 24 * 60;
  const uren = (eindMin - startMin) / 60;

  const nieuwBasistarief =
    boeking.act_tarief_type === "uur"
      ? boeking.act_tarief_bedrag * uren
      : boeking.act_tarief_bedrag;
  const nieuweGage = nieuwBasistarief + Number(boeking.toeslag) + bedragen.commissie;
  const tijdenGewijzigd =
    draft.start_tijd !== boeking.start_tijd.slice(0, 5) || draft.eind_tijd !== boeking.eind_tijd.slice(0, 5);
  const bedragWijktAf = Math.round(nieuwBasistarief) !== Math.round(bedragen.basistarief);
  const [melding, setMelding] = useState("");
  const [mailBezig, setMailBezig] = useState(false);
  const [mailMelding, setMailMelding] = useState("");
  const [posten, setPosten] = useState<ExtraPost[]>(
    Array.isArray((boeking as any).extra_posten) ? ((boeking as any).extra_posten as ExtraPost[]) : []
  );

  async function opslaan(extra: Partial<typeof draft> = {}) {
    setBezig(true);
    setMelding("");
    const res = await fetch(`/api/bookings/boekingen/${boeking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        extra_posten: posten.filter((p) => p.omschrijving.trim() || p.bedrag),
        basistarief: bedragen.basistarief,
        commissie: bedragen.commissie,
        gage: bedragen.gage,
        ...extra,
      }),
    });
    setBezig(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setMelding("Opslaan is niet gelukt. Probeer het nog eens.");
    }
  }

  const geannuleerd = boeking.status === "geannuleerd";

  async function stuurUitnodiging() {
    if (mailBezig) return;
    setMailBezig(true);
    setMailMelding("");
    const res = await fetch(`/api/bookings/uitnodiging/${boeking.id}`, { method: "POST" });
    const antwoord = await res.json().catch(() => null);
    setMailBezig(false);
    if (res.ok) {
      setMailMelding(`Uitnodiging verstuurd naar ${antwoord?.naar ?? "de act"}.`);
    } else {
      setMailMelding(antwoord?.error || "Versturen is niet gelukt.");
    }
  }

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <Link href="/bookings" className="text-[13px] text-neutral-500 hover:text-neutral-800">
        &larr; Terug naar overzicht
      </Link>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-neutral-400">Boeking</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">{boeking.act_naam}</h1>
            <p className="mt-1 text-[13px] text-neutral-500">{langeDag(boeking.datum)}</p>
          </div>
          {geannuleerd && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-medium text-red-700">Geannuleerd</span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Datum</label>
            <input
              type="date"
              value={draft.datum}
              onChange={(e) => setDraft({ ...draft, datum: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Einddatum</label>
            <input
              type="date"
              value={draft.eind_datum}
              onChange={(e) => setDraft({ ...draft, eind_datum: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Van</label>
            <input
              type="time"
              step={900}
              value={draft.start_tijd}
              onChange={(e) => setDraft({ ...draft, start_tijd: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Tot</label>
            <input
              type="time"
              step={900}
              value={draft.eind_tijd}
              onChange={(e) => setDraft({ ...draft, eind_tijd: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Locatie</label>
            <input
              value={draft.locatie}
              onChange={(e) => setDraft({ ...draft, locatie: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Status</label>
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            >
              {STATUSSEN.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Soundcheck / notitie</label>
            <textarea
              rows={2}
              value={draft.soundcheck_notitie}
              onChange={(e) => setDraft({ ...draft, soundcheck_notitie: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px]"
            />
          </div>
        </div>

        {tijdenGewijzigd && bedragWijktAf && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[13px] text-amber-900">
              Tijden gewijzigd: {uren.toLocaleString("nl-NL")} uur
              {boeking.act_tarief_type === "uur" && ` \u00d7 ${euro(boeking.act_tarief_bedrag)}`} ={" "}
              {euro(nieuwBasistarief)} basistarief. Nieuwe gage: {euro(nieuweGage)}.
            </p>
            <button
              type="button"
              onClick={() =>
                setBedragen({
                  basistarief: nieuwBasistarief,
                  commissie: bedragen.commissie,
                  gage: nieuweGage,
                })
              }
              className="mt-2 rounded-lg bg-amber-900 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-amber-800"
            >
              Bedragen bijwerken
            </button>
          </div>
        )}

        <div className="mt-5">
          <ExtraPosten posten={posten} onChange={setPosten} />
        </div>

        <div className="mt-5 rounded-xl bg-neutral-50 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wide text-neutral-400">Alleen zichtbaar voor jou</p>
          <div className="mt-2 space-y-1 text-[13px]">
            <div className="flex justify-between">
              <span className="text-neutral-500">Basistarief</span>
              <span className="text-neutral-900">{euro(bedragen.basistarief)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Toeslag</span>
              <span className="text-neutral-900">{euro(Number(boeking.toeslag))}</span>
            </div>
            {totaalVoor(posten, "act") > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Extra posten (act)</span>
                <span className="text-neutral-900">{euro(totaalVoor(posten, "act"))}</span>
              </div>
            )}
            {totaalVoor(posten, "mij") > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Extra posten (jij)</span>
                <span className="text-neutral-900">{euro(totaalVoor(posten, "mij"))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Jouw commissie</span>
              <span className="text-neutral-900">{euro(bedragen.commissie)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-1 font-medium">
              <span className="text-neutral-700">Gage op factuur</span>
              <span className="text-neutral-900">{euro(bedragen.gage)}</span>
            </div>
          </div>
        </div>

        {melding && <p className="mt-4 text-[13px] text-red-600">{melding}</p>}

        {mailMelding && (
          <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-700">{mailMelding}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {!geannuleerd && (
            <button
              type="button"
              disabled={mailBezig}
              onClick={stuurUitnodiging}
              className="rounded-xl border border-neutral-900 px-4 py-2 text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              {mailBezig ? "Versturen..." : "Uitnodiging mailen"}
            </button>
          )}
          <button
            type="button"
            disabled={bezig}
            onClick={() => opslaan()}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {bezig ? "Bezig..." : "Wijzigingen opslaan"}
          </button>
          {!geannuleerd && (
            <button
              type="button"
              disabled={bezig}
              onClick={() => {
                if (confirm("Weet je zeker dat je deze boeking wilt annuleren? De boeking blijft bewaard.")) {
                  opslaan({ status: "geannuleerd" });
                }
              }}
              className="rounded-xl border border-red-200 px-4 py-2 text-[13px] font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              Boeking annuleren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
