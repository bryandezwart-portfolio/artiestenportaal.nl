"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Artist = { id: string; name: string };

export default function NewReleaseForm({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false);
  const [artistId, setArtistId] = useState("");
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [labelPercent, setLabelPercent] = useState("20");
  const [distributor, setDistributor] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artistId,
        title,
        releaseDate: releaseDate || null,
        labelPercent: Number(labelPercent),
        distributor,
        notes,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Toevoegen mislukt.");
      return;
    }

    setTitle("");
    setReleaseDate("");
    setDistributor("");
    setNotes("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-surface rounded-xl2 shadow-card p-4 text-[13.5px] font-medium text-accent hover:bg-surfaceHover transition text-center"
      >
        + Nieuwe release toevoegen
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col gap-4 animate-pop-in"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">Nieuwe release</h2>
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
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Artiest</label>
          <select
            required
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          >
            <option value="">Kies artiest…</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Titel</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Naam van de release"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Releasedatum</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
            Label % <span className="text-muted font-normal">(artiest krijgt de rest)</span>
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
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Distributeur</label>
          <input
            value={distributor}
            onChange={(e) => setDistributor(e.target.value)}
            placeholder="bv. Label Distro BV"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
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
        {saving ? "Bezig…" : "Release toevoegen"}
      </button>
    </form>
  );
}
