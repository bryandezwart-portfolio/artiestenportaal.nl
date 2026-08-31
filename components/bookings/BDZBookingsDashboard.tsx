"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

type ActType = "dj" | "artiest" | "band" | "special";

interface Contact {
  naam: string;
  rol: string;
  email: string;
  telefoon: string;
}

interface Act {
  id: number;
  slug: string;
  name: string;
  type: ActType;
  genres: string[];
  actief?: boolean | null;
  specialiteit?: string | null;
  tarief: string;
  live?: boolean;
  contact: Contact;
}

interface BookingEvent {
  id: number;
  boekingId?: string;
  status?: string;
  bevestigd?: boolean;
  actId: number;
  dag: string;
  start: string;
  eind: string;
  locatie: string;
  gage?: number | null;
  actNaam?: string;
  actEmail?: string;
}

const TYPE_STYLES: Record<ActType, { label: string; dot: string; badge: string; ring: string; bar: string }> = {
  dj: {
    label: "Dj",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    ring: "ring-violet-200",
    bar: "bg-violet-400",
  },
  artiest: {
    label: "Artiest",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
    ring: "ring-orange-200",
    bar: "bg-orange-400",
  },
  special: {
    label: "Special",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-200",
    bar: "bg-emerald-400",
  },
  band: {
    label: "Band",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    ring: "ring-blue-200",
    bar: "bg-blue-400",
  },
};

const MOCK_ACTS: Act[] = [
  {
    id: 1,
    slug: "dj-lumo",
    name: "DJ Lumo",
    type: "dj",
    genres: ["House", "Techno"],
    tarief: "€ 450",
    live: true,
    contact: { naam: "Mila Verhoeven", rol: "Manager", email: "mila@lumobooking.nl", telefoon: "06 12345678" },
  },
  {
    id: 2,
    slug: "sanne-de-wilde",
    name: "Sanne de Wilde",
    type: "artiest",
    genres: ["Nederpop"],
    tarief: "€ 850",
    contact: { naam: "Sanne de Wilde", rol: "Artiest (zelf)", email: "sanne@email.nl", telefoon: "06 98765432" },
  },
  {
    id: 3,
    slug: "the-riverbeats",
    name: "The Riverbeats",
    type: "band",
    genres: ["Coverband", "Nederlandstalig"],
    tarief: "€ 1.200",
    contact: { naam: "Tom Jansen", rol: "Bandleider", email: "tom@riverbeats.nl", telefoon: "06 55501234" },
  },
];

const MOCK_EVENTS: BookingEvent[] = [
  { id: 1, actId: 1, dag: "Vr 28 aug", start: "22:00", eind: "02:00", locatie: "Club Vault, Arnhem" },
  { id: 2, actId: 2, dag: "Za 29 aug", start: "20:30", eind: "21:30", locatie: "Café De Kroon, Doetinchem" },
  { id: 3, actId: 3, dag: "Za 29 aug", start: "21:00", eind: "23:30", locatie: "Bruiloft, Zutphen" },
  { id: 4, actId: 1, dag: "Vr 4 sep", start: "23:00", eind: "01:00", locatie: "Warehouse XL, Nijmegen" },
  { id: 5, actId: 2, dag: "Za 12 sep", start: "19:00", eind: "20:00", locatie: "Festivaltent, Ede" },
];

function MotionStyles() {
  return (
    <style>{`
      @keyframes soft-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.35); opacity: 0.55; }
      }
      .animate-soft-pulse {
        animation: soft-pulse 2.4s ease-in-out infinite;
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 1.2s ease-out both;
      }
    `}</style>
  );
}

function ActBadge({ type, live = false }: { type: ActType; live?: boolean }) {
  const s = TYPE_STYLES[type];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.badge}`}>
      <span className="relative flex h-1.5 w-1.5">
        {live && <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} animate-soft-pulse`} />}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}

