"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ENTRY_TYPES = [
  { value: "income", label: "Inkomsten" },
  { value: "cost", label: "Kosten" },
  { value: "advance", label: "Voorschot (artiest)" },
];

export function AddEntryButton({ releaseId }: { releaseId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[13px] font-medium bg-surface border border-line text-ink px-3.5 py-1.5 rounded-lg hover:bg-canvas active:scale-[0.97] transition"
      >
        + Boeking toevoegen
      </button>
      {open && <EntryModal releaseId={releaseId} onClose={() => setOpen(false)} />}
    </>
  );
}

function EntryModal({
  releaseId,
  onClose,
}: {
  releaseId: string;
  onClose: () => void;
}) {
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("entries").insert({
      release_id: releaseId,
      type,
      description,
      amount: Number(amount),
      entry_date: date,
    });

    setLoading(false);
    if (error) {
      setError("Opslaan mislukt: " + error.message);
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-5 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl2 shadow-card p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-ink">Boeking toevoegen</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-sm w-6 h-6 rounded-full hover:bg-canvas flex items-center justify-center transition"
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          >
            {ENTRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Omschrijving (bv. Spotify streams juni)"
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Bedrag in €"
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
          {error && <p className="text-danger text-[12px]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? "Bezig…" : "Toevoegen"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function DeleteEntryButton({ entryId }: { entryId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    setLoading(true);
    await supabase.from("entries").delete().eq("id", entryId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-muted hover:text-danger transition disabled:opacity-40"
      aria-label="Boeking verwijderen"
    >
      ✕
    </button>
  );
}
