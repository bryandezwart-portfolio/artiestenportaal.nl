"use client";

import React, { useState } from "react";

const VELD =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";

export default function AanvraagFormulier({ actSlug }: { actSlug: string }) {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [datum, setDatum] = useState("");
  const [tijdstip, setTijdstip] = useState("");
  const [plaats, setPlaats] = useState("");
  const [artiesten, setArtiesten] = useState("");
  const [bericht, setBericht] = useState("");

  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [verstuurd, setVerstuurd] = useState(false);

  async function versturen() {
    if (!naam.trim() || !email.trim() || !telefoon.trim() || !plaats.trim() || !bericht.trim()) {
      setFout("Vul de velden met een sterretje in.");
      return;
    }
    setFout("");
    setBezig(true);

    const res = await fetch("/api/aanvraag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naam,
        email,
        telefoon,
        datum: datum || null,
        tijdstip,
        plaats,
        artiesten,
        bericht,
        act_slug: actSlug,
      }),
    });

    setBezig(false);

    if (!res.ok) {
      const uitkomst = await res.json().catch(() => ({}));
      setFout(uitkomst.error || "Versturen mislukt. Probeer het nog eens.");
      return;
    }

    setVerstuurd(true);
  }

  if (verstuurd) {
    return (
      <div className="min-h-screen bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-[20px] font-semibold text-neutral-900">Aanvraag verstuurd</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
            Bedankt, {naam.split(" ")[0]}. Je krijgt zo een bevestiging per mail. Ik bel je binnen een
            werkdag om samen te kijken wat past.
          </p>
          <p className="mt-4 text-[13px] text-neutral-400">
            Er zit nog niets vast — dit is een vrijblijvende aanvraag.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-lg">
        <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">
          Artiest aanvragen
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
          Leuk dat je een aanvraag wilt doen! Laat hieronder weten wat je zoekt, dan bel ik je binnen
          een werkdag om even mee te denken. Uiteraard helemaal vrijblijvend.
        </p>

        <div className="mt-8 space-y-3">
          <input
            placeholder="Naam*"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className={VELD}
          />
          <input
            type="email"
            placeholder="E-mailadres*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={VELD}
          />
          <input
            type="tel"
            placeholder="Telefoonnummer*"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className={VELD}
          />
          <div>
            <label className="mb-1 block text-[12px] text-neutral-500">Datum</label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className={VELD}
            />
          </div>
          <input
            placeholder="Gewenst tijdstip"
            value={tijdstip}
            onChange={(e) => setTijdstip(e.target.value)}
            className={VELD}
          />
          <input
            placeholder="Plaats*"
            value={plaats}
            onChange={(e) => setPlaats(e.target.value)}
            className={VELD}
          />
          <input
            placeholder="Artiest(en)"
            value={artiesten}
            onChange={(e) => setArtiesten(e.target.value)}
            className={VELD}
          />
          <textarea
            placeholder="Bericht*"
            value={bericht}
            onChange={(e) => setBericht(e.target.value)}
            rows={5}
            className={VELD}
          />
        </div>

        <p className="mt-3 text-[12px] text-neutral-400">* Verplichte velden.</p>

        {fout && <p className="mt-3 text-[13px] text-red-600">{fout}</p>}

        <button
          onClick={versturen}
          disabled={bezig}
          className="mt-5 w-full rounded-xl bg-neutral-900 px-6 py-3 text-[15px] font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {bezig ? "Versturen…" : "Verstuur aanvraag"}
        </button>
      </div>
    </div>
  );
}
