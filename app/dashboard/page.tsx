import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEUR, formatDate } from "@/lib/format";

export default async function Dashboard() {
  const supabase = createClient();

  const [{ data: releases }, { data: artists }, { data: income }] = await Promise.all([
    supabase.from("releases").select("id, title, label_percent, artist_id, artists(name)"),
    supabase.from("artists").select("id, name"),
    supabase
      .from("income_entries")
      .select("id, entry_date, platform, gross_amount, label_amount, artist_amount, release_id, releases(title, artists(name))")
      .order("entry_date", { ascending: false })
      .limit(8),
  ]);

  const { data: allIncome } = await supabase
    .from("income_entries")
    .select("gross_amount, label_amount, artist_amount, release_id");

  const totalGross = allIncome?.reduce((s, e) => s + Number(e.gross_amount), 0) ?? 0;
  const totalLabel = allIncome?.reduce((s, e) => s + Number(e.label_amount), 0) ?? 0;
  const totalArtist = allIncome?.reduce((s, e) => s + Number(e.artist_amount), 0) ?? 0;

  // Top artiesten op basis van artiest-aandeel
  const byArtist = new Map<string, { name: string; total: number }>();
  for (const entry of allIncome ?? []) {
    const release = releases?.find((r) => r.id === entry.release_id);
    if (!release) continue;
    const key = release.artist_id;
    const name = (release.artists as any)?.name ?? "Onbekend";
    const prev = byArtist.get(key) ?? { name, total: 0 };
    prev.total += Number(entry.artist_amount);
    byArtist.set(key, prev);
  }
  const topArtists = [...byArtist.values()].sort((a, b) => b.total - a.total).slice(0, 6);
  const maxArtistTotal = Math.max(1, ...topArtists.map((a) => a.total));

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Overzicht</h1>
            <p className="text-muted text-[13px] mt-0.5">Alle releases, artiesten en verdiensten</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/releases"
              className="text-[13px] font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition"
            >
              + Nieuwe release
            </Link>
          </div>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Bruto inkomsten" value={formatEUR(totalGross)} accentClass="text-ink" />
          <StatCard label="Label-aandeel" value={formatEUR(totalLabel)} accentClass="text-label" />
          <StatCard label="Artiest-aandeel" value={formatEUR(totalArtist)} accentClass="text-artist" />
          <StatCard label="Actieve artiesten" value={String(artists?.length ?? 0)} accentClass="text-ink" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top artiesten */}
          <div className="bg-surface rounded-xl2 shadow-card p-6">
            <h2 className="text-[13px] font-semibold text-ink mb-4">Top artiesten (artiest-aandeel)</h2>
            {topArtists.length === 0 && (
              <p className="text-muted text-[13px] py-6 text-center">Nog geen inkomsten geboekt.</p>
            )}
            <div className="flex flex-col gap-3">
              {topArtists.map((a) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="text-ink font-medium">{a.name}</span>
                    <span className="text-muted font-mono">{formatEUR(a.total)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-canvas overflow-hidden">
                    <div
                      className="h-full rounded-full bg-artist transition-all"
                      style={{ width: `${(a.total / maxArtistTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recente inkomsten */}
          <div className="bg-surface rounded-xl2 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h2 className="text-[13px] font-semibold text-ink">Recente inkomsten</h2>
              <Link href="/dashboard/income" className="text-[12.5px] text-accent hover:underline">
                Alles bekijken
              </Link>
            </div>
            <div className="divide-y divide-line">
              {(!income || income.length === 0) && (
                <p className="text-muted text-[13px] p-8 text-center">Nog geen boekingen.</p>
              )}
              {income?.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between px-6 py-3 text-[13px]">
                  <div className="min-w-0">
                    <div className="text-ink font-medium truncate">{e.releases?.title}</div>
                    <div className="text-muted text-[12px] mt-0.5">
                      {e.platform} &middot; {formatDate(e.entry_date)}
                    </div>
                  </div>
                  <span className="font-mono text-ink shrink-0 ml-3">{formatEUR(e.gross_amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Releases lijst kort */}
        <div className="bg-surface rounded-xl2 shadow-card mt-6 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-3">
            <h2 className="text-[13px] font-semibold text-ink">Releases</h2>
            <Link href="/dashboard/releases" className="text-[12.5px] text-accent hover:underline">
              Beheren
            </Link>
          </div>
          <div className="divide-y divide-line">
            {(!releases || releases.length === 0) && (
              <p className="text-muted text-[13px] p-8 text-center">Nog geen releases.</p>
            )}
            {releases?.slice(0, 6).map((r: any) => (
              <Link
                key={r.id}
                href={`/dashboard/releases/${r.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-surfaceHover transition"
              >
                <div>
                  <div className="text-[13.5px] font-medium text-ink">{r.title}</div>
                  <div className="text-[12px] text-muted mt-0.5">{r.artists?.name}</div>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-mono">
                  <span className="text-artist">{100 - r.label_percent}%</span>
                  <span className="text-line">/</span>
                  <span className="text-label">{r.label_percent}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accentClass,
}: {
  label: string;
  value: string;
  accentClass: string;
}) {
  return (
    <div className="bg-surface rounded-xl2 shadow-card p-5 animate-pop-in">
      <div className="text-[11.5px] font-medium text-muted tracking-wide uppercase mb-1.5">
        {label}
      </div>
      <div className={`text-[22px] font-semibold tracking-tight ${accentClass}`}>{value}</div>
    </div>
  );
}
