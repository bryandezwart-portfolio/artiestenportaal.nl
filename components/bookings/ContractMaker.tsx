"use client";

import { useMemo, useState } from "react";
import {
  vindSjabloon,
  VELDEN,
  type ActType,
  type Partij,
} from "@/lib/bookings/contract-sjablonen";

/** Deze velden vult het portaal zelf uit de boeking; die hoef je niet te typen. */
const AUTOMATISCH = new Set([
  "datum", "start_tijd", "eind_tijd", "aankomst", "reistijd",
  "opdrachtgever_naam", "klant_naam", "act_naam",
  "gage", "commissie", "onkosten", "subtotaal", "totaal", "btw", "btw_pct",
  "speeltijd_in_totaal",
]);

/** Velden die je als ruim tekstvak wilt invullen in plaats van één regeltje. */
const RUIM = new Set([
  "aanvullende_afspraken",
  "sfeerverlichting_draadloze_microfoon_voor_speeches",
  "de_act_doet",
  "de_act_meebrengt",
  "speciaal_moment",
  "sfeer",
  "gewenste_stijl_of_sfeer",
]);

/** Meerdere regels in het contract die je als één tekstvak invult. */
const SAMENGEVOEGD: Record<string, string[]> = {
  aanvullende_afspraken: ["aanvullende_afspraken", "aanvullende_afspraken_2", "aanvullende_afspraken_3"],
};
const VERBORGEN = new Set(Object.values(SAMENGEVOEGD).flat().slice(1));

/**
 * Wat er alvast ingevuld staat bij een nieuwe boeking.
 * Je kunt het per boeking altijd nog aanpassen of weghalen.
 */
const STANDAARD: Record<string, string> = {
  auto_van_de_dj_binnen: "20",
  sfeerverlichting_draadloze_microfoon_voor_speeches: "draadloze microfoon voor speeches",
};

/** Kleine uitleg onder een veld, voor als de bedoeling niet vanzelf spreekt. */
const UITLEG: Record<string, string> = {
  act_eigennaam: "De echte naam achter de artiestennaam. Dit is de naam waarmee de dj tekent.",
  auto_van_de_dj_binnen: "Alleen een getal. Dit vult de zin aan: binnen … meter van de ingang.",
  klant_bedrijf: "Alleen invullen bij een zakelijke boeking. Bij een particulier laat je dit leeg.",
  gelegenheid: "Bijvoorbeeld bruiloft, bedrijfsfeest, dorpsfeest of café.",
  uur_in: "Alleen een getal, bijvoorbeeld 3. De lengte per blok hoort hier niet.",
  binnen_buiten: "Vul in: binnen, buiten, of allebei.",
  aanvullende_afspraken: "Maximaal drie regels. Alles wat niet in een ander veld past hoort hier.",
  sfeerverlichting_draadloze_microfoon_voor_speeches: "Wat de dj naast zijn eigen set meeneemt.",
};

/** Eigen naam voor een veld, als die van het sjabloon niet lekker leest. */
const LABELS: Record<string, string> = {
  aanvullende_afspraken: "Aanvullende afspraken (elke regel komt op een eigen regel in het contract)",
  sfeerverlichting_draadloze_microfoon_voor_speeches: "Extra's — rookmachine, sfeerverlichting, draadloze microfoon",
};

/** Deze velden komen binnen hun groep altijd eerst te staan. */
const EERST = [
  "klant_contact", "klant_telefoon", "klant_email",
  "klant_bedrijf",
  "act_contact", "contactpersoon_band", "act_eigennaam",
  "locatie_contact",
];

type EerderContract = {
  partij: Partij;
  waarden: Record<string, string>;
  status: string;
  token: string | null;
  getekend_op: string | null;
};

type Props = {
  bookingId: string;
  actType: ActType;
  actNaam: string;
  eerder: EerderContract[];
};

