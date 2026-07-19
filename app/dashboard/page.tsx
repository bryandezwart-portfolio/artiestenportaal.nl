import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DashboardActions from "./dashboard-actions";

export default async function Dashboard() {
  const supabase = createClient();

  const { data: releases } = await supabase
    .from("releases")
    .select("id, title, artist_split, artists(name)")
    .order("created_at", { ascending: false });

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">Overzicht</h1>
            <p className="text-muted text-sm mt-0.5">Alle releases en hun verdeling</p>
          </div>
          <span className="text-xs font-medium bg-accentSoft text-accent px-3 py-1.5 rounded-full">
            Label-weergave
          </span>
        </header>

        <div className="mb-6">
          <DashboardActions artists={artists ?? []} />
        </div>

        {(!artists || artists.length === 0) && (
          <p className="text-muted text-xs mb-4">
            Begin met "+ Nieuwe artiest" — daarna kun je releases aan die artiest koppelen.
          </p>
        )}

        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden">
          {(!releases || releases.length === 0) && (
            <p className="text-muted text-sm p-8 text-center">
              Nog geen releases. Voeg er een toe met de knop hierboven.
            </p>
          )}

          {releases?.map((r: any) => (
            <Link
              key={r.id}
              href={`/dashboard/${r.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-canvas/60 transition"
            >
              <div>
                <div className="text-sm font-medium text-ink">{r.title}</div>
                <div className="text-xs text-muted mt-0.5">{r.artists?.name}</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-artist">{r.artist_split}%</span>
                <span className="text-line">/</span>
                <span className="text-label">{100 - r.artist_split}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