function ActCard({ act, delay }: { act: Act; delay: number }) {
  const s = TYPE_STYLES[act.type];
  return (
    <div
      className={`animate-fade-in-up rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:${s.ring} hover:shadow-md`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900">{act.name}</h3>
          <div className="mt-1.5">
            <ActBadge type={act.type} live={act.live} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">Tarief</p>
          <p className="text-[15px] font-semibold text-neutral-900">{act.tarief}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {act.actief === false && (
          <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-[12px] font-medium text-neutral-600">
            Gearchiveerd
          </span>
        )}
        {act.specialiteit && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">
            {act.specialiteit}
          </span>
        )}
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

      <div className="mt-4 flex gap-2">
        <Link
          href={`/bookings/acts/${act.slug}`}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-center text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Bekijk
        </Link>
      </div>
    </div>
  );
}

async function stuurBevestiging(event: BookingEvent, actNaam: string) {
  const naar = event.actEmail || "";
  const tekst =
    `Bevestiging sturen naar ${actNaam}` +
    (naar ? ` (${naar})` : "") +
    `?\n\nDe act krijgt een mail met datum, tijd, locatie en het bedrag, ` +
    `en kan daarin met een klik bevestigen.`;
  if (!confirm(tekst)) return;
  const res = await fetch(`/api/bookings/uitnodiging/${event.boekingId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (res.ok) {
    alert("Bevestiging verstuurd.");
  } else {
    const f = await res.json().catch(() => null);
    alert(`Versturen mislukt: ${f?.error ?? "onbekende fout"}`);
  }
}

function AgendaRow({ event, act, delay }: { event: BookingEvent; act: Act; delay: number }) {
  const s = TYPE_STYLES[act.type];
  return (
    <div
      className="animate-fade-in-up flex items-stretch gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-1 shrink-0 rounded-full ${s.bar}`} />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className={`text-[14px] font-medium ${event.status === "geannuleerd" ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
              {act.name}
            </p>
            {event.dag === new Date().toISOString().slice(0, 10) && event.status !== "geannuleerd" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Vandaag
              </span>
            )}
            {act.live && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-soft-pulse" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Nu bezig
              </span>
            )}
          </div>
          <p className={`text-[13px] ${event.status === "geannuleerd" ? "text-neutral-400 line-through" : "text-neutral-500"}`}>
            {event.locatie}
            {event.bevestigd && event.status !== "geannuleerd" && (
              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                bevestigd door act
              </span>
            )}
            {event.status === "geannuleerd" && (
              <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                geannuleerd
              </span>
            )}
            {event.boekingId && (
              <Link
                href={`/bookings/boeking/${event.boekingId}`}
                className="ml-2 text-[12px] text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700"
              >
                bewerken
              </Link>
            )}
            {event.boekingId && (
              <button
                type="button"
                onClick={() => stuurBevestiging(event, act.name)}
                className="ml-2 text-[12px] text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700"
              >
                bevestiging sturen
              </button>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-medium text-neutral-900">
            {event.start} – {event.eind}
          </p>
          <p className="text-[11px] text-neutral-400">incl. reistijdbuffer</p>
          {typeof event.gage === "number" && event.status !== "geannuleerd" && (
            <p className="mt-0.5 text-[13px] font-semibold text-neutral-900">{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.gage)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Agenda({ acts, events }: { acts: Act[]; events: BookingEvent[] }) {
  const grouped = useMemo(() => {
    const byDay: Record<string, BookingEvent[]> = {};
    events.forEach((e) => {
      byDay[e.dag] = byDay[e.dag] || [];
      byDay[e.dag].push(e);
    });
    return byDay;
  }, [events]);

  let counter = 0;

  return (
    <div className="animate-fade-in space-y-6">
      {Object.entries(grouped).map(([dag, dayEvents]) => (
        <div key={dag}>
          <p className="mb-2 text-[13px] font-medium text-neutral-400">{dag}</p>
          <div className="space-y-2">
            {dayEvents.map((e) => {
              const act = acts.find((a) => a.id === e.actId);
              if (!act) return null;
              counter += 1;
              return <AgendaRow key={e.id} event={e} act={act} delay={counter * 60} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AankomendeActsSidebar({ acts, events }: { acts: Act[]; events: BookingEvent[] }) {
  const vandaag = new Date().toISOString().slice(0, 10);
  const aankomend = events
    .filter((e) => e.status !== "geannuleerd" && e.dag >= vandaag)
    .sort((a, b) => (a.dag + a.start).localeCompare(b.dag + b.start));

  return (
    <aside className="animate-fade-in w-full shrink-0 lg:w-72">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-10">
        <p className="mb-3 text-[13px] font-semibold text-neutral-900">Aankomende acts</p>
        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {aankomend.length === 0 && (
            <p className="py-2 text-[12px] text-neutral-400">Geen aankomende boekingen.</p>
          )}
          {aankomend.map((e, i) => {
            const act = acts.find((a) => a.id === e.actId);
            if (!act) return null;
            const s = TYPE_STYLES[act.type];
            return (
              <div
                key={e.id}
                className="animate-fade-in-up flex items-start gap-2.5 rounded-xl border border-neutral-100 px-3 py-2.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-neutral-900">{act.name}</p>
                  <p className="text-[11px] text-neutral-500">
                    {e.dag} · {e.start}
                  </p>
                  <p className="truncate text-[11px] text-neutral-400">{e.locatie}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default function BDZBookingsDashboard({ acts = MOCK_ACTS, events = MOCK_EVENTS }: { acts?: Act[]; events?: BookingEvent[] }) {
  const [tab, setTab] = useState<"acts" | "agenda">("acts");
  const [query, setQuery] = useState("");
  const [agendaQuery, setAgendaQuery] = useState("");

  const filteredActs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return acts;
    return acts
      .filter((a) => a.name.toLowerCase().includes(q))
      .sort((a, b) => Number(a.actief === false) - Number(b.actief === false));
  }, [query, acts]);

  const filteredEvents = useMemo(() => {
    const q = agendaQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => {
      const act = acts.find((a) => a.id === e.actId);
      const haystack = `${act?.name || ""} ${e.locatie} ${e.dag}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [agendaQuery, events, acts]);

  return (
    <div
      className="min-h-screen bg-neutral-50 px-6 py-10 sm:px-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <MotionStyles />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Overzicht</h1>
          </div>
          <Link
            href="/bookings/acts/nieuw"
            className="rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-800"
          >
            + Nieuwe act
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-xl bg-neutral-100 p-1">
            {(
              [
                { id: "acts", label: "Acts" },
                { id: "agenda", label: "Agenda" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-1.5 text-[13px] font-medium transition ${
                  tab === t.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "acts" && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek een act op naam..."
              className="w-full max-w-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none"
            />
          )}
          {tab === "agenda" && (
            <input
              type="text"
              value={agendaQuery}
              onChange={(e) => setAgendaQuery(e.target.value)}
              placeholder="Zoek op plaats, act of datum..."
              className="w-full max-w-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none"
            />
          )}
        </div>

        {tab === "acts" ? (
          filteredActs.length === 0 ? (
            <p className="animate-fade-in text-[13px] text-neutral-400">Geen acts gevonden voor "{query}".</p>
          ) : (
            <div key={query} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActs.map((act, i) => (
                <ActCard key={act.id} act={act} delay={i * 60} />
              ))}
            </div>
          )
        ) : filteredEvents.length === 0 ? (
          <p className="animate-fade-in text-[13px] text-neutral-400">Geen boekingen gevonden voor "{agendaQuery}".</p>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <Agenda acts={acts} events={filteredEvents} />
            </div>
            <AankomendeActsSidebar acts={acts} events={filteredEvents} />
          </div>
        )}
      </div>
    </div>
  );
}
