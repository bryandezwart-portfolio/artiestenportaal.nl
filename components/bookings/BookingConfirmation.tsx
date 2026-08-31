"use client";

import React, { useState } from "react";

export interface BevestigBoeking {
  id: string;
  act_naam: string;
  datum: string;
  eind_datum: string;
  start_tijd: string;
  eind_tijd: string;
  locatie: string;
  speelschema: string | null;
  bezoekers: number | null;
  bezetting: string;
  posten_act: { omschrijving: string; bedrag: number }[];
  gelegenheid: string | null;
  opmerkingen: string | null;
  soundcheck_notitie: string | null;
  act_bedrag: number;
  bevestigd_door_act: boolean;
  bevestigd_op: string | null;
  gemeld_klopt_niet: boolean;
}

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function langeDatum(d: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d + "T12:00:00"));
}

function tijd(t: string) {
  return String(t).slice(0, 5);
}

function Regel({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="shrink-0 text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-900">{waarde}</span>
    </div>
  );
}

export default function BookingConfirmation({ boeking }: { boeking: BevestigBoeking }) {
  const [confirmed, setConfirmed] = useState(boeking.bevestigd_door_act);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(
    boeking.bevestigd_op
      ? new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(boeking.bevestigd_op)
        )
      : null
  );
  const [showIssue, setShowIssue] = useState(false);
  const [issueSent, setIssueSent] = useState(boeking.gemeld_klopt_niet);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function stuur(kloptNiet: boolean) {
    if (bezig) return;
    setBezig(true);
    setFout("");
    const res = await fetch(`/api/bookings/bevestig/${boeking.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klopt_niet: kloptNiet }),
    });
    setBezig(false);
    if (!res.ok) {
      setFout("Er ging iets mis. Probeer het nog eens of bel Bryan even.");
      return;
    }
    if (kloptNiet) {
      setIssueSent(true);
    } else {
      setConfirmed(true);
      setConfirmedAt(
        new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date())
      );
    }
  }

  const overMiddernacht = boeking.eind_datum !== boeking.datum;

  return (
    <div
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-[13px] font-medium text-neutral-400">BDZBookings</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
          Bevestiging voor {boeking.act_naam}
        </h1>

        <div className="mt-5 space-y-2 rounded-xl bg-neutral-50 p-4">
          <Regel label="Datum" waarde={langeDatum(boeking.datum)} />
          <Regel
            label="Tijd"
            waarde={`${tijd(boeking.start_tijd)} – ${tijd(boeking.eind_tijd)}${
              overMiddernacht ? ` (${langeDatum(boeking.eind_datum).split(" ")[0]})` : ""
            }`}
          />
          <Regel label="Locatie" waarde={boeking.locatie} />
          {boeking.speelschema && <Regel label="Speelschema" waarde={boeking.speelschema} />}
          {boeking.gelegenheid && (
            <Regel
              label="Gelegenheid"
              waarde={boeking.gelegenheid.charAt(0).toUpperCase() + boeking.gelegenheid.slice(1)}
            />
          )}
          {boeking.bezetting ? <Regel label="Bezetting" waarde={boeking.bezetting} /> : null}
          {boeking.bezoekers ? (
            <Regel label="Verwacht publiek" waarde={`ca. ${boeking.bezoekers} personen`} />
          ) : null}

          {boeking.posten_act.length > 0 && (
            <div className="border-t border-neutral-200 pt-2">
              {boeking.posten_act.map((p, i) => (
                <Regel key={i} label={p.omschrijving || "Extra post"} waarde={euro(Number(p.bedrag))} />
              ))}
            </div>
          )}

          <div className="border-t border-neutral-200 pt-2">
            <Regel label="Totaal voor jou" waarde={euro(boeking.act_bedrag)} />
          </div>
        </div>

        {(boeking.opmerkingen || boeking.soundcheck_notitie) && (
          <div className="mt-3 rounded-xl border border-neutral-200 p-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-neutral-400">Voor deze avond</p>
            {boeking.opmerkingen && (
              <p className="mt-1.5 whitespace-pre-line text-[13px] text-neutral-700">{boeking.opmerkingen}</p>
            )}
            {boeking.soundcheck_notitie && (
              <p className="mt-1.5 whitespace-pre-line text-[13px] text-neutral-700">
                {boeking.soundcheck_notitie}
              </p>
            )}
          </div>
        )}

        {fout && <p className="mt-4 text-[13px] text-red-600">{fout}</p>}

        {!confirmed ? (
          <>
            <p className="mt-5 text-[13px] text-neutral-500">
              Zoals telefonisch afgestemd — bevestig hieronder voor de administratie.
            </p>
            <button
              type="button"
              disabled={bezig}
              onClick={() => stuur(false)}
              className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {bezig ? "Bezig..." : "Bevestigen"}
            </button>

            {!showIssue ? (
              <button
                type="button"
                onClick={() => setShowIssue(true)}
                className="mt-3 w-full text-center text-[13px] text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
              >
                Klopt dit niet?
              </button>
            ) : !issueSent ? (
              <div className="mt-3 rounded-xl border border-neutral-200 p-3">
                <p className="text-[13px] text-neutral-600">
                  Neem even contact op met Bryan om dit recht te zetten — dit scherm stuurt geen automatische
                  afwijzing.
                </p>
                <button
                  type="button"
                  disabled={bezig}
                  onClick={() => stuur(true)}
                  className="mt-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Laat weten dat er iets niet klopt
                </button>
              </div>
            ) : (
              <p className="mt-3 text-center text-[13px] text-neutral-500">Bryan is op de hoogte gebracht.</p>
            )}
          </>
        ) : (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center">
            <p className="text-[14px] font-medium text-emerald-800">Bevestigd</p>
            {confirmedAt && <p className="mt-0.5 text-[12px] text-emerald-700">Bevestigd op {confirmedAt}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
