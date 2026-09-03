"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Lead = {
  id: string;
  act_naam: string;
  type: string;
  specialiteit: string | null;
  status: string;
  contact_naam: string | null;
  contact_rol: string | null;
  contact_email: string | null;
  contact_telefoon: string | null;
  richtprijs: number | null;
  vervolgdatum: string | null;
  act_id: string | null;
};

type Notitie = {
  id: string;
  lead_id: string;
  tekst: string;
  created_at: string;
};

const TYPES = ["dj", "artiest", "band", "act", "overig"];
const STATUSSEN = ["benaderd", "in gesprek", "interesse", "afgehaakt", "binnen"];

const STATUS_KLEUR: Record<string, string> = {
  benaderd: "bg-neutral-100 text-neutral-600",
  "in gesprek": "bg-blue-50 text-blue-700",
  interesse: "bg-amber-50 text-amber-700",
  afgehaakt: "bg-neutral-100 text-neutral-400",
  binnen: "bg-emerald-50 text-emerald-700",
};

const LEEG = {
  act_naam: "",
  type: "artiest",
  contact_naam: "",
  contact_rol: "",
  contact_email: "",
  contact_telefoon: "",
  richtprijs: "",
  vervolgdatum: "",
  notitie: "",
};

const LABEL = "mb-1 block text-[11px] text-neutral-500";
const VELD = "rounded-xl border border-neutral-200 px-3 py-2 text-[14px] focus:border-neutral-400 focus:outline-none";

