"use client";

import { useState } from "react";

type Bestaand = {
  id: string;
  status: string;
  token: string | null;
  ingangsdatum: string | null;
  getekend_op: string | null;
} | null;

type Props = {
  actId: string;
  actNaam: string;
  bestaand: Bestaand;
};

const vandaag = () => new Date().toISOString().slice(0, 10);

export default function SamenwerkingKnop({ actId, actNaam, bestaand }: Props) {
  const [open, setOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState<{ pdf: string; tekenlink: string } | null>(null);
  const [gekopieerd, setGekopieerd] = useState(false);
  const [velden, setVelden] = useState({
    act_eigennaam: "",
    act_adres: "",
    act_plaats: "",
    ingangsdatum: vandaag(),
  });

  const getekend = bestaand?.status === "getekend";
  const loopt = bestaand && bestaand.status !== "vervallen";

  async function maken() {
    setBezig(true);
    setFout(null);
    try {
      const res = await fetch("/api/bookings/contracten/genereer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soort: "samenwerking",
          act_id: actId,
          partij: "act",
          waarden: {
            ...velden,
            ingangsdatum: velden.ingangsdatum
              ? new Date(velden.ingangsdatum + "T12:00:00").toLocaleDateString("nl-NL")
              : "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fout || "Er ging iets mis");
      setKlaar({ pdf: data.pdf, tekenlink: data.tekenlink });
    } catch (e: any) {
      setFout(e.message);
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">Samenwerkingsovereenkomst</h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Tekent de act één keer. Daarna volstaat per boeking de aftekenlijst.
          </p>
        </div>
        {!open && !klaar ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
          >
            {loopt ? "Opnieuw maken" : "Maken"}
          </button>
        ) : null}
      </div>

      {/* stand van zaken */}
      {getekend ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
          Getekend op {new Date(bestaand!.getekend_op!).toLocaleDateString("nl-NL")}.
          Maak je een nieuwe versie, dan vervalt deze.
        </p>
      ) : loopt ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Aangemaakt, nog niet getekend.
          {bestaand?.token ? (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/tekenen/${bestaand.token}`);
                setGekopieerd(true);
                setTimeout(() => setGekopieerd(false), 2500);
              }}
              className="ml-2 underline underline-offset-2"
            >
              {gekopieerd ? "Gekopieerd" : "Kopieer de tekenlink"}
            </button>
          ) : null}
        </p>
      ) : (
        <p className="mt-4 text-[13px] text-neutral-400">Nog geen overeenkomst.</p>
      )}

      {/* invulvelden */}
      {open && !klaar ? (
        <div className="mt-5 border-t border-neutral-100 pt-5">
          <p className="text-[13px] text-neutral-500">
            KvK-nummer, btw-nummer en rekeningnummer vult {actNaam || "de act"} zelf in bij het tekenen.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] text-neutral-600">Eigen naam achter de artiestennaam</span>
              <input
                value={velden.act_eigennaam}
                onChange={(e) => setVelden({ ...velden, act_eigennaam: e.target.value })}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-neutral-600">Ingangsdatum</span>
              <input
                type="date"
                value={velden.ingangsdatum}
                onChange={(e) => setVelden({ ...velden, ingangsdatum: e.target.value })}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-neutral-600">Adres</span>
              <input
                value={velden.act_adres}
                onChange={(e) => setVelden({ ...velden, act_adres: e.target.value })}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-neutral-600">Postcode en plaats</span>
              <input
                value={velden.act_plaats}
                onChange={(e) => setVelden({ ...velden, act_plaats: e.target.value })}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none"
              />
            </label>
          </div>

          {fout ? <p className="mt-3 text-[13px] text-red-600">{fout}</p> : null}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={maken}
              disabled={bezig}
              className="rounded-xl bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-40"
            >
              {bezig ? "Bezig…" : "Overeenkomst maken"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-neutral-100 px-5 py-2.5 text-[13px] font-medium text-neutral-700"
            >
              Annuleren
            </button>
          </div>
        </div>
      ) : null}

      {/* resultaat */}
      {klaar ? (
        <div className="mt-5 border-t border-neutral-100 pt-5">
          <div className="flex flex-wrap gap-3">
            <a
              href={klaar.pdf}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-neutral-100 px-4 py-2 text-[13px] font-medium text-neutral-800"
            >
              Bekijk de pdf
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(klaar.tekenlink);
                setGekopieerd(true);
                setTimeout(() => setGekopieerd(false), 2500);
              }}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white"
            >
              {gekopieerd ? "Gekopieerd" : "Kopieer de tekenlink"}
            </button>
          </div>
          <p className="mt-3 break-all text-[12px] text-neutral-500">{klaar.tekenlink}</p>
          <p className="mt-2 text-[12px] text-neutral-500">
            Stuur deze link naar {actNaam || "de act"}. Wie de link heeft kan tekenen, dus deel hem niet openbaar.
          </p>
        </div>
      ) : null}
    </div>
  );
}
