"use client";

import { useRouter } from "next/navigation";
import { formatEUR, formatDate } from "@/lib/format";

type Artist = { id: string; name: string };
type Release = { id: string; title: string; label_percent: number };
type Entry = any;

export default function SettlementView({
  artists,
  selectedArtistId,
  selectedArtistName,
  from,
  to,
  releases,
  entries,
}: {
  artists: Artist[];
  selectedArtistId: string;
  selectedArtistName: string;
  from: string;
  to: string;
  releases: Release[];
  entries: Entry[];
}) {
  const router = useRouter();

  function updateParams(next: Partial<{ artistId: string; from: string; to: string }>) {
    const params = new URLSearchParams({
      artistId: next.artistId ?? selectedArtistId,
      from: next.from ?? from,
      to: next.to ?? to,
    });
    router.push(`/dashboard/afrekening?${params.toString()}`);
  }

  const income = entries.filter((e) => e.kind === "income");
  const costs = entries.filter((e) => e.kind === "adjustment" && e.type === "cost");
  const advances = entries.filter((e) => e.kind === "adjustment" && e.type === "advance");

  const totalGross = income.reduce((s, e) => s + Number(e.gross_amount), 0);
  const totalLabel = income.reduce((s, e) => s + Number(e.label_amount), 0);
  const totalArtistGross = income.reduce((s, e) => s + Number(e.artist_amount), 0);
  const totalCosts = costs.reduce((s, e) => s + Number(e.amount), 0);
  const totalAdvances = advances.reduce((s, e) => s + Number(e.amount), 0);
  const netToArtist = Math.max(totalArtistGross - totalCosts - totalAdvances, 0);

  const releaseTitle = (id: string) => releases.find((r) => r.id === id)?.title ?? "";

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="no-print mb-7 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Afrekening</h1>
            <p className="text-muted text-[13px] mt-0.5">
              Kies een artiest en periode voor een net overzicht om te printen of te delen
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="text-[13px] font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition"
          >
            Printen / PDF
          </button>
        </header>

        <div className="no-print bg-surface rounded-xl2 shadow-card p-6 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Artiest</label>
            <select
              value={selectedArtistId}
              onChange={(e) => updateParams({ artistId: e.target.value })}
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
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Periode van</label>
            <input
              type="date"
              value={from}
              onChange={(e) => updateParams({ from: e.target.value })}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-muted mb-1.5 block">Periode t/m</label>
            <input
              type="date"
              value={to}
              onChange={(e) => updateParams({ to: e.target.value })}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
        </div>

        {/* Printbaar overzicht */}
        <div className="bg-surface rounded-xl2 shadow-card p-8">
          <div className="flex items-center justify-between mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Artiestenportaal.nl" className="h-8 w-auto" />
            <span className="text-[12px] text-muted">
              {formatDate(from)} — {formatDate(to)}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-ink tracking-tight mt-4">
            Afrekening — {selectedArtistName}
          </h2>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat label="Bruto inkomsten" value={formatEUR(totalGross)} />
            <Stat label="Label-aandeel" value={formatEUR(totalLabel)} accent="text-label" />
            <Stat label="Uit te keren aan artiest" value={formatEUR(netToArtist)} accent="text-artist" />
          </div>

          {(totalCosts > 0 || totalAdvances > 0) && (
            <p className="text-[12px] text-muted mt-3">
              Artiest bruto-aandeel {formatEUR(totalArtistGross)}, minus {formatEUR(totalCosts)} kosten
              en {formatEUR(totalAdvances)} voorschot(ten).
            </p>
          )}

          <h3 className="text-[13px] font-semibold text-ink mt-8 mb-3">Detail per betaling</h3>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="py-2 font-medium">Datum</th>
                <th className="py-2 font-medium">Platform</th>
                <th className="py-2 font-medium">Titel</th>
                <th className="py-2 font-medium text-right">Bruto</th>
                <th className="py-2 font-medium text-right">Label %</th>
                <th className="py-2 font-medium text-right">Artiest bedrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {income.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted">
                    Geen inkomsten in deze periode.
                  </td>
                </tr>
              )}
              {income.map((e) => (
                <tr key={e.id} className="text-ink">
                  <td className="py-2">{formatDate(e.entry_date)}</td>
                  <td className="py-2">{e.platform}</td>
                  <td className="py-2">{releaseTitle(e.release_id)}</td>
                  <td className="py-2 text-right font-mono">{formatEUR(e.gross_amount)}</td>
                  <td className="py-2 text-right font-mono">{e.label_percent}%</td>
                  <td className="py-2 text-right font-mono">{formatEUR(e.artist_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(costs.length > 0 || advances.length > 0) && (
            <>
              <h3 className="text-[13px] font-semibold text-ink mt-8 mb-3">Kosten &amp; voorschotten</h3>
              <table className="w-full text-[12.5px]">
                <tbody className="divide-y divide-line">
                  {[...costs, ...advances].map((a) => (
                    <tr key={a.id} className="text-ink">
                      <td className="py-2">{formatDate(a.entry_date)}</td>
                      <td className="py-2">{a.type === "cost" ? "Kosten" : "Voorschot"}</td>
                      <td className="py-2">{releaseTitle(a.release_id)}</td>
                      <td className="py-2">{a.description}</td>
                      <td className="py-2 text-right font-mono">-{formatEUR(a.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-canvas rounded-xl p-4">
      <div className="text-[10.5px] font-medium text-muted tracking-wide uppercase mb-1">{label}</div>
      <div className={`text-[17px] font-semibold tracking-tight ${accent ?? "text-ink"}`}>{value}</div>
    </div>
  );
}
