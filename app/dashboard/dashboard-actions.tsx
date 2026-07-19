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
          className="text-sm font-medium bg-surface border border-line text-ink px-4 py-2 rounded-lg hover:bg-canvas transition"
        >
          + Nieuwe artiest
        </button>
        <button
          onClick={() => setShowRelease(true)}
          disabled={artists.length === 0}
          title={artists.length === 0 ? "Voeg eerst een artiest toe" : ""}
          className="text-sm font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl2 shadow-card p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-sm"
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

    const { error } = await supabase.from("artists").insert({
      name,
      // user_id blijft leeg tot de artiest een eigen account heeft in Supabase Auth
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
    <Modal title="Nieuwe artiest" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Naam</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder="Artiestnaam"
          />
        </div>
        <p className="text-xs text-muted">
          Nog geen inlog nodig? Laat dit gewoon zo — je kunt de artiest later koppelen aan een
          account in Supabase (Authentication → Users), zodat die kan inloggen.
        </p>
        {error && <p className="text-danger text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-accent text-white text-sm font-medium rounded-lg py-2.5 hover:bg-accent/90 transition disabled:opacity-50"
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
          <label className="text-xs font-medium text-muted mb-1 block">Titel</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder="Titel van de release"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">Artiest</label>
          <select
            required
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          >
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted mb-1 block">
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
        {error && <p className="text-danger text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-accent text-white text-sm font-medium rounded-lg py-2.5 hover:bg-accent/90 transition disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Release toevoegen"}
        </button>
      </form>
    </Modal>
  );
}
