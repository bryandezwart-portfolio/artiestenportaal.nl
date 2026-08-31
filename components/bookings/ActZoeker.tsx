"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ActType = "dj" | "artiest" | "band" | "special";

interface Act {
  id: string;
  slug: string;
  name: string;
  type: ActType;
  specialiteit: string | null;
  genres: string[] | null;
  tijdperken: string[] | null;
  tarief_type: string;
  tarief_bedrag: number | null;
  standaard_commissie: number | null;
  publiek_min: number | null;
  publiek_max: number | null;
  boeking_type: string | null;
  bureau_naam: string | null;
  contact_naam: string | null;
  contact_telefoon: string | null;
}

const TYPES: { waarde: ActType; label: string; actief: string }[] = [
  { waarde: "dj", label: "Dj", actief: "bg-violet-500 text-white border-transparent" },
  { waarde: "artiest", label: "Artiest", actief: "bg-orange-500 text-white border-transparent" },
  { waarde: "band", label: "Band", actief: "bg-blue-500 text-white border-transparent" },
  { waarde: "special", label: "Special", actief: "bg-emerald-500 text-white border-transparent" },
];

const BADGE: Record<ActType, string> = {
  dj: "bg-violet-50 text-violet-700",
  artiest: "bg-orange-50 text-orange-700",
  band: "bg-blue-50 text-blue-700",
  special: "bg-emerald-50 text-emerald-700",
};

const LABEL: Record<ActType, string> = {
  dj: "Dj",
  artiest: "Artiest",
  band: "Band",
  special: "Special",
};