function datumKort(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function ContactenLijst({
  leads,
  notities,
}: {
  leads: Lead[];
  notities: Notitie[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [nieuweNotitie, setNieuweNotitie] = useState("");
  const [bezig, setBezig] = useState(false);
  const [toevoegen, setToevoegen] = useState(false);
  const [filter, setFilter] = useState("open");
  const [nieuw, setNieuw] = useState(LEEG);
  const [bewerken, setBewerken] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [verwijderVraag, setVerwijderVraag] = useState<string | null>(null);
  const [omzetFout, setOmzetFout] = useState("");

  const zichtbaar = leads.filter((l) => {
    if (filter === "alles") return true;
    if (filter === "open") return l.status !== "afgehaakt" && l.status !== "binnen";
    return l.status === filter;
  });

  async function opslaanNieuw() {
    if (!nieuw.act_naam.trim()) return;
    setBezig(true);
    const res = await fetch("/api/bookings/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        act_naam: nieuw.act_naam.trim(),
        type: nieuw.type,
        contact_naam: nieuw.contact_naam.trim() || null,
        contact_rol: nieuw.contact_rol.trim() || null,
        contact_email: nieuw.contact_email.trim() || null,
        contact_telefoon: nieuw.contact_telefoon.trim() || null,
        richtprijs: nieuw.richtprijs ? parseFloat(nieuw.richtprijs) : null,
        vervolgdatum: nieuw.vervolgdatum || null,
      }),
    });

    if (res.ok && nieuw.notitie.trim()) {
      const { lead } = await res.json();
      await fetch("/api/bookings/leads/notities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, tekst: nieuw.notitie }),
      });
    }

    setBezig(false);
    if (res.ok) {
      setNieuw(LEEG);
      setToevoegen(false);
      router.refresh();
    }
  }

  async function wijzig(id: string, velden: Record<string, unknown>) {
    await fetch("/api/bookings/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...velden }),
    });
    router.refresh();
  }

  function startBewerken(lead: Lead) {
    setDraft({
      act_naam: lead.act_naam,
      type: lead.type,
      contact_naam: lead.contact_naam ?? "",
      contact_rol: lead.contact_rol ?? "",
      contact_email: lead.contact_email ?? "",
      contact_telefoon: lead.contact_telefoon ?? "",
      richtprijs: lead.richtprijs ? String(lead.richtprijs) : "",
    });
    setBewerken(lead.id);
  }

  async function opslaanBewerking(id: string) {
    setBezig(true);
    await wijzig(id, {
      act_naam: draft.act_naam.trim(),
      type: draft.type,
      contact_naam: draft.contact_naam.trim() || null,
      contact_rol: draft.contact_rol.trim() || null,
      contact_email: draft.contact_email.trim() || null,
      contact_telefoon: draft.contact_telefoon.trim() || null,
      richtprijs: draft.richtprijs ? parseFloat(draft.richtprijs) : null,
    });
    setBezig(false);
    setBewerken(null);
  }

  async function verwijder(id: string) {
    setBezig(true);
    await fetch("/api/bookings/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBezig(false);
    setVerwijderVraag(null);
    setOpen(null);
    router.refresh();
  }

  async function omzetten(id: string) {
    setBezig(true);
    setOmzetFout("");
    const res = await fetch("/api/bookings/leads/omzetten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBezig(false);
    if (!res.ok) {
      const uitkomst = await res.json().catch(() => ({}));
      setOmzetFout(uitkomst.error || "Omzetten mislukt");
      return;
    }
    router.refresh();
  }

  async function notitieToevoegen(leadId: string) {
    if (!nieuweNotitie.trim()) return;
    setBezig(true);
    const res = await fetch("/api/bookings/leads/notities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, tekst: nieuweNotitie }),
    });
    setBezig(false);
    if (res.ok) {
      setNieuweNotitie("");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900">Contacten</h1>
          <p className="text-[13px] text-neutral-500">Acts die je benadert.</p>
        </div>
        <button
          onClick={() => setToevoegen(!toevoegen)}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-700"
        >
          {toevoegen ? "Annuleren" : "Contact toevoegen"}
        </button>
      </div>

      {toevoegen && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Naam van de act" value={nieuw.act_naam} onChange={(e) => setNieuw({ ...nieuw, act_naam: e.target.value })} className={VELD} />
            <select value={nieuw.type} onChange={(e) => setNieuw({ ...nieuw, type: e.target.value })} className={VELD}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input placeholder="Contactpersoon" value={nieuw.contact_naam} onChange={(e) => setNieuw({ ...nieuw, contact_naam: e.target.value })} className={VELD} />
            <input placeholder="Rol (manager, bureau, artiest zelf)" value={nieuw.contact_rol} onChange={(e) => setNieuw({ ...nieuw, contact_rol: e.target.value })} className={VELD} />
            <input placeholder="E-mail" value={nieuw.contact_email} onChange={(e) => setNieuw({ ...nieuw, contact_email: e.target.value })} className={VELD} />
            <input placeholder="Telefoon" value={nieuw.contact_telefoon} onChange={(e) => setNieuw({ ...nieuw, contact_telefoon: e.target.value })} className={VELD} />
            <input placeholder="Richtprijs (optioneel)" value={nieuw.richtprijs} onChange={(e) => setNieuw({ ...nieuw, richtprijs: e.target.value })} className={VELD} />
            <div>
              <label className="mb-1 block text-[11px] text-neutral-500">Terugkomen op</label>
              <input type="date" value={nieuw.vervolgdatum} onChange={(e) => setNieuw({ ...nieuw, vervolgdatum: e.target.value })} className={`w-full ${VELD}`} />
            </div>
          </div>
          <textarea
            placeholder="Notitie (wat is er besproken?)"
            value={nieuw.notitie}
            onChange={(e) => setNieuw({ ...nieuw, notitie: e.target.value })}
            rows={2}
            className={`mt-3 w-full ${VELD}`}
          />
          <button
            onClick={opslaanNieuw}
            disabled={bezig || !nieuw.act_naam.trim()}
            className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40"
          >
            Opslaan
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {["open", "alles", ...STATUSSEN].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-[12px] ${
              filter === f ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {zichtbaar.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-[14px] text-neutral-400">
          Nog geen contacten in deze weergave.
        </div>
      )}

      <div className="space-y-2">
        {zichtbaar.map((lead) => {
          const eigenNotities = notities.filter((n) => n.lead_id === lead.id);
          const isOpen = open === lead.id;
          const inBewerking = bewerken === lead.id;
          return (
            <div key={lead.id} className="rounded-2xl border border-neutral-200 bg-white">
              <button
                onClick={() => setOpen(isOpen ? null : lead.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-neutral-900">{lead.act_naam}</span>
                    <span className="text-[12px] text-neutral-400">{lead.type}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-neutral-500">
                    {lead.contact_naam}
                    {lead.contact_rol && ` · ${lead.contact_rol}`}
                    {eigenNotities.length > 0 && ` · laatst ${datumKort(eigenNotities[0].created_at)}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {lead.vervolgdatum && <span className="text-[12px] text-neutral-400">{datumKort(lead.vervolgdatum)}</span>}
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_KLEUR[lead.status] ?? ""}`}>{lead.status}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-neutral-100 px-5 py-4">
                  {inBewerking ? (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={LABEL}>Naam van de act</label>
                          <input value={draft.act_naam} onChange={(e) => setDraft({ ...draft, act_naam: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                        <div>
                          <label className={LABEL}>Type</label>
                          <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className={`w-full ${VELD}`}>
                            {TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={LABEL}>Contactpersoon</label>
                          <input value={draft.contact_naam} onChange={(e) => setDraft({ ...draft, contact_naam: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                        <div>
                          <label className={LABEL}>Rol</label>
                          <input value={draft.contact_rol} onChange={(e) => setDraft({ ...draft, contact_rol: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                        <div>
                          <label className={LABEL}>E-mail</label>
                          <input value={draft.contact_email} onChange={(e) => setDraft({ ...draft, contact_email: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                        <div>
                          <label className={LABEL}>Telefoon</label>
                          <input value={draft.contact_telefoon} onChange={(e) => setDraft({ ...draft, contact_telefoon: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                        <div>
                          <label className={LABEL}>Richtprijs</label>
                          <input value={draft.richtprijs} onChange={(e) => setDraft({ ...draft, richtprijs: e.target.value })} className={`w-full ${VELD}`} />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => opslaanBewerking(lead.id)} disabled={bezig} className="rounded-xl bg-neutral-900 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40">
                          Opslaan
                        </button>
                        <button onClick={() => setBewerken(null)} className="rounded-xl border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-600">
                          Annuleren
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-[13px] text-neutral-600">
                      {lead.contact_telefoon && <span>{lead.contact_telefoon}</span>}
                      {lead.contact_email && <span>{lead.contact_email}</span>}
                      {lead.richtprijs && <span>richtprijs € {Math.round(Number(lead.richtprijs))}</span>}
                      <button onClick={() => startBewerken(lead)} className="text-[12px] text-neutral-400 underline">
                        bewerken
                      </button>
                      {verwijderVraag === lead.id ? (
                        <span className="flex items-center gap-2">
                          <span className="text-[12px] text-neutral-500">Zeker weten?</span>
                          <button onClick={() => verwijder(lead.id)} disabled={bezig} className="text-[12px] text-red-600 underline">
                            ja, verwijder
                          </button>
                          <button onClick={() => setVerwijderVraag(null)} className="text-[12px] text-neutral-400 underline">
                            nee
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setVerwijderVraag(lead.id)} className="text-[12px] text-neutral-400 underline">
                          verwijderen
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-neutral-500">Status:</span>
                    {STATUSSEN.map((s) => (
                      <button
                        key={s}
                        onClick={() => wijzig(lead.id, { status: s })}
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          lead.status === s ? STATUS_KLEUR[s] : "bg-white text-neutral-400 border border-neutral-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {lead.act_id ? (
                    <div className="mb-4 text-[13px] text-emerald-700">
                      Staat in je aanbod ·{" "}
                      <Link href="/bookings" className="underline">
                        bekijk in overzicht
                      </Link>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <button
                        onClick={() => omzetten(lead.id)}
                        disabled={bezig}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-medium text-emerald-700 disabled:opacity-40"
                      >
                        Omzetten naar act
                      </button>
                      {omzetFout && <span className="ml-3 text-[12px] text-red-600">{omzetFout}</span>}
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[12px] text-neutral-500">Terugkomen op:</span>
                    <input
                      type="date"
                      defaultValue={lead.vervolgdatum ?? ""}
                      onChange={(e) => wijzig(lead.id, { vervolgdatum: e.target.value || null })}
                      className="rounded-lg border border-neutral-200 px-2 py-1 text-[13px] focus:border-neutral-400 focus:outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      placeholder="Wat is er afgesproken?"
                      value={nieuweNotitie}
                      onChange={(e) => setNieuweNotitie(e.target.value)}
                      rows={2}
                      className={`w-full ${VELD}`}
                    />
                    <button
                      onClick={() => notitieToevoegen(lead.id)}
                      disabled={bezig || !nieuweNotitie.trim()}
                      className="mt-2 rounded-xl bg-neutral-900 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40"
                    >
                      Notitie opslaan
                    </button>
                  </div>

                  <div className="space-y-2">
                    {eigenNotities.map((n) => (
                      <div key={n.id} className="rounded-xl bg-neutral-50 px-3 py-2">
                        <div className="text-[11px] text-neutral-400">{datumKort(n.created_at)}</div>
                        <div className="text-[13px] text-neutral-700 whitespace-pre-wrap">{n.tekst}</div>
                      </div>
                    ))}
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
