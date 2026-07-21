import { createClient } from "@/lib/supabase/server";
import ReleaseCard from "./release-card";
import { formatEUR } from "@/lib/format";

export default async function ArtistView() {
  const supabase = createClient();

  // Geen expliciete filter nodig: RLS zorgt dat een artiest hier alleen zijn/haar
  // eigen releases en boekingen ziet.
  const { data: releases } = await supabase
    .from("releases")
    .select("id, title, release_date, label_percent, income_entries(*), adjustments(*)")
    .order("created_at", { ascending: false });

  let totalNet = 0;
  let totalGross = 0;

  const releaseSummaries = (releases ?? []).map((r: any) => {
    const income = r.income_entries ?? [];
    const adjustments = r.adjustments ?? [];
    const gross = income.reduce((s: number, e: any) => s + Number(e.gross_amount), 0);
    const artistGross = income.reduce((s: number, e: any) => s + Number(e.artist_amount), 0);
    const costs = adjustments
      .filter((a: any) => a.type === "cost")
      .reduce((s: number, a: any) => s + Number(a.amount), 0);
    const advances = adjustments
      .filter((a: any) => a.type === "advance")
      .reduce((s: number, a: any) => s + Number(a.amount), 0);
    const net = Math.max(artistGross - costs - advances, 0);

    totalNet += net;
    totalGross += gross;

    // Groepeer per platform voor het uitklapbare detail
    const byPlatform = new Map<string, number>();
    for (const e of income) {
      byPlatform.set(e.platform, (byPlatform.get(e.platform) ?? 0) + Number(e.artist_amount));
    }

    return {
      id: r.id,
      title: r.title,
      releaseDate: r.release_date,
      artistPercent: 100 - r.label_percent,
      gross,
      net,
      costs,
      advances,
      platforms: [...byPlatform.entries()].map(([platform, amount]) => ({ platform, amount })),
      entries: income,
    };
  });

  return (
    <main className="animate-blur-in min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink tracking-tight mb-1">Mijn overzicht</h1>
        <p className="text-muted text-sm mb-8">Jouw verdiensten per release</p>

        {/* Totaal bovenaan */}
        <div className="bg-surface rounded-xl2 shadow-card p-7 mb-6">
          <div className="text-[11.5px] font-medium text-muted tracking-wide uppercase mb-1.5">
            Totaal te ontvangen
          </div>
          <div className="text-[34px] font-semibold text-ink tracking-tight">
            {formatEUR(totalNet)}
          </div>
          <div className="text-[12.5px] text-muted mt-1">
            over {formatEUR(totalGross)} bruto inkomsten, {releaseSummaries.length} release
            {releaseSummaries.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {releaseSummaries.length === 0 && (
            <p className="text-muted text-sm text-center py-12">
              Nog geen releases gekoppeld aan jouw account.
            </p>
          )}

          {releaseSummaries.map((r) => (
            <ReleaseCard key={r.id} release={r} />
          ))}
        </div>
      </div>
    </main>
  );
}