export default function ContractMaker({ bookingId, actType, actNaam, eerder }: Props) {
  const [partij, setPartij] = useState<Partij>("klant");
  const sjabloon = useMemo(() => vindSjabloon(partij, actType), [partij, actType]);

  const laatste = eerder.find((c) => c.partij === partij && c.status !== "vervallen");

  // Lege velden tellen niet mee bij het samenvoegen: anders wist een leeg
  // veld van het ene contract een ingevulde waarde van het andere.
  const zonderLege = (w: Record<string, string> | null | undefined) =>
    Object.fromEntries(Object.entries(w ?? {}).filter(([, v]) => (v ?? "").trim() !== ""));

  // Wat je bij het ene contract invulde geldt ook voor het andere: datum, locatie,
  // tijden en muziek zijn immers hetzelfde. Het contract zelf wint van het gedeelde.
  const gedeeld = useMemo(() => {
    const alles: Record<string, string> = {};
    for (const c of [...eerder].reverse()) Object.assign(alles, zonderLege(c.waarden));
    return alles;
  }, [eerder]);

  // alle velden die in dit sjabloon voorkomen, gegroepeerd per artikel
  const groepen = useMemo(() => {
    const blokken = [...sjabloon.partijen, ...sjabloon.artikelen];
    return blokken
      .map((blok) => {
        const namen = new Set<string>();
        for (const r of blok.regels)
          for (const m of r.matchAll(/{{(\w+)}}/g)) namen.add(m[1]);
        const velden = [...namen]
          .filter((n) => !AUTOMATISCH.has(n) && !VERBORGEN.has(n) && VELDEN[n])
          .map((n) => ({ naam: n, label: LABELS[n] ?? VELDEN[n].label, eigenaar: VELDEN[n].eigenaar }))
          .sort((a, b) => {
            const ia = EERST.indexOf(a.naam);
            const ib = EERST.indexOf(b.naam);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          });
        return { titel: blok.label.replace(":", ""), velden };
      })
      .filter((g) => g.velden.length > 0);
  }, [sjabloon]);

  const [waarden, setWaarden] = useState<Record<string, string>>({
    ...STANDAARD,
    ...gedeeld,
    ...zonderLege(laatste?.waarden),
  });
  // Wat je in deze sessie hebt opgeslagen, zodat het meteen bij het andere
  // contract klaarstaat zonder de pagina te verversen.
  const [zojuistOpgeslagen, setZojuistOpgeslagen] = useState<Record<string, string>>({});
  const [datum, setDatum] = useState(new Date().toLocaleDateString("nl-NL"));
  const [plaats, setPlaats] = useState("Cuijk");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState<{ pdf: string; tekenlink: string } | null>(null);
  const [gekopieerd, setGekopieerd] = useState(false);

  function wissel(nieuw: Partij) {
    // wat je nu hebt getypt gaat mee naar het andere contract, ook zonder opslaan
    const meenemen = { ...zojuistOpgeslagen, ...zonderLege(waarden) };
    setZojuistOpgeslagen(meenemen);
    setPartij(nieuw);
    const c = eerder.find((x) => x.partij === nieuw && x.status !== "vervallen");
    setWaarden({ ...STANDAARD, ...gedeeld, ...zonderLege(c?.waarden), ...meenemen });
    setKlaar(null);
    setFout(null);
  }

  async function maken() {
    setBezig(true);
    setFout(null);
    try {
      // een tekstvak met meerdere regels verdelen over de regels in het contract
      const teVersturen: Record<string, string> = { ...waarden };
      for (const [eerste, alleRegels] of Object.entries(SAMENGEVOEGD)) {
        const regels = (waarden[eerste] ?? "").split("\n");
        alleRegels.forEach((naam, i) => { teVersturen[naam] = (regels[i] ?? "").trim(); });
      }

      const res = await fetch("/api/bookings/contracten/genereer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          partij,
          waarden: teVersturen,
          bureau_datum: datum,
          bureau_plaats: plaats,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fout || "Er ging iets mis");
      setKlaar({ pdf: data.pdf, tekenlink: data.tekenlink });
      setZojuistOpgeslagen((vorige) => ({ ...vorige, ...zonderLege(teVersturen) }));
    } catch (e: any) {
      setFout(e.message);
    } finally {
      setBezig(false);
    }
  }

  const eigenaarKleur = (e: string) =>
    e === "bureau" ? "bg-neutral-100 text-neutral-600"
    : e === "klant" ? "bg-amber-100 text-amber-700"
    : "bg-violet-100 text-violet-700";

  return (
    <div className="mt-6">
      {/* keuze klant of act */}
      <div className="flex gap-2">
        {(["klant", "act"] as Partij[]).map((p) => (
          <button
            key={p}
            onClick={() => wissel(p)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              partij === p ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {p === "klant" ? "Naar de opdrachtgever" : `Naar ${actNaam || "de act"}`}
          </button>
        ))}
      </div>

      {laatste?.getekend_op ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Dit contract is al ondertekend op {new Date(laatste.getekend_op).toLocaleDateString("nl-NL")}.
          Maak je een nieuwe versie, dan vervalt de oude.
        </p>
      ) : null}

      <p className="mt-5 text-sm text-neutral-500">
        Datum, tijden, locatie en bedragen worden automatisch uit de boeking gehaald.
        Hieronder vul je alleen aan wat je kwijt wilt — leeg laten mag, dan komen er stippellijnen op het contract.
      </p>

      {/* de invulvelden */}
      <div className="mt-5 space-y-5">
        {groepen.map((groep) => (
          <section key={groep.titel} className="rounded-2xl bg-white shadow-sm p-5">
            <h2 className="font-semibold text-neutral-900">{groep.titel}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {groep.velden.map((v) => (
                <label key={v.naam} className={RUIM.has(v.naam) ? "block sm:col-span-2" : "block"}>
                  <span className="flex items-center gap-2 text-xs text-neutral-600">
                    {v.label}
                    {v.eigenaar !== "bureau" ? (
                      <span className={`rounded px-1.5 py-0.5 text-[10px] ${eigenaarKleur(v.eigenaar)}`}>
                        vult {v.eigenaar} zelf in
                      </span>
                    ) : null}
                  </span>
                  {RUIM.has(v.naam) ? (
                    <textarea
                      rows={3}
                      value={waarden[v.naam] ?? ""}
                      onChange={(e) => setWaarden({ ...waarden, [v.naam]: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      value={waarden[v.naam] ?? ""}
                      onChange={(e) => setWaarden({ ...waarden, [v.naam]: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    />
                  )}
                  {UITLEG[v.naam] ? (
                    <span className="mt-1 block text-[11px] text-neutral-400">{UITLEG[v.naam]}</span>
                  ) : null}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* jouw ondertekening */}
      <section className="mt-5 rounded-2xl bg-white shadow-sm p-5">
        <h2 className="font-semibold text-neutral-900">Jouw ondertekening</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Je handtekening staat er automatisch op. Datum en plaats kun je hier aanpassen.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-neutral-600">Datum</span>
            <input value={datum} onChange={(e) => setDatum(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs text-neutral-600">Plaats</span>
            <input value={plaats} onChange={(e) => setPlaats(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </section>

      {fout ? <p className="mt-4 text-sm text-red-600">{fout}</p> : null}

      <button
        onClick={maken}
        disabled={bezig}
        className="mt-5 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-40"
      >
        {bezig ? "Bezig…" : "Contract maken"}
      </button>

      {/* resultaat */}
      {klaar ? (
        <section className="mt-5 rounded-2xl bg-white shadow-sm p-5">
          <h2 className="font-semibold text-neutral-900">Klaar</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={klaar.pdf} target="_blank" rel="noreferrer"
              className="rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800">
              Bekijk de pdf
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(klaar.tekenlink);
                setGekopieerd(true);
                setTimeout(() => setGekopieerd(false), 2500);
              }}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              {gekopieerd ? "Gekopieerd" : "Kopieer de tekenlink"}
            </button>
          </div>
          <p className="mt-3 break-all text-xs text-neutral-500">{klaar.tekenlink}</p>
          <p className="mt-2 text-xs text-neutral-500">
            Stuur deze link per mail of app naar {partij === "klant" ? "de opdrachtgever" : actNaam || "de act"}.
            Wie de link heeft, kan tekenen — deel hem dus niet openbaar.
          </p>
        </section>
      ) : null}
    </div>
  );
}
