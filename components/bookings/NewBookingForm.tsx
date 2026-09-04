"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import ExtraPosten, { ExtraPost, totaalVoor } from "@/components/bookings/ExtraPosten";

type ActType = "dj" | "artiest" | "band";
type TariefType = "vast" | "uur";

interface CapaciteitTier {
  vanaf: number;
  toeslag: number;
}

interface Act {
  id: number;
  name: string;
  type: ActType;
  tariefType: TariefType;
  tariefBedrag: number;
  standaardCommissie: number;
  tiers: CapaciteitTier[];
}

interface ExistingBooking {
  id: number;
  actId: number;
  date: string;
  start: string;
  end: string;
  locatie: string;
}

const TYPE_STYLES: Record<ActType, { label: string; badge: string }> = {
  dj: { label: "Dj", badge: "bg-violet-50 text-violet-700" },
  artiest: { label: "Artiest", badge: "bg-orange-50 text-orange-700" },
  band: { label: "Band", badge: "bg-blue-50 text-blue-700" },
};

const MOCK_ACTS: Act[] = [
  { id: 1, name: "DJ Lumo", type: "dj", tariefType: "uur", tariefBedrag: 125, standaardCommissie: 100, tiers: [] },
  {
    id: 2,
    name: "Sanne de Wilde",
    type: "artiest",
    tariefType: "vast",
    tariefBedrag: 850,
    standaardCommissie: 150,
    tiers: [
      { vanaf: 250, toeslag: 150 },
      { vanaf: 1000, toeslag: 400 },
    ],
  },
  { id: 3, name: "The Riverbeats", type: "band", tariefType: "vast", tariefBedrag: 1200, standaardCommissie: 200, tiers: [] },
];

const EXISTING_BOOKINGS: ExistingBooking[] = [
  { id: 1, actId: 1, date: "2026-08-28", start: "22:00", end: "23:59", locatie: "Club Vault, Arnhem" },
  { id: 2, actId: 3, date: "2026-08-29", start: "21:00", end: "23:30", locatie: "Bruiloft, Zutphen" },
];

const BUFFER_MINUTES = 90;

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// 23:59 is in de praktijk een code voor "middernacht" op de voorgaande dag.
// Voor de duurberekening lezen we die tijd daarom als 00:00, zodat een boeking
// van 23:59 tot 02:00 gewoon 2 uur is en niet 2,017 uur.
function normaliseerStart(start: string): string {
  return start === "23:59" ? "00:00" : start;
}

function durationHours(start: string, end: string): number {
  let startMin = toMinutes(normaliseerStart(start));
  let endMin = toMinutes(end);
  if (endMin <= startMin) endMin += 24 * 60;
  return (endMin - startMin) / 60;
}

function loopOverMiddernacht(start: string, end: string): boolean {
  return toMinutes(end) <= toMinutes(start);
}

function volgendeDag(datum: string): string {
  const d = new Date(datum + "T12:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function langeDag(datum: string): string {
  if (!datum) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(datum + "T12:00:00"));
}

