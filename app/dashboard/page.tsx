import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DashboardActions from "./dashboard-actions";
import StatsPanel from "./stats-panel";

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

  const { data: entries } = await supabase
    .from("entries")
    .select("type, amount, entry_date, release_id, releases(title)");

  return (
    <main className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-end justify-between mb-7 flex-wrap gap-4">
          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Overzicht</h1>
            <p className="text-muted text-[13px] mt-0.5">Alle releases en hun verdeling</p>
          </div>
          <DashboardActions artists={artists ?? []} />
        </header>

        <StatsPanel entries={(entries as any) ?? []} />

        {(!artists || artists.length === 0) && (
          <p className="text-muted text-[12.5px] mb-4">
            Begin met "+ Nieuwe artiest" — daarna kun je releases aan die artiest koppelen.
          </p>
        )}

        <h2 className="text-[13.5px] font-medium text-ink mb-3">Releases</h2>
        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden">
          {(!releases || releases.length === 0) && (
            <div className="p-10 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-line mx-auto mb-3" />
              <p className="text-muted text-[13px]">
                Nog geen releases. Voeg er een toe met de knop hierboven.
              </p>
            </div>
          )}

          {releases?.map((r: any) => (
            <Link
              key={r.id}
              href={`/dashboard/${r.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-surfaceHover active:bg-surfaceHover transition-colors duration-100"
            >
              <div>
                <div className="text-[14px] font-medium text-ink">{r.title}</div>
                <div className="text-[12.5px] text-muted mt-0.5">{r.artists?.name}</div>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-mono">
                <span className="text-artist font-medium">{r.artist_split}%</span>
                <span className="text-line">/</span>
                <span className="text-label font-medium">{100 - r.artist_split}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
