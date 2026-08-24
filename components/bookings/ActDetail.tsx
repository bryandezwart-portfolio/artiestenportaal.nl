"use client";

import React, { useState } from "react";

type ActType = "dj" | "artiest" | "band";

interface ActData {
  slug: string;
  name: string;
  type: ActType;
  genres: string[];
  tarief: string;
  contact: { naam: string; rol: string; email: string; telefoon: string };
  bookingenDezeMaand: { id: number; dag: string; tijd: string; locatie: string; status: string }[];
  onbeschikbaarheid: { id: number; van: string; tot: string; reden: string }[];
}

const TYPE_STYLES: Record<ActType, { label: string; badge: string }> = {
  dj: { label: "Dj", badge: "bg-violet-50 text-violet-700" },
  artiest: { label: "Artiest", badge: "bg-orange-50 text-orange-700" },
  band: { label: "Band", badge: "bg-blue-50 text-blue-700" },
};

const ACTS_DATA: Record<string, ActData> = {
  "dj-lumo": {
    slug: "dj-lumo",
    name: "DJ Lumo",
    type: "dj",
    genres: ["House", "Techno"],
    tarief: "€ 450",
    contact: { naam: "Mila Verhoeven", rol: "Manager", email: "mila@lumobooking.nl", telefoon: "06 12345678" },
    bookingenDezeMaand: [
      { id: 1, dag: "Vr 28 aug", tijd: "22:00 – 02:00", locatie: "Club Vault, Arnhem", status: "Definitief bevestigd" },
    ],
    onbeschikbaarheid: [{ id: 1, van: "3 sep", tot: "10 sep", reden: "Vakantie" }],
  },
  "sanne-de-wilde": {
    slug: "sanne-de-wilde",
    name: "Sanne de Wilde",
    type: "artiest",
    genres: ["Nederpop"],
    tarief: "€ 850",
    contact: { naam: "Sanne de Wilde", rol: "Artiest (zelf)", email: "sanne@email.nl", telefoon: "06 98765432" },
    bookingenDezeMaand: [
      { id: 1, dag: "Za 29 aug", tijd: "20:30 – 21:30", locatie: "Café De Kroon, Doetinchem", status: "Definitief bevestigd" },
    ],
    onbeschikbaarheid: [],
  },
  "the-riverbeats": {
    slug: "the-riverbeats",
    name: "The Riverbeats",
    type: "band",
    genres: ["Coverband", "Nederlandstalig"],
    tarief: "€ 1.200",
    contact: { naam: "Tom Jansen", rol: "Bandleider", email: "tom@riverbeats.nl", telefoon: "06 55501234" },
    bookingenDezeMaand: [
      { id: 1, dag: "Za 29 aug", tijd: "21:00 – 23:30", locatie: "Bruiloft, Zutphen", status: "Definitief bevestigd" },
    ],
    onbeschikbaarheid: [{ id: 1, van: "15 sep", tot: "22 sep", reden: "Volgeboekt" }],
  },
};

export default function ActDetail({ slug }: { slug: string }) {
  const act = ACTS_DATA[slug];
  const [copied, setCopied] = useState(false);

  if (!act) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-[14px] text-neutral-500">Deze act bestaat niet (nog).</p>
      </div>
    );
  }

  const calendarUrl =
    typeof window !== "undefined" ? `${window.location.origin}/api/calendar/${act.slug}` : `/api/calendar/${act.slug}`;
  const webcalUrl = calendarUrl.replace("https://", "webcal://").replace("http://", "webcal://");

  function handleCopy() {
    navigator.clipboard.writeText(calendarUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 px-6 py-10 sm:px-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{act.name}</h1>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_STYLES[act.type].badge}`}>
                {TYPE_STYLES[act.type].label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-neutral-400">Tarief</p>
              <p className="text-[17px] font-semibold text-neutral-900">{act.tarief}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {act.genres.map((g) => (
              <span key={g} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">
                {g}
              </span>
            ))}
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <p className="text-[13px] text-neutral-900">
              {act.contact.naam} · <span className="text-neutral-400">{act.contact.rol}</span>
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              {act.contact.email} · {act.contact.telefoon}
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            <button className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800">
              Magic link versturen
            </button>
            <button className="rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50">
              Bewerken
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold text-neutral-900">Kalender abonneren</h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Deel deze link met {act.name} — eenmaal toevoegen aan Google Calendar of Apple Kalender, en nieuwe
            boekingen verschijnen daarna automatisch, inclusief locatie en soundcheck-tijd.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={calendarUrl}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-600"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
            >
              {copied ? "Gekopieerd" : "Kopieer"}
            </button>
          </div>
          
          <a
            href={webcalUrl}
            className="mt-2 inline-block text-[12px] text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
          >
            Of open direct in de kalender-app
          </a>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-neutral-900">Boekingen deze maand</h2>
            <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50">
              Download pdf
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {act.bookingenDezeMaand.length === 0 ? (
              <p className="text-[13px] text-neutral-400">Geen boekingen deze maand.</p>
            ) : (
              act.bookingenDezeMaand.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">{b.dag}</p>
                    <p className="text-[13px] text-neutral-500">{b.locatie}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-neutral-900">{b.tijd}</p>
                    <p className="text-[11px] text-emerald-600">{b.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold text-neutral-900">Onbeschikbaarheid</h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Door de act zelf ingevuld — informatief, blokkeert geen boekingen. Check altijd zelf telefonisch voordat
            je boekt.
          </p>
          <div className="mt-4 space-y-2">
            {act.onbeschikbaarheid.length === 0 ? (
              <p className="text-[13px] text-neutral-400">Geen onbeschikbaarheid opgegeven.</p>
            ) : (
              act.onbeschikbaarheid.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5">
                  <span className="text-[13px] text-neutral-700">
                    {u.van} – {u.tot}
                  </span>
                  <span className="text-[13px] text-neutral-500">{u.reden}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
