"use client";

import React, { useState } from "react";
import FotoUpload from "@/components/bookings/FotoUpload";
import GalerijUpload from "@/components/bookings/GalerijUpload";
import { TIJDPERKEN, GENRES, GELEGENHEDEN } from "@/lib/bookings/keuzelijsten";
import ActJaaroverzicht from "@/components/bookings/ActJaaroverzicht";

type ActType = "dj" | "artiest" | "band" | "act" | "overig";

interface Act {
  id: string;
  slug: string;
  name: string;
  type: ActType;
  genres: string[];
  gelegenheden?: string[] | null;
  omschrijving?: string | null;
  foto_url?: string | null;
  kaart_foto?: string | null;
  video_url?: string | null;
  website?: string | null;
  actief?: boolean | null;
  tijdperken?: string[] | null;
  specialiteit?: string | null;
  publiek_min?: number | null;
  publiek_max?: number | null;
  tarief_type: "vast" | "uur";
  tarief_bedrag: number;
  standaard_commissie: number;
  contact_naam: string | null;
  contact_rol: string | null;
  contact_email: string | null;
  contact_telefoon: string | null;
  aantal_personen: number | null;
  bezetting: string | null;
  bio?: string | null;
  fotos?: string[] | null;
  video_url_2?: string | null;
  spotify_url?: string | null;
  prijs_vanaf?: number | null;
  prijs_notitie?: string | null;
  publiek_zichtbaar?: boolean | null;
}

interface Booking {
  id: string;
  datum: string;
  start_tijd: string;
  eind_tijd: string;
  locatie: string;
  status: string;
  gage?: number | null;
  commissie?: number | null;
}

interface Onbeschikbaarheid {
  id: string;
  van: string;
  tot: string;
  reden: string | null;
}

const TYPE_STYLES: Record<ActType, { label: string; badge: string }> = {
  dj: { label: "Dj", badge: "bg-violet-50 text-violet-700" },
  artiest: { label: "Artiest", badge: "bg-orange-50 text-orange-700" },
  band: { label: "Band", badge: "bg-blue-50 text-blue-700" },
  act: { label: "Act", badge: "bg-emerald-50 text-emerald-700" },
  overig: { label: "Overig", badge: "bg-amber-50 text-amber-700" },
};

function formatEuro(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function formatDag(datum: string): string {
  return new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(datum)
  );
}

function formatTijd(tijd: string): string {
  return tijd.slice(0, 5);
}

function formatDatumKort(datum: string): string {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(new Date(datum));
}

