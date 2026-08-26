"use client";

import React, { useState } from "react";

type ActType = "dj" | "artiest" | "band";
type TariefType = "vast" | "uur" | "half_uur";
type ArtiestKlasse = "A" | "B" | "C";
type SetMaat = "S" | "M" | "L" | "XL";

interface CapaciteitTier {
  id: number;
  vanaf: string;
  toeslag: string;
}

const TYPE_OPTIONS: { value: ActType; label: string; activeClass: string }[] = [
  { value: "dj", label: "Dj", activeClass: "bg-violet-500 text-white" },
  { value: "artiest", label: "Artiest", activeClass: "bg-orange-500 text-white" },
  { value: "band", label: "Band", activeClass: "bg-blue-500 text-white" },
];

let tierIdCounter = 1;

export default function NewActForm() {
  const [type, setType] = useState<ActType>("dj");
  const [name, setName] = useState("");
  const [genresInput, setGenresInput] = useState("");
  const [tariefType, setTariefType] = useState<TariefType>("vast");
  const [tariefBedrag, setTariefBedrag] = useState("");
  const [standaardCommissie, setStandaardCommissie] = useState("");
  const [artiestKlasse, setArtiestKlasse] = useState<ArtiestKlasse | null>(null);
  const [setMaat, setSetMaat] = useState<SetMaat | null>(null);
  const [speelschema, setSpeelschema] = useState("");
  const [aantalPersonen, setAantalPersonen] = useState("");
  const [tiers, setTiers] = useState<CapaciteitTier[]>([]);
  const [contactNaam, setContactNaam] = useState("");
  const [contactRol, setContactRol] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTelefoon, setContactTelefoon] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(e: React.FormEvent) {
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
    setError("");
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
          {name} staat nu klaar in je overzicht, met een tarief van € {tariefBedrag}{" "}
          {tariefType === "uur" ? "per uur" : "(vast bedrag)"}
          {standaardCommissie.trim() && `, standaardcommissie € ${standaardCommissie}`}.
        </p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. DJ Lumo"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Genres</label>
              <input
                type="text"
                value={genresInput}
                onChange={(e) => setGenresInput(e.target.value)}
                placeholder="House, Techno"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
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
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Standaardcommissie</label>
              <input
                type="text"
                value={standaardCommissie}
                onChange={(e) => setStandaardCommissie(e.target.value)}
                placeholder="Bijv. 150"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>
          <p className="-mt-3 text-[11px] text-neutral-400">
            Commissie is een vast bedrag in euro's, bovenop het tarief. Staat nooit op de factuur van de
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
                Geen toeslagdrempels ingesteld. Bijv. "vanaf 250 bezoekers: +€150".
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
            <p className="mb-3 text-[11px] text-neutral-400">
              Deze gegevens zie jij alleen, nooit de act zelf.
            </p>

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
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Aantal personen</label>
                <input
                  type="text"
                  value={aantalPersonen}
                  onChange={(e) => setAantalPersonen(e.target.value)}
                  placeholder="4"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>
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
        className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 lg:w-auto lg:px-8"
      >
        Act toevoegen
      </button>
    </form>
  );
}
