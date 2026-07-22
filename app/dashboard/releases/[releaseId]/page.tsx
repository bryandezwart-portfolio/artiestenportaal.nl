import { createClient } from "@/lib/supabase/server";
import SplitEditor from "./split-editor";
import CodesEditor from "./codes-editor";
import IncomeForm from "./income-form";
import AdjustmentForm from "./adjustment-form";
import EntryRow from "./entry-row";
import { formatEUR, formatDate } from "@/lib/format";

export default async function ReleaseDetail({ params }: { params: { releaseId: string } }) {
  const supabase = createClient();

  const { data: release } = await supabase
    .from("releases")
    .select("id, title, label_percent, release_date, distributor, isrc, upc, iswc, notes, artists(name)")
    .eq("id", params.releaseId)
    .single();

  if (!release) {
    return <main className="p-10 text-center text-muted">Release niet gevonden.</main>;
  }

  const [{ data: income }, { data: adjustments }] = await Promise.all([
    supabase
      .from("income_entries")
      .select("*")
      .eq("release_id", params.releaseId)
      .order("entry_date", { ascending: false }),
    supabase
      .from("adjustments")
      .select("*")
      .eq("release_id", params.releaseId)
      .order("entry_date", { ascending: false }),
  ]);

  const totalGross = income?.reduce((s, e) => s + Number(e.gross_amount), 0) ?? 0;
  const totalLabel = income?.reduce((s, e) => s + Number(e.label_amount), 0) ?? 0;
  const totalArtistGross = income?.reduce((s, e) => s + Number(e.artist_amount), 0) ?? 0;
  const totalCosts = adjustments?.filter((a) => a.type === "cost").reduce((s, a) => s + Number(a.amount), 0) ?? 0;
  const totalAdvances = adjustments?.filter((a) => a.type === "advance").reduce((s, a) => s + Number(a.amount), 0) ?? 0;
  const netToArtist = Math.max(totalArtistGross - totalCosts - totalAdvances, 0);

  return (
    <main className="animate-blur-in min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">{release.title}</h1>
        <p className="text-muted text-sm mt-0.5 mb-8">
          {(release as any).artists?.name}
          {release.release_date ? ` \u00b7 ${formatDate(release.release_date)}` : ""}
          {release.distributor ? ` \u00b7 ${release.distributor}` : ""}
        </p>

        <SplitEditor releaseId={release.id} initialLabelPercent={release.label_percent} />

        <CodesEditor
          releaseId={release.id}
          initialIsrc={release.isrc}
          initialUpc={release.upc}
          initialIswc={release.iswc}
        />

        {/* Financieel overzicht */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <MiniStat label="Bruto totaal" value={formatEUR(totalGross)} />
          <MiniStat label="Label-aandeel" value={formatEUR(totalLabel)} accent="text-label" />
          <MiniStat label="Kosten + voorschot" value={formatEUR(totalCosts + totalAdvances)} accent="text-danger" />
          <MiniStat label="Netto voor artiest" value={formatEUR(netToArtist)} accent="text-artist" />
        </div>

        <IncomeForm releaseId={release.id} defaultLabelPercent={release.label_percent} />

        <div className="bg-surface rounded-xl2 shadow-card mt-6 overflow-hidden">
          <div className="px-6 pt-5 pb-2">
            <h2 className="text-[13px] font-semibold text-ink">Inkomsten per platform</h2>
          </div>
          <div className="divide-y divide-line">
            {(!income || income.length === 0) && (
              <p className="text-muted text-sm p-8 text-center">Nog geen boekingen.</p>
            )}
            {income?.map((e) => (
              <EntryRow key={e.id} kind="income" entry={e} />
            ))}
          </div>
        </div>

        <AdjustmentForm releaseId={release.id} />

        <div className="bg-surface rounded-xl2 shadow-card mt-6 overflow-hidden mb-10">
          <div className="px-6 pt-5 pb-2">
            <h2 className="text-[13px] font-semibold text-ink">Kosten &amp; voorschotten</h2>
          </div>
          <div className="divide-y divide-line">
            {(!adjustments || adjustments.length === 0) && (
              <p className="text-muted text-sm p-8 text-center">Nog geen kosten of voorschotten.</p>
            )}
            {adjustments?.map((a) => (
              <EntryRow key={a.id} kind="adjustment" entry={a} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-surface rounded-xl2 shadow-card p-4">
      <div className="text-[10.5px] font-medium text-muted tracking-wide uppercase mb-1">{label}</div>
      <div className={`text-[16px] font-semibold tracking-tight ${accent ?? "text-ink"}`}>{value}</div>
    </div>
  );
}