export default function ActDetail({
  act,
  bookingen,
  onbeschikbaarheid,
}: {
  act: Act;
  bookingen: Booking[];
  onbeschikbaarheid: Onbeschikbaarheid[];
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tijdperkTekst, setTijdperkTekst] = useState((act.tijdperken ?? []).join(", "));
  const [genreExtra, setGenreExtra] = useState("");
  const [gelegenheidExtra, setGelegenheidExtra] = useState("");
  const [draft, setDraft] = useState({
    name: act.name,
    tarief_bedrag: act.tarief_bedrag as number | string,
    genres: act.genres,
    gelegenheden: act.gelegenheden ?? [],
    tijdperken: act.tijdperken ?? [],
    specialiteit: act.specialiteit || "",
    omschrijving: act.omschrijving || "",
    foto_url: act.foto_url || "",
    kaart_foto: act.kaart_foto || "",
    video_url: act.video_url || "",
    website: act.website || "",
    publiek_min: act.publiek_min ?? "",
    publiek_max: act.publiek_max ?? "",
    contact_naam: act.contact_naam || "",
    contact_rol: act.contact_rol || "",
    contact_email: act.contact_email || "",
    contact_telefoon: act.contact_telefoon || "",
    aantal_personen: act.aantal_personen ?? "",
    bezetting: act.bezetting || "",
    bio: act.bio || "",
    video_url_2: act.video_url_2 || "",
    spotify_url: act.spotify_url || "",
    prijs_vanaf: act.prijs_vanaf ?? "",
    prijs_notitie: act.prijs_notitie || "",
    fotos: (act.fotos ?? []) as string[],
  });

  const calendarUrl =
    typeof window !== "undefined" ? `${window.location.origin}/api/calendar/${act.slug}` : `/api/calendar/${act.slug}`;
  const webcalUrl = calendarUrl.replace("https://", "webcal://").replace("http://", "webcal://");

  function handleCopy() {
    navigator.clipboard.writeText(calendarUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function startEditing() {
    setDraft({
      name: act.name,
      tarief_bedrag: act.tarief_bedrag,
      genres: act.genres,
      gelegenheden: act.gelegenheden ?? [],
      tijdperken: act.tijdperken ?? [],
      specialiteit: act.specialiteit || "",
    omschrijving: act.omschrijving || "",
    foto_url: act.foto_url || "",
    kaart_foto: act.kaart_foto || "",
    video_url: act.video_url || "",
    website: act.website || "",
      publiek_min: act.publiek_min ?? "",
      publiek_max: act.publiek_max ?? "",
      contact_naam: act.contact_naam || "",
      contact_rol: act.contact_rol || "",
      contact_email: act.contact_email || "",
      contact_telefoon: act.contact_telefoon || "",
    aantal_personen: act.aantal_personen ?? "",
    bezetting: act.bezetting || "",
    bio: act.bio || "",
    video_url_2: act.video_url_2 || "",
    spotify_url: act.spotify_url || "",
    prijs_vanaf: act.prijs_vanaf ?? "",
    prijs_notitie: act.prijs_notitie || "",
    fotos: (act.fotos ?? []) as string[],
    });
    setEditing(true);
  }

  function toggleInDraft(veld: "genres" | "gelegenheden" | "tijdperken", waarde: string) {
    const huidig = (draft[veld] as string[]) ?? [];
    setDraft({
      ...draft,
      [veld]: huidig.includes(waarde) ? huidig.filter((x) => x !== waarde) : [...huidig, waarde],
    });
  }

  const knopClass = (aan: boolean) =>
    `rounded-lg border px-2.5 py-1 text-[12px] font-medium transition ${
      aan
        ? "border-neutral-900 bg-neutral-900 text-white"
        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
    }`;

  function cancelEditing() {
    setEditing(false);
  }

  async function toggleActief() {
    const nieuw = !(act.actief ?? true);
    if (!nieuw && !confirm(`${act.name} archiveren? De act verdwijnt uit het zoekscherm, boekingen blijven bewaard.`)) return;
    const res = await fetch(`/api/bookings/acts/${act.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actief: nieuw }),
    });
    if (res.ok) window.location.reload();
    else alert("Niet gelukt. Probeer het nog eens.");
  }

  async function verwijderAct() {
    if (!confirm(`${act.name} definitief verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    const res = await fetch(`/api/bookings/acts/${act.slug}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/bookings";
      return;
    }
    const uitkomst = await res.json().catch(() => ({}));
    alert(uitkomst.error || "Verwijderen niet gelukt.");
  }

  async function saveEditing() {
    const res = await fetch(`/api/bookings/acts/${act.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        tarief_bedrag: parseFloat(String(draft.tarief_bedrag)) || 0,
      }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Opslaan is niet gelukt. Probeer het nog eens.");
    }
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 px-6 py-10 sm:px-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="hidden print:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bdzbookings-logo.png" alt="BDZBookings" className="mb-2 h-12 w-auto" />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {editing ? (
            <div className="space-y-4">
              <p className="text-[13px] font-medium text-neutral-400">Act bewerken</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Naam</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">
                    Tarief ({act.tarief_type === "uur" ? "per uur" : "per optreden"})
                  </label>
                  <input
                    type="number"
                    value={draft.tarief_bedrag}
                    onChange={(e) => setDraft({ ...draft, tarief_bedrag: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Genres</label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleInDraft("genres", g)}
                      className={knopClass(draft.genres.includes(g))}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {draft.genres.filter((g) => !GENRES.includes(g)).length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {draft.genres
                      .filter((g) => !GENRES.includes(g))
                      .map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleInDraft("genres", g)}
                          className={knopClass(true)}
                        >
                          {g} ×
                        </button>
                      ))}
                  </div>
                )}
                <input
                  type="text"
                  value={genreExtra}
                  onChange={(e) => setGenreExtra(e.target.value)}
                  onBlur={() => {
                    const extra = genreExtra.split(",").map((g) => g.trim()).filter(Boolean);
                    if (extra.length) {
                      setDraft({ ...draft, genres: [...draft.genres, ...extra] });
                      setGenreExtra("");
                    }
                  }}
                  placeholder="Iets anders? Typ en klik ernaast"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Tijdperken</label>
                <div className="flex flex-wrap gap-1.5">
                  {TIJDPERKEN.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleInDraft("tijdperken", t)}
                      className={knopClass((draft.tijdperken ?? []).includes(t))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Gelegenheden</label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {GELEGENHEDEN.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleInDraft("gelegenheden", g)}
                      className={knopClass((draft.gelegenheden ?? []).includes(g))}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {(draft.gelegenheden ?? []).filter((g) => !GELEGENHEDEN.includes(g)).length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {(draft.gelegenheden ?? [])
                      .filter((g) => !GELEGENHEDEN.includes(g))
                      .map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleInDraft("gelegenheden", g)}
                          className={knopClass(true)}
                        >
                          {g} ×
                        </button>
                      ))}
                  </div>
                )}
                <input
                  type="text"
                  value={gelegenheidExtra}
                  onChange={(e) => setGelegenheidExtra(e.target.value)}
                  onBlur={() => {
                    const extra = gelegenheidExtra
                      .split(",")
                      .map((g) => g.trim().toLowerCase())
                      .filter(Boolean);
                    if (extra.length) {
                      setDraft({ ...draft, gelegenheden: [...(draft.gelegenheden ?? []), ...extra] });
                      setGelegenheidExtra("");
                    }
                  }}
                  placeholder="Iets anders? Bijv. babyshower"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Specialiteit (alleen bij act of overig)</label>
                <input
                  type="text"
                  value={draft.specialiteit}
                  onChange={(e) => setDraft({ ...draft, specialiteit: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
                <p className="mb-1 text-[12px] font-medium text-neutral-700">Voor de publieke website</p>
                <p className="mb-3 text-[11px] text-neutral-400">Zichtbaar op bdzbookings.nl.</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Omschrijving</label>
                    <textarea rows={4} value={draft.omschrijving}
                      onChange={(e) => setDraft({ ...draft, omschrijving: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none" />
                  </div>
                  <FotoUpload
                    slug={act.slug}
                    label="Kaartfoto — vierkant, min. 1000x1000"
                    waarde={draft.kaart_foto}
                    onKlaar={(url) => setDraft({ ...draft, kaart_foto: url })}
                  />
                  <FotoUpload
                    slug={act.slug}
                    label="Hoofdfoto — breed, bovenaan de actpagina"
                    waarde={draft.foto_url}
                    onKlaar={(url) => setDraft({ ...draft, foto_url: url })}
                  />
                  <GalerijUpload
                    slug={act.slug}
                    fotos={draft.fotos}
                    onKlaar={(urls) => setDraft({ ...draft, fotos: urls })}
                  />
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Video (YouTube of Vimeo)</label>
                    <input type="text" value={draft.video_url}
                      onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Eigen website</label>
                    <input type="text" value={draft.website}
                      onChange={(e) => setDraft({ ...draft, website: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Publiek van / tot</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draft.publiek_min}
                    onChange={(e) => setDraft({ ...draft, publiek_min: e.target.value })}
                    className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                  />
                  <span className="text-[13px] text-neutral-500">tot</span>
                  <input
                    type="text"
                    value={draft.publiek_max}
                    onChange={(e) => setDraft({ ...draft, publiek_max: e.target.value })}
                    className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <p className="mb-3 text-[13px] font-medium text-neutral-700">Contactpersoon / manager</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={draft.contact_naam}
                    onChange={(e) => setDraft({ ...draft, contact_naam: e.target.value })}
                    placeholder="Naam"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={draft.contact_rol}
                    onChange={(e) => setDraft({ ...draft, contact_rol: e.target.value })}
                    placeholder="Rol"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={draft.contact_email}
                    onChange={(e) => setDraft({ ...draft, contact_email: e.target.value })}
                    placeholder="E-mailadres"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={draft.contact_telefoon}
                    onChange={(e) => setDraft({ ...draft, contact_telefoon: e.target.value })}
                    placeholder="Telefoonnummer"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    value={draft.aantal_personen}
                    onChange={(e) => setDraft({ ...draft, aantal_personen: e.target.value })}
                    placeholder="Aantal personen"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={draft.bezetting}
                    onChange={(e) => setDraft({ ...draft, bezetting: e.target.value })}
                    placeholder="Bijv. 4 muzikanten, geluidsman, lichtman"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-neutral-50 p-4">
                <p className="text-[13px] font-medium text-neutral-500">Publiek profiel &mdash; wat op bdzbookings.nl komt te staan</p>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Biografie</label>
                  <textarea
                    rows={6}
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    placeholder="Wie is deze act? Schrijf in alinea's, gescheiden door een lege regel."
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">YouTube video 2</label>
                    <input
                      type="text"
                      value={draft.video_url_2}
                      onChange={(e) => setDraft({ ...draft, video_url_2: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Spotify (playlist of artiest)</label>
                    <input
                      type="text"
                      value={draft.spotify_url}
                      onChange={(e) => setDraft({ ...draft, spotify_url: e.target.value })}
                      placeholder="https://open.spotify.com/artist/..."
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Prijs vanaf (incl. commissie)</label>
                    <input
                      type="number"
                      value={draft.prijs_vanaf}
                      onChange={(e) => setDraft({ ...draft, prijs_vanaf: e.target.value })}
                      placeholder="Bijv. 950"
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Toelichting bij prijs</label>
                    <input
                      type="text"
                      value={draft.prijs_notitie}
                      onChange={(e) => setDraft({ ...draft, prijs_notitie: e.target.value })}
                      placeholder="Excl. reiskosten"
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={saveEditing}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
                >
                  Opslaan
                </button>
                <button type="button"
                  onClick={cancelEditing}
                  className="print:hidden rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Annuleren
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{act.name}</h1>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_STYLES[act.type].badge}`}>
                    {TYPE_STYLES[act.type].label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-neutral-400">Tarief</p>
                  <p className="text-[17px] font-semibold text-neutral-900">
                    {formatEuro(act.tarief_bedrag)}
                    {act.tarief_type === "uur" && <span className="text-[13px] text-neutral-400"> /uur</span>}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {act.genres.map((g) => (
                  <span key={g} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">
                    {g}
                  </span>
                ))}
                {(act.tijdperken ?? []).map((t) => (
                  <span key={t} className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <p className="text-[13px] text-neutral-900">
                  {act.contact_naam} <span className="text-neutral-400">· {act.contact_rol}</span>
                </p>
                <p className="mt-0.5 text-[13px] text-neutral-500">
                  {act.contact_email} · {act.contact_telefoon}
                  {(act.aantal_personen || act.bezetting) && (
                    <span className="mt-1 block text-[13px] text-neutral-500">
                      {act.aantal_personen
                        ? `${act.aantal_personen} ${act.aantal_personen === 1 ? "persoon" : "personen"}`
                        : ""}
                      {act.aantal_personen && act.bezetting ? " — " : ""}
                      {act.bezetting || ""}
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={startEditing}
                  className="print:hidden rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Bewerken
                </button>
                <button
                  type="button"
                  onClick={toggleActief}
                  className="print:hidden ml-2 rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-500 transition hover:bg-neutral-50"
                >
                  {(act.actief ?? true) ? "Archiveren" : "Weer activeren"}
                </button>
                <button
                  type="button"
                  onClick={verwijderAct}
                  className="print:hidden ml-2 rounded-xl border border-red-200 px-4 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                >
                  Verwijderen
                </button>
              </div>
            </>
          )}
        </div>

        <div className="print:hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
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

        <ActJaaroverzicht bookingen={bookingen} />

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-neutral-900">Alle boekingen</h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800 print:hidden"
            >
              Download pdf
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {bookingen.length === 0 ? (
              <p className="text-[13px] text-neutral-400">Nog geen boekingen.</p>
            ) : (
              bookingen.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">{formatDag(b.datum)}</p>
                    <p className="text-[13px] text-neutral-500">{b.locatie}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-neutral-900">
                      {formatTijd(b.start_tijd)} – {formatTijd(b.eind_tijd)}
                    </p>
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
            {onbeschikbaarheid.length === 0 ? (
              <p className="text-[13px] text-neutral-400">Geen onbeschikbaarheid opgegeven.</p>
            ) : (
              onbeschikbaarheid.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5">
                  <span className="text-[13px] text-neutral-700">
                    {formatDatumKort(u.van)} – {formatDatumKort(u.tot)}
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
