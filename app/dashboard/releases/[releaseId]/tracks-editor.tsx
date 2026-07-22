"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Track = {
  id: string;
  title: string;
  isrc: string | null;
  artist_split: number | null;
};

export default function TracksEditor({
  releaseId,
  tracks,
  defaultArtistSplit,
}: {
  releaseId: string;
  tracks: Track[];
  defaultArtistSplit: number;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isrc, setIsrc] = useState("");
  const [customSplit, setCustomSplit] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function addTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    const { error } = await supabase.from("tracks").insert({
      release_id: releaseId,
      title: title.trim(),
      isrc: isrc.trim() || null,
      artist_split: customSplit ? Number(customSplit) : null,
    });

    setSaving(false);
    if (error) {
      setError(error.code === "23505" ? "Deze ISRC is al in gebruik." : error.message);
      return;
    }
    setTitle("");
    setIsrc("");
    setCustomSplit("");
    router.refresh();
  }

  async function removeTrack(id: string) {
    if (!confirm("Deze track verwijderen?")) return;
    await supabase.from("tracks").delete().eq("id", id);
    router.refresh();
  }

  async function updateTrackSplit(id: string, value: string) {
    await supabase
      .from("tracks")
      .update({ artist_split: value ? Number(value) : null })
      .eq("id", id);
    router.refresh();
  }

  return (
    <div className="bg-surface rounded-xl2 shadow-card mt-6 overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Tracks</h2>
          <p className="text-[11.5px] text-muted mt-0.5">
            Los van de release-verdeling ({defaultArtistSplit}% artiest) kun je per track
            een eigen ISRC en (optioneel) een afwijkende verdeling instellen — handig bij features
            of samenwerkingen.
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-[12.5px] text-accent hover:underline shrink-0 ml-3"
        >
          {open ? "Sluiten" : "+ Track"}
        </button>
      </div>

      {open && (
        <form onSubmit={addTrack} className="px-6 pb-4 grid sm:grid-cols-3 gap-3 animate-pop-in">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tracktitel"
            className="rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
          <input
            value={isrc}
            onChange={(e) => setIsrc(e.target.value)}
            placeholder="ISRC (optioneel)"
            className="rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={customSplit}
              onChange={(e) => setCustomSplit(e.target.value)}
              placeholder={`Artiest % (std. ${defaultArtistSplit}%)`}
              className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
            <button
              type="submit"
              disabled={saving}
              className="text-[13px] font-medium bg-accent text-white px-3.5 py-2 rounded-lg hover:bg-accent/90 transition disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? "…" : "Toevoegen"}
            </button>
          </div>
          {error && <p className="text-danger text-[12px] sm:col-span-3">{error}</p>}
        </form>
      )}

      <div className="divide-y divide-line">
        {tracks.length === 0 && (
          <p className="text-muted text-[13px] p-6 text-center">
            Nog geen losse tracks — de release wordt behandeld als één geheel.
          </p>
        )}
        {tracks.map((t) => (
          <div key={t.id} className="group flex items-center justify-between px-6 py-3 text-[13px]">
            <div className="min-w-0">
              <span className="text-ink">{t.title}</span>
              {t.isrc && <span className="text-muted font-mono text-[11.5px] ml-2">{t.isrc}</span>}
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={t.artist_split ?? ""}
                  onBlur={(e) => updateTrackSplit(t.id, e.target.value)}
                  placeholder={`${defaultArtistSplit}%`}
                  className="w-16 rounded-md border border-line bg-canvas px-2 py-1 text-[12px] text-ink text-right focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
                <span className="text-[11px] text-muted">% artiest</span>
              </div>
              <button
                onClick={() => removeTrack(t.id)}
                className="opacity-0 group-hover:opacity-100 text-danger text-[12px] transition"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
