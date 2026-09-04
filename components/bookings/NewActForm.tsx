"use client";

import React, { useState } from "react";

type ActType = "dj" | "artiest" | "band" | "act" | "overig";
type TariefType = "vast" | "uur" | "half_uur";
type ArtiestKlasse = "A" | "B" | "C";
type SetMaat = "S" | "M" | "L" | "XL";
type BoekingType = "eigen_act" | "doorboeking";

interface CapaciteitTier {
  id: number;
  vanaf: string;
  toeslag: string;
}

const TYPE_OPTIONS: { value: ActType; label: string; activeClass: string }[] = [
  { value: "dj", label: "Dj", activeClass: "bg-violet-500 text-white" },
  { value: "artiest", label: "Artiest", activeClass: "bg-orange-500 text-white" },
  { value: "band", label: "Band", activeClass: "bg-blue-500 text-white" },
  { value: "act", label: "Act", activeClass: "bg-emerald-500 text-white" },
  { value: "overig", label: "Overig", activeClass: "bg-amber-500 text-white" },
];

const SPECIALITEIT_OPTIONS = [
  "Goochelaar",
  "Sint en Piet(en)",
  "Vuurspuwer",
  "Danser / danseres",
  "Karikaturist",
  "Steltloper",
  "Ballonartiest",
  "Stand-up",
  "Anders",
];

const TIJDPERKEN = ["60s", "70s", "80s", "90s", "00s", "10s", "20s"];

const MAANDEN = [
  { nr: 1, label: "jan" },
  { nr: 2, label: "feb" },
  { nr: 3, label: "mrt" },
  { nr: 4, label: "apr" },
  { nr: 5, label: "mei" },
  { nr: 6, label: "jun" },
  { nr: 7, label: "jul" },
  { nr: 8, label: "aug" },
  { nr: 9, label: "sep" },
  { nr: 10, label: "okt" },
  { nr: 11, label: "nov" },
  { nr: 12, label: "dec" },
];

let tierIdCounter = 1;

/** "1.250,50" en "1250.50" worden allebei 1250.5. Leeg wordt null. */
function parseBedrag(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  const genormaliseerd = s.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = Number(genormaliseerd);
  return Number.isFinite(n) ? n : null;
}