function parseEuro(value: string): number | null {
  const cleaned = value.replace(/[€\s.]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function formatEuro(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

type ConflictLevel = "none" | "buffer" | "overlap";

function checkConflict(
  actId: any,
  date: string,
  start: string,
  end: string,
  bestaande: ExistingBooking[]
): { level: ConflictLevel; against?: ExistingBooking } {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);

  for (const b of bestaande) {
    if (b.actId !== actId || b.date !== date) continue;
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);

    const hardOverlap = startMin < bEnd && endMin > bStart;
    if (hardOverlap) return { level: "overlap", against: b };

    const bufferOverlap = startMin < bEnd + BUFFER_MINUTES && endMin > bStart - BUFFER_MINUTES;
    if (bufferOverlap) return { level: "buffer", against: b };
  }

  return { level: "none" };
}

function applicableToeslag(tiers: CapaciteitTier[], bezoekers: number): CapaciteitTier | null {
  const sorted = [...tiers].sort((a, b) => b.vanaf - a.vanaf);
  return sorted.find((t) => bezoekers >= t.vanaf) || null;
}

function ActPicker({
  acts,
  selectedId,
  onSelect,
}: {
  acts: Act[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = acts.find((a) => a.id === selectedId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return acts;
    return acts.filter((a) => a.name.toLowerCase().includes(q));
  }, [acts, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={open ? query : selected?.name || ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        placeholder="Zoek een act op naam..."
        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
      />
      {open && (
        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md">
          {filtered.length === 0 ? (
            <p className="px-3 py-2.5 text-[13px] text-neutral-400">Geen acts gevonden</p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  onSelect(a.id);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[14px] text-neutral-900 hover:bg-neutral-50"
              >
                <span>{a.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_STYLES[a.type].badge}`}>
                  {TYPE_STYLES[a.type].label}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function NewBookingForm({
  acts = MOCK_ACTS,
  bestaandeBoekingen = EXISTING_BOOKINGS,
  vooringevuld,
}: {
  acts?: Act[];
  bestaandeBoekingen?: ExistingBooking[];
  vooringevuld?: { datum: string; locatie: string; actSlug: string };
}) {
  const vooraf = acts.find((a) => (a as any).slug === vooringevuld?.actSlug);
  const [actId, setActId] = useState<any>(vooraf ? vooraf.id : acts[0].id);
  const [date, setDate] = useState(vooringevuld?.datum ?? "");
  const [start, setStart] = useState("21:00");
  const [end, setEnd] = useState("23:00");
  const [locatie, setLocatie] = useState(vooringevuld?.locatie ?? "");
  const [bezoekersInput, setBezoekersInput] = useState("");
  const [speelschema, setSpeelschema] = useState("");
  const [gelegenheid, setGelegenheid] = useState("openbaar");
  const [opmerkingen, setOpmerkingen] = useState("");
  const [extraPosten, setExtraPosten] = useState<ExtraPost[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const slug = q.get("act");
    const d = q.get("datum");
    const s0 = q.get("start");
    const e0 = q.get("eind");
    if (slug) {
      const gevonden = acts.find((a: any) => a.slug === slug);
      if (gevonden) setActId(gevonden.id);
    }
    if (d) setDate(d);
    if (s0) setStart(s0);
    if (e0) setEnd(e0);
  }, []);
  const [commissieInput, setCommissieInput] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState<any>(null);
  const [error, setError] = useState("");

  const selectedAct = acts.find((a) => a.id === actId)!;
  const uren = useMemo(() => (start && end ? durationHours(start, end) : 0), [start, end]);
  const overMiddernacht = start && end ? loopOverMiddernacht(start, end) : false;
  const eindDatum = date ? (overMiddernacht ? volgendeDag(date) : date) : "";
  const bezoekers = parseInt(bezoekersInput || "0", 10) || 0;
  const toeslag = applicableToeslag(selectedAct.tiers, bezoekers);

  useEffect(() => {
    setCommissieInput(null);
  }, [actId]);

  const basisTarief = selectedAct.tariefType === "uur" ? selectedAct.tariefBedrag * uren : selectedAct.tariefBedrag;
  const basisTariefMetToeslag = basisTarief + (toeslag?.toeslag || 0);

  const commissieValue = commissieInput !== null ? parseEuro(commissieInput) : selectedAct.standaardCommissie;
  const extraVoorAct = totaalVoor(extraPosten, "act");
  const extraVoorMij = totaalVoor(extraPosten, "mij");
  // basistarief dat wordt opgeslagen bevat de extra posten voor de act al,
  // dus die hier niet nog een keer optellen
  // Het basistarief dat we opslaan bevat de posten voor de act al.
  // De gage bouwt daarop voort: basistarief + commissie + posten voor jou.
  const basistariefOpslaan = basisTariefMetToeslag + extraVoorAct;
  const gage = commissieValue !== null ? basistariefOpslaan + commissieValue + extraVoorMij : null;
  const commissiePct =
    commissieValue !== null && basisTariefMetToeslag > 0 ? (commissieValue / basisTariefMetToeslag) * 100 : null;

  const conflict = useMemo(() => {
    if (!date || !start || !end) return { level: "none" as ConflictLevel };
    return checkConflict(actId, date, start, end, bestaandeBoekingen);
  }, [actId, date, start, end, bestaandeBoekingen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !start || !end || !locatie.trim()) {
      setError("Vul alle velden in voordat je de boeking aanmaakt.");
      return;
    }
    if (conflict.level === "overlap") {
      setError("Deze act is al geboekt op dit tijdstip — pas de tijd aan.");
      return;
    }
    setError("");
    if (bezig) return;
    setBezig(true);

    const res = await fetch("/api/bookings/boekingen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        act_id: actId,
        datum: date,
        eind_datum: eindDatum,
        start_tijd: start,
        eind_tijd: end,
        locatie: locatie.trim(),
        speelschema: speelschema.trim() || null,
        gelegenheid,
        opmerkingen: opmerkingen.trim() || null,
        extra_posten: extraPosten.filter((p) => p.omschrijving.trim() || p.bedrag),
        basistarief: basistariefOpslaan,
        bezoekers: bezoekers || null,
        toeslag: toeslag?.toeslag || 0,
        commissie: commissieValue || 0,
        gage: gage || 0,
      }),
    });

    if (!res.ok) {
      setBezig(false);
      const fout = await res.json().catch(() => null);
      setError(fout?.error || "Opslaan is niet gelukt. Probeer het nog eens.");
      return;
    }
    const antwoord = await res.json().catch(() => null);
    setOpgeslagen(antwoord?.boeking ?? null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
      >
        <p className="text-[15px] font-semibold text-neutral-900">Boeking aangemaakt</p>

        {opgeslagen && (
          <div className="mt-4 space-y-1.5 rounded-xl bg-neutral-50 p-4 text-left">
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-500">Act</span>
              <span className="font-medium text-neutral-900">{selectedAct.name}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-500">Wanneer</span>
              <span className="font-medium text-neutral-900">
                {langeDag(opgeslagen.datum)} {String(opgeslagen.start_tijd).slice(0, 5)} &ndash;{" "}
                {String(opgeslagen.eind_tijd).slice(0, 5)}
              </span>
            </div>
            {opgeslagen.eind_datum !== opgeslagen.datum && (
              <div className="flex justify-between text-[12px]">
                <span className="text-neutral-400">Eindigt op</span>
                <span className="text-neutral-500">{langeDag(opgeslagen.eind_datum)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-500">Locatie</span>
              <span className="font-medium text-neutral-900">{opgeslagen.locatie}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-1.5 text-[13px]">
              <span className="text-neutral-500">Gage op factuur</span>
              <span className="font-medium text-neutral-900">
                {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                  Number(opgeslagen.gage)
                )}
              </span>
            </div>
          </div>
        )}

        <p className="mt-3 text-[12px] text-neutral-400">
          Status: telefonisch bevestigd. De factuur aan de opdrachtgever toont alleen de gage &mdash; jouw commissie
          staat daar nooit op.
        </p>

        <div className="mt-5 flex gap-2">
          <a
            href="/bookings"
            className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
          >
            Naar de agenda
          </a>
          {opgeslagen?.id && (
            <a
              href={`/bookings/boeking/${opgeslagen.id}`}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Boeking bewerken
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Nieuwe boeking</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Act</label>
            <ActPicker acts={acts} selectedId={actId} onSelect={setActId} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3">
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Van</label>
              <input
                type="time"
                step={900}
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Tot</label>
              <input
                type="time"
                step={900}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            {date && start && end && (
              <div className="col-span-3 rounded-xl bg-neutral-50 px-3 py-2">
                <p className="text-[13px] text-neutral-700">
                  {langeDag(date)} {start} &rarr; {langeDag(eindDatum)} {end}
                  <span className="text-neutral-400"> &middot; {uren.toLocaleString("nl-NL")} uur</span>
                </p>
                {overMiddernacht && (
                  <p className="mt-0.5 text-[12px] text-amber-700">
                    Deze boeking loopt door na middernacht &mdash; de eindtijd valt op de volgende dag.
                  </p>
                )}
              </div>
            )}
            <div className="col-span-1 flex items-end">
              <p className="text-[11px] text-neutral-400">30 min mogelijk</p>
            </div>
          </div>

          {selectedAct.tariefType === "vast" && (
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Verwacht aantal bezoekers</label>
              <input
                type="text"
                value={bezoekersInput}
                onChange={(e) => setBezoekersInput(e.target.value)}
                placeholder="Bijv. 300"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Speelschema</label>
              <input
                type="text"
                value={speelschema}
                onChange={(e) => setSpeelschema(e.target.value)}
                placeholder="Bijv. 3 x 45 min"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Gelegenheid</label>
              <select
                value={gelegenheid}
                onChange={(e) => setGelegenheid(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
              >
                <option value="openbaar">Openbaar</option>
                <option value="besloten">Besloten</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
              Opmerkingen voor de act
            </label>
            <textarea
              rows={3}
              value={opmerkingen}
              onChange={(e) => setOpmerkingen(e.target.value)}
              placeholder="Bijv. genre techno, extra microfoon i.v.m. presentator, rookmachine meenemen"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>

          <ExtraPosten posten={extraPosten} onChange={setExtraPosten} />

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Locatie</label>
            <input
              type="text"
              value={locatie}
              onChange={(e) => setLocatie(e.target.value)}
              placeholder="Bijv. Café De Kroon, Doetinchem"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>

          {conflict.level === "overlap" && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
              {selectedAct.name} heeft op dit tijdstip al een boeking ({conflict.against?.start}–
              {conflict.against?.end} bij {conflict.against?.locatie}). Kies een ander tijdstip.
            </div>
          )}
          {conflict.level === "buffer" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-800">
              Let op: {selectedAct.name} heeft die dag al een boeking tot {conflict.against?.end} bij{" "}
              {conflict.against?.locatie}, minder dan {BUFFER_MINUTES} minuten hiervandaan. Dit blokkeert niet, maar
              check zelf even de reistijd.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">Tarief {selectedAct.name}</p>
            {selectedAct.tariefType === "uur" ? (
              <div className="space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Per uur</span>
                  <span className="text-neutral-900">{formatEuro(selectedAct.tariefBedrag)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Per half uur</span>
                  <span className="text-neutral-900">{formatEuro(selectedAct.tariefBedrag / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Deze boeking ({uren.toFixed(1)} uur)</span>
                  <span className="text-neutral-900">{formatEuro(basisTarief)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Per optreden</span>
                  <span className="text-neutral-900">{formatEuro(selectedAct.tariefBedrag)}</span>
                </div>
                {toeslag && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Toeslag (vanaf {toeslag.vanaf} bezoekers)</span>
                    <span className="text-neutral-900">+{formatEuro(toeslag.toeslag)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[13px] font-medium text-neutral-700">Jouw commissie</label>
              <span className="text-[11px] text-neutral-400">standaard: {formatEuro(selectedAct.standaardCommissie)}</span>
            </div>
            <input
              type="text"
              value={commissieInput !== null ? commissieInput : String(selectedAct.standaardCommissie)}
              onChange={(e) => setCommissieInput(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
            />
          </div>

          {gage !== null && (
            <div className="rounded-xl bg-neutral-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-neutral-400">Alleen zichtbaar voor jou</p>
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">Basistarief (incl. eventuele toeslag)</span>
                <span className="text-neutral-900">{formatEuro(basisTariefMetToeslag)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">Jouw commissie</span>
                <span className="text-neutral-900">
                  {formatEuro(commissieValue || 0)}
                  {commissiePct !== null && ` (${commissiePct.toFixed(1)}%)`}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between border-t border-neutral-200 pt-1.5 text-[14px] font-semibold">
                <span className="text-neutral-700">Gage op factuur</span>
                <span className="text-neutral-900">{formatEuro(gage)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-5 text-[13px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={bezig}
        className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 lg:w-auto lg:px-8"
      >
        {bezig ? "Bezig met opslaan..." : "Boeking aanmaken (telefonisch bevestigd)"}
      </button>
      <p className="mt-3 text-[12px] text-neutral-400">
        Zorg dat je de act al gebeld/geappt hebt over beschikbaarheid voordat je dit aanmaakt.
      </p>
    </form>
  );
}
