"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ContractLight from "@/components/contract-light";
import { daysUntil, getContractLight } from "@/lib/contract-status";

const STATUS_OPTIONS = [
  { value: "niet_gestart", label: "Nog niet gestart", style: "bg-line/60 text-muted" },
  { value: "in_onderhandeling", label: "In onderhandeling", style: "bg-amber-500/15 text-amber-400" },
  { value: "getekend", label: "Getekend", style: "bg-green-500/15 text-green-400" },
];

type Artist = {
  id: string;
  name: string;
  artist_code: string | null;
  contract_status: string;
  contract_notes: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
};

type Member = { id: string; email: string | null };

export default function ArtistRow({ artist }: { artist: Artist }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(artist.name);
  const [artistCode, setArtistCode] = useState(artist.artist_code ?? "");
  const [status, setStatus] = useState(artist.contract_status);
  const [notes, setNotes] = useState(artist.contract_notes ?? "");
  const [startDate, setStartDate] = useState(artist.contract_start_date ?? "");
  const [endDate, setEndDate] = useState(artist.contract_end_date ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && members === null) {
      const res = await fetch(`/api/artist-members?artistId=${artist.id}`);
      const data = await res.json();
      setMembers(data.members ?? []);
    }
  }

  async function save(
    newName: string,
    newCode: string,
    newStatus: string,
    newNotes: string,
    newStart: string,
    newEnd: string
  ) {
    if (!newName.trim()) return;
    setSaving(true);
    setSaveError("");
    const { error } = await supabase
      .from("artists")
      .update({
        name: newName.trim(),
        artist_code: newCode.trim() || null,
        contract_status: newStatus,
        contract_notes: newNotes || null,
        contract_start_date: newStart || null,
        contract_end_date: newEnd || null,
      })
      .eq("id", artist.id);
    setSaving(false);
    if (error) {
      setSaveError(
        error.code === "23505"
          ? "Deze artiestcode is al in gebruik door een andere artiest."
          : "Opslaan mislukt: " + error.message
      );
      return;
    }
    router.refresh();
  }

  async function handleDeleteArtist() {
    const confirmed = confirm(
      `Weet je zeker dat je "${artist.name}" wilt verwijderen? Dit verwijdert ook al hun releases, inkomsten en gekoppelde inlogs. Dit kan niet ongedaan gemaakt worden.`
    );
    if (!confirmed) return;
    setDeleting(true);
    const { error } = await supabase.from("artists").delete().eq("id", artist.id);
    setDeleting(false);
    if (error) {
      alert("Verwijderen mislukt: " + error.message);
      return;
    }
    router.refresh();
  }

  async function removeMember(userId: string) {
    if (!confirm("Deze login loskoppelen van deze artiest?")) return;
    await fetch(`/api/artist-members?artistId=${artist.id}&userId=${userId}`, {
      method: "DELETE",
    });
    setMembers((prev) => prev?.filter((m) => m.id !== userId) ?? null);
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteMsg("");
    const res = await fetch("/api/add-artist-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId: artist.id, email: newEmail }),
    });
    const data = await res.json();
    setInviting(false);
    if (!res.ok) {
      setInviteMsg(data.error || "Uitnodigen mislukt.");
      return;
    }
    setInviteMsg("✓ Uitnodiging verstuurd.");
    setNewEmail("");
    const res2 = await fetch(`/api/artist-members?artistId=${artist.id}`);
    const data2 = await res2.json();
    setMembers(data2.members ?? []);
  }

  return (
    <div>
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surfaceHover transition-colors duration-100 text-left"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <ContractLight endDate={artist.contract_end_date} />
          <span className="text-[14px] font-medium text-ink truncate">{artist.name}</span>
          {artist.artist_code && (
            <span className="text-[11px] font-mono text-muted bg-canvas px-1.5 py-0.5 rounded shrink-0">
              {artist.artist_code}
            </span>
          )}
        </span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusInfo.style}`}>
          {statusInfo.label}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 pt-1 border-t border-line flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11.5px] font-medium text-muted mb-1.5 block mt-3">
                Naam
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => save(name, artistCode, status, notes, startDate, endDate)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-medium text-muted mb-1.5 block mt-3">
                Artiestcode
              </label>
              <input
                value={artistCode}
                onChange={(e) => setArtistCode(e.target.value)}
                onBlur={() => save(name, artistCode, status, notes, startDate, endDate)}
                placeholder="bv. ART-001"
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
              Contractstatus
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                save(name, artistCode, e.target.value, notes, startDate, endDate);
              }}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                Contract start
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={() => save(name, artistCode, status, notes, startDate, endDate)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                Contract einde
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={() => save(name, artistCode, status, notes, startDate, endDate)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>
          </div>
          {endDate && (
            <div className="flex items-center gap-2 -mt-1">
              <ContractLight endDate={endDate} showLabel />
              {getContractLight(endDate) !== "green" && (
                <span className="text-[11px] text-muted">
                  {daysUntil(endDate) >= 0
                    ? `nog ${daysUntil(endDate)} dagen`
                    : `${Math.abs(daysUntil(endDate))} dagen geleden verlopen`}
                </span>
              )}
            </div>
          )}

          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
              Notities (bv. contractvoorwaarden, afspraken)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => save(name, artistCode, status, notes, startDate, endDate)}
              rows={3}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition resize-none"
              placeholder="Bijv. vast contract, 2 jaar, 20/80 verdeling"
            />
          </div>
          {saveError && <p className="text-danger text-[11.5px] -mt-1">{saveError}</p>}
          <span
            className={`text-[11px] text-muted transition-opacity ${saving ? "opacity-100" : "opacity-0"}`}
          >
            opslaan…
          </span>

          <div className="border-t border-line pt-3 mt-1">
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
              Gekoppelde inlogs
            </label>
            {members === null && <p className="text-[12px] text-muted">Laden…</p>}
            {members?.length === 0 && (
              <p className="text-[12px] text-muted">Nog geen inlog gekoppeld.</p>
            )}
            {members && members.length > 0 && (
              <ul className="flex flex-col gap-1 mb-2">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-[12.5px] text-ink group">
                    <span>{m.email}</span>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-danger text-[11.5px] opacity-0 group-hover:opacity-100 transition"
                    >
                      Loskoppelen
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addMember} className="flex gap-2 mt-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="extra e-mailadres (bv. bandlid)"
                className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
              <button
                type="submit"
                disabled={inviting}
                className="text-[13px] font-medium bg-accent text-white px-3.5 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.97] transition disabled:opacity-50 whitespace-nowrap"
              >
                {inviting ? "…" : "+ Toevoegen"}
              </button>
            </form>
            {inviteMsg && <p className="text-[12px] text-muted mt-1.5">{inviteMsg}</p>}
            <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
              Geen limiet — voeg zoveel e-mailadressen toe als nodig (bijv. voor elk bandlid).
              Iedereen ziet hetzelfde overzicht van deze artiest.
            </p>
          </div>

          <div className="border-t border-line pt-3 mt-1">
            <button
              onClick={handleDeleteArtist}
              disabled={deleting}
              className="text-danger text-[12.5px] font-medium hover:underline disabled:opacity-50"
            >
              {deleting ? "Bezig met verwijderen…" : "Artiest verwijderen"}
            </button>
            <p className="text-[11px] text-muted mt-1">
              Verwijdert ook al hun releases, inkomsten en gekoppelde inlogs. Niet ongedaan te maken.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
