"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Aanvraag = {
  id: string;
  naam: string;
  email: string;
  telefoon: string;
  datum: string | null;
  tijdstip: string | null;
  plaats: string;
  artiesten: string | null;
  bericht: string;
  status: string;
  act_id: string | null;
  created_at: string;
  bdzbookings_acts?: { slug: string; name: string } | null;
};

const STATUSSEN = ["nieuw", "gebeld", "omgezet", "afgewezen"];

const STATUS_KLEUR: Record<string, string> = {
  nieuw: "bg-amber-50 text-amber-700",
  gebeld: "bg-blue-50 text-blue-700",
  omgezet: "bg-emerald-50 text-emerald-700",
  afgewezen: "bg-neutral-100 text-neutral-400",
};

function datumKort(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function langeDatum(datum: string | null) {
  if (!datum) return "geen datum opgegeven";
  return new Date(datum).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AanvragenLijst({ aanvragen }: { aanvragen: Aanvraag[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("open");
  const [bezig, setBezig] = useState(false);
  const [verwijderVraag, setVerwijderVraag] = useState<string | null>(null);

  const zichtbaar = aanvragen.filter((a) => {
    if (filter === "alles") return true;
    if (filter === "open") return a.status === "nieuw" || a.status === "gebeld";
    return a.status === filter;
  });

  async function wijzigStatus(id: string, status: string) {
    setBezig(true);
    await fetch("/api/bookings/aanvragen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBezig(false);
    router.refresh();
  }

  async function verwijder(id: string) {
    setBezig(true);
    await fetch("/api/bookings/aanvragen", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBezig(false);
    setVerwijderVraag(null);
    setOpen(null);
    router.refresh();
  }

  function boekingsLink(a: Aanvraag) {
    const p = new URLSearchParams();
    if (a.datum) p.set("datum", a.datum);
    if (a.plaats) p.set("locatie", a.plaats);
    if (a.bdzbookings_acts?.slug) p.set("act", a.bdzbookings_acts.slug);
    return `/bookings/nieuw?${p.toString()}`;
  }

  const nieuweCount = aanvragen.filter((a) => a.status === "nieuw").length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-neutral-900">Aanvragen</h1>
        <p className="text-[13px] text-neutral-500">
          Binnengekomen via het aanvraagformulier.
          {nieuweCount > 0 && ` ${nieuweCount} nog niet opgepakt.`}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["open", "alles", ...STATUSSEN].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-[12px] ${
              filter === f
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {zichtbaar.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-[14px] text-neutral-400">
          Nog geen aanvragen in deze weergave.
        </div>
      )}

      <div className="space-y-2">
        {zichtbaar.map((a) => {
          const isOpen = open === a.id;
          return (
            <div key={a.id} className="rounded-2xl border border-neutral-200 bg-white">
              <button
                onClick={() => setOpen(isOpen ? null : a.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-neutral-900">{a.naam}</span>
                    <span className="text-[12px] text-neutral-400">{a.plaats}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-neutral-500">
                    {a.datum ? langeDatum(a.datum) : "geen datum"}
                    {a.bdzbookings_acts?.name && ` · ${a.bdzbookings_acts.name}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-neutral-400">{datumKort(a.created_at)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_KLEUR[a.status] ?? ""}`}>
                    {a.status}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-neutral-100 px-5 py-4">
                  <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                    <div>
                      <span className="text-neutral-500">Telefoon</span>
                      <div className="text-neutral-900">
                        <a href={`tel:${a.telefoon}`} className="underline">{a.telefoon}</a>
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">E-mail</span>
                      <div className="text-neutral-900">
                        <a href={`mailto:${a.email}`} className="underline">{a.email}</a>
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Datum</span>
                      <div className="text-neutral-900">{langeDatum(a.datum)}</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Tijdstip</span>
                      <div className="text-neutral-900">{a.tijdstip || "—"}</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Plaats</span>
                      <div className="text-neutral-900">{a.plaats}</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Artiest(en)</span>
                      <div className="text-neutral-900">{a.artiesten || "—"}</div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl bg-neutral-50 px-4 py-3">
                    <p className="mb-1 text-[12px] text-neutral-500">Bericht</p>
                    <p className="whitespace-pre-wrap text-[14px] text-neutral-800">{a.bericht}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-neutral-500">Status:</span>
                    {STATUSSEN.map((s) => (
                      <button
                        key={s}
                        onClick={() => wijzigStatus(a.id, s)}
                        disabled={bezig}
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          a.status === s
                            ? STATUS_KLEUR[s]
                            : "border border-neutral-200 bg-white text-neutral-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={boekingsLink(a)}
                      className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
                    >
                      Omzetten naar boeking
                    </Link>
                    {verwijderVraag === a.id ? (
                      <span className="flex items-center gap-2">
                        <span className="text-[12px] text-neutral-500">Zeker weten?</span>
                        <button
                          onClick={() => verwijder(a.id)}
                          disabled={bezig}
                          className="text-[12px] text-red-600 underline"
                        >
                          ja, verwijder
                        </button>
                        <button
                          onClick={() => setVerwijderVraag(null)}
                          className="text-[12px] text-neutral-400 underline"
                        >
                          nee
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setVerwijderVraag(a.id)}
                        className="text-[12px] text-neutral-400 underline"
                      >
                        verwijderen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
