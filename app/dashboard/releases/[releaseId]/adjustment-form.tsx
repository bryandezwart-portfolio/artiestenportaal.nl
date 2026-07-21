"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdjustmentForm({ releaseId }: { releaseId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"cost" | "advance">("cost");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/adjustments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ releaseId, type, entryDate, amount: Number(amount), description }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Toevoegen mislukt.");
      return;
    }

    setAmount("");
    setDescription("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-surface rounded-xl2 shadow-card p-4 text-[13.5px] font-medium text-accent hover:bg-surfaceHover transition text-center mt-6"
      >
        + Kosten of voorschot toevoegen
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col gap-4 mt-6 animate-pop-in"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">Kosten / voorschot</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12.5px] text-muted hover:text-ink"
        >
          Annuleren
        </button>
      </div>

      <div className="flex gap-1 bg-canvas rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setType("cost")}
          className={`text-[12.5px] font-medium px-3 py-1.5 rounded-md transition ${
            type === "cost" ? "bg-surface text-ink shadow-sm" : "text-muted"
          }`}
        >
          Kosten
        </button>
        <button
          type="button"
          onClick={() => setType("advance")}
          className={`text-[12.5px] font-medium px-3 py-1.5 rounded-md transition ${
            type === "advance" ? "bg-surface text-ink shadow-sm" : "text-muted"
          }`}
        >
          Voorschot
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
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Bedrag (€)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Omschrijving</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="bv. mastering, videoclip, voorschot opname"
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
        {saving ? "Bezig…" : "Toevoegen"}
      </button>
    </form>
  );
}
