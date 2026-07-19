"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Artist = { id: string; name: string };

export default function DashboardActions({ artists }: { artists: Artist[] }) {
  const [showArtist, setShowArtist] = useState(false);
  const [showRelease, setShowRelease] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowArtist(true)}
          className="text-[13px] font-medium bg-surface border border-line text-ink px-3.5 py-2 rounded-lg hover:bg-surfaceHover active:scale-[0.97] transition"
        >
          + Nieuwe artiest
        </button>
        <button
          onClick={() => setShowRelease(true)}
          disabled={artists.length === 0}
          title={artists.length === 0 ? "Voeg eerst een artiest toe" : ""}
          className="text-[13px] font-medium bg-accent text-white px-3.5 py-2 rounded-lg shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.97] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          + Nieuwe release
        </button>
      </div>

      {showArtist && <NewArtistModal onClose={() => setShowArtist(false)} />}
      {showRelease && (
        <NewReleaseModal artists={artists} onClose={() => setShowRelease(false)} />
      )}
    </>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-5 z-50 animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-line rounded-xl2 shadow-card p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-sm w-6 h-6 rounded-full hover:bg-surfaceHover flex items-center justify-center transition"
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NewArtistModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("artists").insert({ name });

    setLoading(false);
    if (error) {
      setError("Opslaan mislukt: " + error.message);
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <Modal title="Nieuwe artiest" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1 block">Naam</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            placeholder="Artiestnaam"
          />
        </div>
        <p className="text-[11.5px] text-muted leading-relaxed">
          Nog geen inlog nodig? Laat dit gewoon zo — je kunt de artiest later koppelen aan een
          account in Supabase (Authentication → Users), zodat die kan inloggen.
        </p>
        {error && <p className="text-danger text-[12px]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Artiest toevoegen"}
        </button>
      </form>
    </Modal>
  );
}

function NewReleaseModal({
  artists,
  onClose,
}: {
  artists: Artist[];
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState(artists[0]?.id ?? "");
  const [split, setSplit] = useState(50);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("releases").insert({
      title,
      artist_id: artistId,
      artist_split: split,
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
    <Modal title="Nieuwe release" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1 block">Titel</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            placeholder="Titel van de release"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1 block">Artiest</label>
          <select
            required
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          >
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1 block">
            Verdeelsleutel: artiest {split}% / label {100 - split}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        {error && <p className="text-danger text-[12px]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Release toevoegen"}
        </button>
      </form>
    </Modal>
  );
}
