"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArtistForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [artistCode, setArtistCode] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/create-artist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, artistCode }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Toevoegen mislukt.");
      return;
    }

    setName("");
    setArtistCode("");
    setEmail("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-surface rounded-xl2 shadow-card p-4 text-[13.5px] font-medium text-accent hover:bg-surfaceHover transition text-center mb-6"
      >
        + Nieuwe artiest
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col gap-4 mb-6 animate-pop-in"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">Nieuwe artiest</h2>
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
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Naam</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Artiestennaam"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
            Artiestcode <span className="text-muted font-normal">(optioneel, eigen indeling)</span>
          </label>
          <input
            value={artistCode}
            onChange={(e) => setArtistCode(e.target.value)}
            placeholder="bv. ART-001"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
            E-mail <span className="text-muted font-normal">(optioneel — stuurt uitnodiging)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="artiest@voorbeeld.nl"
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
        {saving ? "Bezig…" : "Artiest toevoegen"}
      </button>
    </form>
  );
}
