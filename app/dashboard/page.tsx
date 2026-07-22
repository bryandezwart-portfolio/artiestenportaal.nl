import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEUR, formatDate } from "@/lib/format";
import ContractLight from "@/components/contract-light";
import { getContractLight, daysUntil } from "@/lib/contract-status";
import IncomeChart from "@/components/income-chart";

const MONTH_LABELS = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export default async function Dashboard() {
  const supabase = createClient();

  const [{ data: releases }, { data: artists }, { data: income }] = await Promise.all([
    supabase.from("releases").select("id, title, label_percent, artist_id, release_date, artists(name)"),
    supabase.from("artists").select("id, name, contract_end_date"),
    supabase
      .from("income_entries")
      .select("id, entry_date, platform, gross_amount, label_amount, artist_amount, release_id, releases(title, artists(name))")
      .order("entry_date", { ascending: false })
      .limit(8),
  ]);

  const contractAlerts = (artists ?? [])
    .map((a) => ({ ...a, light: getContractLight(a.contract_end_date) }))
    .filter((a) => a.light === "orange" || a.light === "red")
    .sort((a, b) => (a.contract_end_date! < b.contract_end_date! ? -1 : 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const upcomingReleases = (releases ?? [])
    .filter((r) => {
      if (!r.release_date) return false;
      const d = new Date(r.release_date);
      return d >= today && d <= in30Days;
    })
    .sort((a, b) => (a.release_date! < b.release_date! ? -1 : 1));

  const { data: allIncome } = await supabase
    .from("income_entries")
    .select("gross_amount, label_amount, artist_amount, release_id, entry_date");

  const totalGross = allIncome?.reduce((s, e) => s + Number(e.gross_amount), 0) ?? 0;
  const totalLabel = allIncome?.reduce((s, e) => s + Number(e.label_amount), 0) ?? 0;
  const totalArtist = allIncome?.reduce((s, e) => s + Number(e.artist_amount), 0) ?? 0;

  // Laatste 12 maanden, ook lege maanden tonen zodat de trend klopt
  const monthBuckets: { label: string; gross: number; label_amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthBuckets.push({ label: MONTH_LABELS[d.getMonth()], gross: 0, label_amount: 0 });
  }
  for (const e of allIncome ?? []) {
    if (!e.entry_date) continue;
    const d = new Date(e.entry_date);
    const monthsAgo =
      (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth());
    if (monthsAgo >= 0 && monthsAgo <= 11) {
      const bucket = monthBuckets[11 - monthsAgo];
      bucket.gross += Number(e.gross_amount);
      bucket.label_amount += Number(e.label_amount);
    }
  }

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

        {contractAlerts.length > 0 && (
          <Link
            href="/dashboard/artists"
            className="block bg-surface rounded-xl2 shadow-card p-4 mb-6 hover:bg-surfaceHover transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <ContractLight endDate={contractAlerts[0].contract_end_date} />
              <span className="text-[13px] font-semibold text-ink">
                {contractAlerts.length} contract{contractAlerts.length === 1 ? "" : "en"} vraagt aandacht
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {contractAlerts.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink flex items-center gap-2">
                    <ContractLight endDate={a.contract_end_date} />
                    {a.name}
                  </span>
                  <span className="text-muted">
                    {daysUntil(a.contract_end_date!) >= 0
                      ? `loopt af over ${daysUntil(a.contract_end_date!)} dagen`
                      : `verlopen sinds ${Math.abs(daysUntil(a.contract_end_date!))} dagen`}
                  </span>
                </div>
              ))}
            </div>
          </Link>
        )}

        {upcomingReleases.length > 0 && (
          <div className="bg-surface rounded-xl2 shadow-card p-4 mb-6">
            <span className="text-[13px] font-semibold text-ink">
              {upcomingReleases.length} release{upcomingReleases.length === 1 ? "" : "s"} binnenkort
            </span>
            <div className="flex flex-col gap-1 mt-2">
              {upcomingReleases.slice(0, 4).map((r: any) => (
                <Link
                  key={r.id}
                  href={`/dashboard/releases/${r.id}`}
                  className="flex items-center justify-between text-[12.5px] hover:text-accent transition"
                >
                  <span className="text-ink">
                    {r.title} <span className="text-muted">&middot; {r.artists?.name}</span>
                  </span>
                  <span className="text-muted">{formatDate(r.release_date)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Bruto inkomsten" value={formatEUR(totalGross)} accentClass="text-ink" />
          <StatCard label="Label-aandeel" value={formatEUR(totalLabel)} accentClass="text-label" />
          <StatCard label="Artiest-aandeel" value={formatEUR(totalArtist)} accentClass="text-artist" />
          <StatCard label="Actieve artiesten" value={String(artists?.length ?? 0)} accentClass="text-ink" />
        </div>

        <div className="bg-surface rounded-xl2 shadow-card p-6 mb-6">
          <h2 className="text-[13px] font-semibold text-ink mb-4">Bruto inkomsten per maand</h2>
          {totalGross === 0 ? (
            <p className="text-muted text-[13px] py-10 text-center">Nog geen inkomsten om te tonen.</p>
          ) : (
            <IncomeChart points={monthBuckets} />
          )}
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
