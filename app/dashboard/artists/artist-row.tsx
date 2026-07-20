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
  user_id: string | null;
};

export default function ArtistRow({ artist }: { artist: Artist }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(artist.contract_status);
  const [notes, setNotes] = useState(artist.contract_notes ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];

  async function save(newStatus: string, newNotes: string) {
    setSaving(true);
    await supabase
      .from("artists")
      .update({ contract_status: newStatus, contract_notes: newNotes || null })
      .eq("id", artist.id);
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surfaceHover transition-colors duration-100 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-ink">{artist.name}</span>
          {!artist.user_id && (
            <span className="text-[10px] text-muted bg-line/60 px-2 py-0.5 rounded-full">
              geen login
            </span>
          )}
        </div>
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
        </div>
      )}
    </div>
  );
}
