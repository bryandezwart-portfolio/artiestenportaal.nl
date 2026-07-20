"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "niet_gestart", label: "Nog niet gestart", style: "bg-line/60 text-muted" },
  { value: "in_onderhandeling", label: "In onderhandeling", style: "bg-amber-500/15 text-amber-400" },
  { value: "getekend", label: "Getekend", style: "bg-green-500/15 text-green-400" },
];

type Artist = {
  id: string;
  name: string;
  contract_status: string;
  contract_notes: string | null;
};

type Member = { id: string; email: string | null };

export default function ArtistRow({ artist }: { artist: Artist }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(artist.contract_status);
  const [notes, setNotes] = useState(artist.contract_notes ?? "");
  const [saving, setSaving] = useState(false);
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

  async function save(newStatus: string, newNotes: string) {
    setSaving(true);
    await supabase
      .from("artists")
      .update({ contract_status: newStatus, contract_notes: newNotes || null })
      .eq("id", artist.id);
    setSaving(false);
    router.refresh();
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
        <span className="text-[14px] font-medium text-ink">{artist.name}</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusInfo.style}`}>
          {statusInfo.label}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 pt-1 border-t border-line flex flex-col gap-3">
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block mt-3">
              Contractstatus
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                save(e.target.value, notes);
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
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
              Notities (bv. contractvoorwaarden, afspraken)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => save(status, notes)}
              rows={3}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition resize-none"
              placeholder="Bijv. vast contract, 2 jaar, 20/80 verdeling"
            />
          </div>
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
                  <li key={m.id} className="text-[12.5px] text-ink">
                    {m.email}
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
        </div>
      )}
    </div>
  );
}