function euro(n: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function urenTussen(start: string, eind: string): number {
  const [su, sm] = start.split(":").map(Number);
  const [eu, em] = eind.split(":").map(Number);
  let minuten = eu * 60 + em - (su * 60 + sm);
  if (minuten <= 0) minuten += 24 * 60;
  return minuten / 60;
}

export default function ActZoeker({
  genres,
  tijdperken,
}: {
  genres: string[];
  tijdperken: string[];
}) {
  const [datum, setDatum] = useState("");
  const [start, setStart] = useState("20:00");
  const [eind, setEind] = useState("23:00");
  const [publiek, setPubliek] = useState("");
  const [maxBedrag, setMaxBedrag] = useState("");
  const [types, setTypes] = useState<ActType[]>([]);
  const [gekozenGenres, setGekozenGenres] = useState<string[]>([]);
  const [gekozenTijdperken, setGekozenTijdperken] = useState<string[]>([]);
  const [volwassenen, setVolwassenen] = useState(false);

  const [resultaten, setResultaten] = useState<Act[] | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  function toggle<T>(lijst: T[], setter: (v: T[]) => void, waarde: T) {
    setResultaten(null);
    setter(lijst.includes(waarde) ? lijst.filter((x) => x !== waarde) : [...lijst, waarde]);
  }

  function wijzig(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setResultaten(null);
      setter(e.target.value);
    };
  }

  function leegmaken() {
    setPubliek("");
    setMaxBedrag("");
    setTypes([]);
    setGekozenGenres([]);
    setGekozenTijdperken([]);
    setVolwassenen(false);
    setResultaten(null);
    setFout("");
  }

  async function zoeken() {
    if (!datum) {
      setFout("Kies eerst een datum.");
      return;
    }
    setFout("");
    setBezig(true);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("bdzbookings_beschikbare_acts", {
      p_datum: datum,
      p_start_tijd: start,
      p_eind_tijd: eind,
      p_publiek: publiek.trim() ? parseInt(publiek.replace(/\D/g, ""), 10) : null,
      p_max_bedrag: maxBedrag.trim()
        ? Number(maxBedrag.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""))
        : null,
      p_types: types.length ? types : null,
      p_genres: gekozenGenres.length ? gekozenGenres : null,
      p_tijdperken: gekozenTijdperken.length ? gekozenTijdperken : null,
      p_volwassenen: volwassenen,
    });

    setBezig(false);

    if (error) {
      setFout(`Zoeken mislukt: ${error.message}`);
      setResultaten(null);
      return;
    }

    setResultaten((data ?? []) as Act[]);
  }

  const uren = urenTussen(start, eind);

  const knopBasis =
    "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition whitespace-nowrap";
  const knopUit = "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50";
  const knopAan = "border-neutral-900 bg-neutral-900 text-white";
  const veld =
    "w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-8 sm:px-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Wie is er vrij?</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Vul de gegevens van de klus in. Je ziet alleen acts die op dat moment vrij zijn — bestaande
          boekingen en reistijd worden meegerekend.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Datum</label>
            <input type="date" value={datum} onChange={wijzig(setDatum)} className={veld} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Van</label>
            <input type="time" value={start} onChange={wijzig(setStart)} className={veld} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Tot</label>
            <input type="time" value={eind} onChange={wijzig(setEind)} className={veld} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Aantal gasten</label>
            <input
              type="text"
              value={publiek}
              onChange={wijzig(setPubliek)}
              placeholder="250"
              className={veld}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-neutral-100 pt-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Soort act</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.waarde}
                    type="button"
                    onClick={() => toggle(types, setTypes, t.waarde)}
                    className={`${knopBasis} ${types.includes(t.waarde) ? t.actief : knopUit}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                Budget per optreden
              </label>
              <input
                type="text"
                value={maxBedrag}
                onChange={wijzig(setMaxBedrag)}
                placeholder="Maximaal, bijv. 800"
                className={veld}
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div className="mt-5">
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggle(gekozenGenres, setGekozenGenres, g)}
                    className={`${knopBasis} ${gekozenGenres.includes(g) ? knopAan : knopUit}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tijdperken.length > 0 && (
            <div className="mt-5">
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Tijdperk</label>
              <div className="flex flex-wrap gap-1.5">
                {tijdperken.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle(gekozenTijdperken, setGekozenTijdperken, t)}
                    className={`${knopBasis} ${gekozenTijdperken.includes(t) ? knopAan : knopUit}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="mt-5 flex items-center gap-2 text-[13px] text-neutral-600">
            <input
              type="checkbox"
              checked={volwassenen}
              onChange={(e) => { setResultaten(null); setVolwassenen(e.target.checked); }}
              className="h-4 w-4 rounded border-neutral-300"
            />
            Ook 18+ acts tonen
          </label>
        </div>

        {fout && <p className="mt-4 text-[13px] text-red-600">{fout}</p>}

        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={zoeken}
            disabled={bezig}
            className="rounded-xl bg-neutral-900 px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {bezig ? "Zoeken…" : "Zoek beschikbare acts"}
          </button>
          <button
            type="button"
            onClick={leegmaken}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[14px] font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            Filters wissen
          </button>
        </div>
      </div>

      {resultaten !== null && (
        <div className="mt-8">
          <p className="mb-4 text-[13px] text-neutral-500">
            {resultaten.length === 0
              ? "Geen acts gevonden die aan deze voorwaarden voldoen."
              : `${resultaten.length} ${resultaten.length === 1 ? "act" : "acts"} beschikbaar`}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resultaten.map((act) => {
              const perUur = act.tarief_type === "uur";
              const indicatie =
                act.tarief_bedrag !== null
                  ? perUur
                    ? act.tarief_bedrag * uren
                    : act.tarief_bedrag
                  : null;

              return (
                <div
                  key={act.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-neutral-900">{act.name}</p>
                      <span
                        className={`mt-1.5 inline-block rounded-full px-2.5 py-1 text-[12px] font-medium ${BADGE[act.type]}`}
                      >
                        {act.specialiteit || LABEL[act.type]}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                        {perUur ? `${uren} uur` : "Tarief"}
                      </p>
                      <p className="text-[16px] font-semibold text-neutral-900">
                        {indicatie !== null ? euro(indicatie) : "—"}
                      </p>
                    </div>
                  </div>

                  {Boolean(act.genres?.length || act.tijdperken?.length) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(act.genres ?? []).map((g) => (
                        <span
                          key={g}
                          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600"
                        >
                          {g}
                        </span>
                      ))}
                      {(act.tijdperken ?? []).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[11px] text-neutral-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-1 border-t border-neutral-100 pt-3 text-[12px] text-neutral-500">
                    {(act.publiek_min || act.publiek_max) && (
                      <p>
                        Publiek: {act.publiek_min ?? 0} – {act.publiek_max ?? "∞"} personen
                      </p>
                    )}
                    {act.boeking_type === "doorboeking" && act.bureau_naam && (
                      <p>Doorboeking via {act.bureau_naam}</p>
                    )}
                    {act.contact_naam && (
                      <p>
                        {act.contact_naam}
                        {act.contact_telefoon ? ` · ${act.contact_telefoon}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/bookings/nieuw?act=${act.slug}&datum=${datum}&start=${start}&eind=${eind}`}
                      className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-center text-[13px] font-medium text-white transition hover:bg-neutral-800"
                    >
                      Boeken
                    </Link>
                    <Link
                      href={`/bookings/acts/${act.slug}`}
                      className="rounded-lg border border-neutral-200 px-3 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Bekijk
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
