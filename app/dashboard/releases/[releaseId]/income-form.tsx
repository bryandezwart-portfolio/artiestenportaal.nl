"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Amazon Music",
  "Deezer",
  "TikTok",
  "Overig",
];

export default function IncomeForm({
  releaseId,
  defaultLabelPercent,
}: {
  releaseId: string;
  defaultLabelPercent: number;
}) {
  const [open, setOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState("Spotify");
  const [grossAmount, setGrossAmount] = useState("");
  const [labelPercent, setLabelPercent] = useState(String(defaultLabelPercent));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        releaseId,
        entryDate,
        platform,
        grossAmount: Number(grossAmount),
        labelPercent: Number(labelPercent),
        notes,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Toevoegen mislukt.");
      return;
    }

    setGrossAmount("");
    setNotes("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-surface rounded-xl2 shadow-card p-4 text-[13.5px] font-medium text-accent hover:bg-surfaceHover transition text-center mt-6"
      >
        + Inkomsten boeken
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col gap-4 mt-6 animate-pop-in"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">Inkomsten boeken</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12.5px] text-muted hover:text-ink"
        >
          Annuleren
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Datum</label>
          <input
            type="date"
            required
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Bruto bedrag (€)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            required
            value={grossAmount}
            onChange={(e) => setGrossAmount(e.target.value)}
            placeholder="0,00"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
            Label % <span className="text-muted font-normal">(voor deze boeking)</span>
          </label>
          <input
            type="number"
            min={0}
            max={100}
            required
            value={labelPercent}
            onChange={(e) => setLabelPercent(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Opmerkingen</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optioneel"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
      </div>

      {error && <p className="text-danger text-[12.5px]">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-accent text-white text-[13.5px] font-medium rounded-lg px-4 py-2 hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
      >
        {saving ? "Bezig…" : "Boeking toevoegen"}
      </button>
    </form>
  );
}