function parseGeheel(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  const n = parseInt(s.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function maakSlug(naam: string): string {
  return naam
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewActForm() {
  const [type, setType] = useState<ActType>("dj");
  const [specialiteit, setSpecialiteit] = useState("");
  const [name, setName] = useState("");
  const [genresInput, setGenresInput] = useState("");
  const [tijdperken, setTijdperken] = useState<string[]>([]);
  const [publiekMin, setPubliekMin] = useState("");
  const [publiekMax, setPubliekMax] = useState("");
  const [tariefType, setTariefType] = useState<TariefType>("vast");
  const [tariefBedrag, setTariefBedrag] = useState("");
  const [standaardCommissie, setStandaardCommissie] = useState("");
  const [artiestKlasse, setArtiestKlasse] = useState<ArtiestKlasse | null>(null);
  const [setMaat, setSetMaat] = useState<SetMaat | null>(null);
  const [speelschema, setSpeelschema] = useState("");
  const [aantalPersonen, setAantalPersonen] = useState("");
  const [tiers, setTiers] = useState<CapaciteitTier[]>([]);
  const [boekingType, setBoekingType] = useState<BoekingType>("eigen_act");
  const [bureauNaam, setBureauNaam] = useState("");
  const [bureauContact, setBureauContact] = useState("");
  const [bureauEmail, setBureauEmail] = useState("");
  const [bureauTelefoon, setBureauTelefoon] = useState("");
  const [inkoopBedrag, setInkoopBedrag] = useState("");
  const [volwassenenOnly, setVolwassenenOnly] = useState(false);
  const [publiekZichtbaar, setPubliekZichtbaar] = useState(true);
  const [seizoenMaanden, setSeizoenMaanden] = useState<number[]>([]);
  const [contactNaam, setContactNaam] = useState("");
  const [contactRol, setContactRol] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTelefoon, setContactTelefoon] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [error, setError] = useState("");

  function addTier() {
    tierIdCounter += 1;
    setTiers([...tiers, { id: tierIdCounter, vanaf: "", toeslag: "" }]);
  }

  function updateTier(id: number, field: "vanaf" | "toeslag", value: string) {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function removeTier(id: number) {
    setTiers(tiers.filter((t) => t.id !== id));
  }

  function toggleTijdperk(t: string) {
    setTijdperken(tijdperken.includes(t) ? tijdperken.filter((x) => x !== t) : [...tijdperken, t]);
  }

  function toggleMaand(nr: number) {
    setSeizoenMaanden(
      seizoenMaanden.includes(nr) ? seizoenMaanden.filter((x) => x !== nr) : [...seizoenMaanden, nr]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !tariefBedrag.trim() || !contactNaam.trim() || !contactEmail.trim()) {
      setError("Vul in elk geval naam, tarief, contactpersoon en e-mail in.");
      return;
    }
    const incompleteTier = tiers.some((t) => !t.vanaf.trim() || !t.toeslag.trim());
    if (incompleteTier) {
      setError("Vul bij elke toeslagdrempel zowel het aantal bezoekers als het bedrag in, of verwijder de lege regel.");
      return;
    }
    if (boekingType === "doorboeking" && !bureauNaam.trim()) {
      setError("Vul bij een doorboeking in via welk bureau de act loopt.");
      return;
    }
    const min = parseGeheel(publiekMin);
    const max = parseGeheel(publiekMax);
    if (min !== null && max !== null && min > max) {
      setError("Het minimum aantal bezoekers kan niet hoger zijn dan het maximum.");
      return;
    }

    setError("");
    setBezig(true);

    const res = await fetch("/api/bookings/acts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      slug: maakSlug(name),
      name: name.trim(),
      type,
      specialiteit: type === "act" ? specialiteit || null : null,
      genres: genresInput
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      tijdperken,
      publiek_min: min ?? 0,
      publiek_max: max ?? 100000,
      tarief_type: tariefType,
      tarief_bedrag: parseBedrag(tariefBedrag),
      standaard_commissie: parseBedrag(standaardCommissie),
      tiers: tiers.map((t) => ({
        vanaf: parseGeheel(t.vanaf),
        toeslag: parseBedrag(t.toeslag),
      })),
      artiestklasse: artiestKlasse,
      setmaat: setMaat,
      speelschema: speelschema.trim() || null,
      aantal_personen: parseGeheel(aantalPersonen),
      boeking_type: boekingType,
      bureau_naam: boekingType === "doorboeking" ? bureauNaam.trim() || null : null,
      bureau_contact: boekingType === "doorboeking" ? bureauContact.trim() || null : null,
      bureau_email: boekingType === "doorboeking" ? bureauEmail.trim() || null : null,
      bureau_telefoon: boekingType === "doorboeking" ? bureauTelefoon.trim() || null : null,
      inkoop_bedrag: boekingType === "doorboeking" ? parseBedrag(inkoopBedrag) : null,
      volwassenen_only: volwassenenOnly,
      publiek_zichtbaar: publiekZichtbaar,
      seizoen_maanden: seizoenMaanden.sort((a, b) => a - b),
      contact_naam: contactNaam.trim(),
      contact_rol: contactRol.trim() || null,
      contact_email: contactEmail.trim(),
      contact_telefoon: contactTelefoon.trim() || null,
      }),
    });

    setBezig(false);

    const uitkomst = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(
        uitkomst.code === "23505"
          ? "Er bestaat al een act met deze naam. Kies een andere naam of vul een variant in."
          : `Opslaan mislukt: ${uitkomst.error || res.statusText}`
      );
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
      >
        <p className="text-[15px] font-semibold text-neutral-900">Act toegevoegd</p>
        <p className="mt-1 text-[13px] text-neutral-500">
          {name} staat nu in je overzicht, met een tarief van € {tariefBedrag}{" "}
          {tariefType === "uur" ? "per uur" : tariefType === "half_uur" ? "per half uur" : "(vast bedrag)"}
          {standaardCommissie.trim() && `, standaardcommissie € ${standaardCommissie}`}.
        </p>
        <a
          href="/bookings/acts/nieuw"
          className="mt-4 inline-block rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Nog een act toevoegen
        </a>
      </div>
    );
  }

  const isAct = type === "act";
  const isDoorboeking = boekingType === "doorboeking";

  const inputClass =
    "w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";
  const kleinInputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mb-6">
        <p className="text-[13px] font-medium text-neutral-400">BDZBookings</p>
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Nieuwe act toevoegen</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Linkerkolom: basisgegevens en tarief */}
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Type</label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
                    type === opt.value ? opt.activeClass + " border-transparent" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {isAct && (
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Soort act</label>
              <select
                value={specialiteit}
                onChange={(e) => setSpecialiteit(e.target.value)}
                className={inputClass}
              >
                <option value="">Kies een soort…</option>
                {SPECIALITEIT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. DJ Lumo"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Genres</label>
              <input
                type="text"
                value={genresInput}
                onChange={(e) => setGenresInput(e.target.value)}
                placeholder="House, Techno"
                className={inputClass}
              />
            </div>
          </div>
          {genresInput.trim() && (
            <div className="-mt-3 flex flex-wrap gap-1.5">
              {genresInput
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean)
                .map((g) => (
                  <span key={g} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">
                    {g}
                  </span>
                ))}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Tijdperken</label>
            <div className="flex flex-wrap gap-1.5">
              {TIJDPERKEN.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTijdperk(t)}
                  className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${
                    tijdperken.includes(t)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Los van genre. Een coverband kan pop spelen én de jaren 80 tot 00 bestrijken.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Geschikt voor publiek</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={publiekMin}
                onChange={(e) => setPubliekMin(e.target.value)}
                placeholder="50"
                className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
              <span className="text-[13px] text-neutral-500">tot</span>
              <input
                type="text"
                value={publiekMax}
                onChange={(e) => setPubliekMax(e.target.value)}
                placeholder="400"
                className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
              <span className="text-[13px] text-neutral-500">personen</span>
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Laat leeg als er geen ondergrens of bovengrens is.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Manier van rekenen</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTariefType("vast")}
                className={`flex-1 rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
                  tariefType === "vast"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Per optreden
              </button>
              <button
                type="button"
                onClick={() => setTariefType("uur")}
                className={`flex-1 rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
                  tariefType === "uur"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Per uur
              </button>
              <button
                type="button"
                onClick={() => setTariefType("half_uur")}
                className={`flex-1 rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
                  tariefType === "half_uur"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Per half uur
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                {tariefType === "uur" ? "Tarief per uur" : tariefType === "half_uur" ? "Tarief per half uur" : "Basistarief"}
              </label>
              <input
                type="text"
                value={tariefBedrag}
                onChange={(e) => setTariefBedrag(e.target.value)}
                placeholder={tariefType === "vast" ? "Bijv. 450" : "Bijv. 125"}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Standaardcommissie</label>
              <input
                type="text"
                value={standaardCommissie}
                onChange={(e) => setStandaardCommissie(e.target.value)}
                placeholder="Bijv. 150"
                className={inputClass}
              />
            </div>
          </div>
          <p className="-mt-3 text-[11px] text-neutral-400">
            Commissie is een vast bedrag in euro&apos;s, bovenop het tarief. Staat nooit op de factuur van de
            opdrachtgever — alleen zichtbaar voor jou.
          </p>

          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-neutral-700">Toeslag bij groter publiek</p>
              <button
                type="button"
                onClick={addTier}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50"
              >
                + Drempel toevoegen
              </button>
            </div>

            {tiers.length === 0 ? (
              <p className="text-[12px] text-neutral-400">
                Geen toeslagdrempels ingesteld. Bijv. &quot;vanaf 250 bezoekers: +€150&quot;.
              </p>
            ) : (
              <div className="space-y-2">
                {tiers.map((tier) => (
                  <div key={tier.id} className="flex items-center gap-2">
                    <span className="text-[12px] text-neutral-500">Vanaf</span>
                    <input
                      type="text"
                      value={tier.vanaf}
                      onChange={(e) => updateTier(tier.id, "vanaf", e.target.value)}
                      placeholder="250"
                      className="w-16 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                    <span className="text-[12px] text-neutral-500">bez.: +€</span>
                    <input
                      type="text"
                      value={tier.toeslag}
                      onChange={(e) => updateTier(tier.id, "toeslag", e.target.value)}
                      placeholder="150"
                      className="w-16 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeTier(tier.id)}
                      className="ml-auto text-[12px] text-neutral-400 hover:text-red-600"
                    >
                      Verwijderen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rechterkolom: interne classificatie en contactpersoon */}
        <div className="space-y-5">
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <p className="mb-1 text-[13px] font-medium text-neutral-700">Intern — niet zichtbaar voor de act</p>
            <p className="mb-3 text-[11px] text-neutral-400">Deze gegevens zie jij alleen, nooit de act zelf.</p>

            <div className="mb-3">
              <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Herkomst</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setBoekingType("eigen_act")}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[13px] font-medium transition ${
                    boekingType === "eigen_act"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Eigen act
                </button>
                <button
                  type="button"
                  onClick={() => setBoekingType("doorboeking")}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[13px] font-medium transition ${
                    boekingType === "doorboeking"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Doorboeking
                </button>
              </div>
            </div>

            {isDoorboeking && (
              <div className="mb-3 space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={bureauNaam}
                    onChange={(e) => setBureauNaam(e.target.value)}
                    placeholder="Bureau"
                    className={kleinInputClass}
                  />
                  <input
                    type="text"
                    value={bureauContact}
                    onChange={(e) => setBureauContact(e.target.value)}
                    placeholder="Contactpersoon"
                    className={kleinInputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={bureauEmail}
                    onChange={(e) => setBureauEmail(e.target.value)}
                    placeholder="E-mail bureau"
                    className={kleinInputClass}
                  />
                  <input
                    type="text"
                    value={bureauTelefoon}
                    onChange={(e) => setBureauTelefoon(e.target.value)}
                    placeholder="Telefoon bureau"
                    className={kleinInputClass}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={inkoopBedrag}
                    onChange={(e) => setInkoopBedrag(e.target.value)}
                    placeholder="Inkooptarief — wat jij het bureau betaalt"
                    className={kleinInputClass}
                  />
                  {parseBedrag(inkoopBedrag) !== null && parseBedrag(tariefBedrag) !== null && (
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      Marge: €{" "}
                      {((parseBedrag(tariefBedrag) as number) - (parseBedrag(inkoopBedrag) as number)).toLocaleString(
                        "nl-NL",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Artiestklasse</label>
                <div className="flex gap-1.5">
                  {(["A", "B", "C"] as ArtiestKlasse[]).map((klasse) => (
                    <button
                      key={klasse}
                      type="button"
                      onClick={() => setArtiestKlasse(klasse)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-[13px] font-medium transition ${
                        artiestKlasse === klasse
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {klasse}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Setmaat</label>
                <div className="flex gap-1.5">
                  {(["S", "M", "L", "XL"] as SetMaat[]).map((maat) => (
                    <button
                      key={maat}
                      type="button"
                      onClick={() => setSetMaat(maat)}
                      className={`flex-1 rounded-lg border px-1.5 py-1.5 text-[12px] font-medium transition ${
                        setMaat === maat
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {maat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Speelschema</label>
                <input
                  type="text"
                  value={speelschema}
                  onChange={(e) => setSpeelschema(e.target.value)}
                  placeholder="3x45 min"
                  className={kleinInputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Aantal personen</label>
                <input
                  type="text"
                  value={aantalPersonen}
                  onChange={(e) => setAantalPersonen(e.target.value)}
                  placeholder="4"
                  className={kleinInputClass}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Alleen in deze maanden</label>
              <div className="flex flex-wrap gap-1">
                {MAANDEN.map((m) => (
                  <button
                    key={m.nr}
                    type="button"
                    onClick={() => toggleMaand(m.nr)}
                    className={`rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                      seizoenMaanden.includes(m.nr)
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Niets aanklikken = het hele jaar boekbaar. Handig voor bijv. Sint en Piet.
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-neutral-200 pt-3">
              <label className="flex items-center gap-2 text-[12px] text-neutral-600">
                <input
                  type="checkbox"
                  checked={volwassenenOnly}
                  onChange={(e) => setVolwassenenOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                Alleen voor besloten evenementen (18+)
              </label>
              <label className="flex items-center gap-2 text-[12px] text-neutral-600">
                <input
                  type="checkbox"
                  checked={publiekZichtbaar}
                  onChange={(e) => setPubliekZichtbaar(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                Tonen op de publieke website
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="mb-3 text-[13px] font-medium text-neutral-700">Contactpersoon / manager</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactNaam}
                  onChange={(e) => setContactNaam(e.target.value)}
                  placeholder="Naam"
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={contactRol}
                  onChange={(e) => setContactRol(e.target.value)}
                  placeholder="Rol (bijv. Manager)"
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="E-mailadres"
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={contactTelefoon}
                  onChange={(e) => setContactTelefoon(e.target.value)}
                  placeholder="Telefoonnummer"
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mt-5 text-[13px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={bezig}
        className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 lg:w-auto lg:px-8"
      >
        {bezig ? "Bezig met opslaan…" : "Act toevoegen"}
      </button>
    </form>
  );
}
