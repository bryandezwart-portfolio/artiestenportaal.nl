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
  actEmail?: string | null;
  actTelefoon?: string | null;
  bestaand: Bestaand;
};

const vandaag = () => new Date().toISOString().slice(0, 10);

/** 06 12345678 wordt 31612345678, zoals WhatsApp het wil. */
function waNummer(telefoon: string | null | undefined) {
  const cijfers = (telefoon ?? "").replace(/\D/g, "");
  if (!cijfers) return null;
  if (cijfers.startsWith("31")) return cijfers;
  if (cijfers.startsWith("0")) return "31" + cijfers.slice(1);
  return cijfers;
}

export default function SamenwerkingKnop({
  actId,
  actNaam,
  actEmail,
  actTelefoon,
  bestaand,
}: Props) {
  const [open, setOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [mailBezig, setMailBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [gemaild, setGemaild] = useState<string | null>(null);
  const [klaar, setKlaar] = useState<{ pdf: string; tekenlink: string; id: string } | null>(null);
  const [gekopieerd, setGekopieerd] = useState(false);
  const [velden, setVelden] = useState({
    act_eigennaam: "",
    act_adres: "",
    act_plaats: "",
    ingangsdatum: vandaag(),
  });

  const getekend = bestaand?.status === "getekend";
  const loopt = bestaand && bestaand.status !== "vervallen";

  // het lopende contract: net gemaakt, of wat er al stond
  const contractId = klaar?.id ?? (loopt && !getekend ? bestaand!.id : null);
  const tekenlink =
    klaar?.tekenlink ??
    (loopt && !getekend && bestaand!.token && typeof window !== "undefined"
      ? `${window.location.origin}/tekenen/${bestaand!.token}`
      : null);

  const nummer = waNummer(actTelefoon);
  const waLink =
    nummer && tekenlink
      ? `https://wa.me/${nummer}?text=${encodeURIComponent(
          `Hoi ${actNaam}, hierbij de samenwerkingsovereenkomst tussen ons. ` +
            `Je tekent 'm \u00e9\u00e9n keer; daarna is per boeking alleen nog een korte aftekenlijst nodig. ` +
            `Bekijken en ondertekenen kan hier: ${tekenlink}`,
        )}`
      : null;

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
      setKlaar({ pdf: data.pdf, tekenlink: data.tekenlink, id: data.contract_id });
    } catch (e: any) {
      setFout(e.message);
    } finally {
      setBezig(false);
    }
  }

  async function mailen() {
    if (!contractId) return;
    setMailBezig(true);
    setFout(null);
    try {
      const res = await fetch("/api/bookings/contracten/versturen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_id: contractId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fout || "Versturen mislukt");
      setGemaild(data.naar);
    } catch (e: any) {
      setFout(e.message);
    } finally {
      setMailBezig(false);
    }
  }

  function kopieer() {
    if (!tekenlink) return;
    navigator.clipboard.writeText(tekenlink);
    setGekopieerd(true);
    setTimeout(() => setGekopieerd(false), 2500);
  }

  const knop = "rounded-xl px-4 py-2 text-[13px] font-medium transition";

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
            className={`${knop} shrink-0 bg-neutral-900 text-white hover:bg-neutral-800`}
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
      ) : loopt && !klaar ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Aangemaakt, nog niet getekend.
        </p>
      ) : !loopt && !klaar ? (
        <p className="mt-4 text-[13px] text-neutral-400">Nog geen overeenkomst.</p>
      ) : null}

      {/* invulvelden */}
      {open && !klaar ? (
        <div className="mt-5 border-t border-neutral-100 pt-5">
          <p className="text-[13px] text-neutral-500">
            KvK-nummer, btw-nummer en rekeningnummer vult {actNaam || "de act"} zelf in bij het tekenen.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] text-neutral-600">Naam van de persoon die tekent</span>
              <input
                value={velden.act_eigennaam}
                onChange={(e) => setVelden({ ...velden, act_eigennaam: e.target.value })}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-neutral-400">
                De echte naam achter de artiestennaam. Bij een band: degene die namens de band tekent.
                Weet je 'm niet, laat leeg — de act vult 'm dan zelf in.
              </span>
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

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={maken}
              disabled={bezig}
              className={`${knop} bg-neutral-900 px-5 py-2.5 text-white disabled:opacity-40`}
            >
              {bezig ? "Bezig…" : "Overeenkomst maken"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${knop} bg-neutral-100 px-5 py-2.5 text-neutral-700`}
            >
              Annuleren
            </button>
          </div>
        </div>
      ) : null}

      {/* versturen */}
      {contractId && tekenlink ? (
        <div className="mt-5 border-t border-neutral-100 pt-5">
          <p className="text-[13px] text-neutral-500">
            Stuur de tekenlink naar {actNaam || "de act"}. Wie de link heeft kan tekenen, dus deel
            hem niet openbaar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={mailen}
              disabled={mailBezig || !actEmail}
              className={`${knop} bg-neutral-900 text-white disabled:opacity-40`}
              title={actEmail ? `Naar ${actEmail}` : "Geen e-mailadres bij deze act"}
            >
              {mailBezig ? "Bezig…" : "Stuur per mail"}
            </button>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className={`${knop} bg-emerald-600 text-white hover:bg-emerald-700`}
              >
                Stuur via WhatsApp
              </a>
            ) : null}
            <button type="button" onClick={kopieer} className={`${knop} bg-neutral-100 text-neutral-800`}>
              {gekopieerd ? "Gekopieerd" : "Kopieer de link"}
            </button>
            {klaar ? (
              <a
                href={klaar.pdf}
                target="_blank"
                rel="noreferrer"
                className={`${knop} bg-neutral-100 text-neutral-800`}
              >
                Bekijk de pdf
              </a>
            ) : null}
          </div>

          {gemaild ? (
            <p className="mt-3 text-[13px] text-emerald-700">Verstuurd naar {gemaild}.</p>
          ) : null}
          {!actEmail ? (
            <p className="mt-3 text-[12px] text-neutral-400">
              Er staat geen e-mailadres bij deze act, dus mailen kan niet.
            </p>
          ) : null}
          <p className="mt-3 break-all text-[12px] text-neutral-400">{tekenlink}</p>
        </div>
      ) : null}

      {fout ? <p className="mt-4 text-[13px] text-red-600">{fout}</p> : null}
    </div>
  );
}
