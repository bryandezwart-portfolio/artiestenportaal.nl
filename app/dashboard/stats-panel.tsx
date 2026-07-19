const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const MONTH_LABELS = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

type Entry = {
  type: string;
  amount: number;
  entry_date: string | null;
  release_id: string;
  releases: { title: string } | null;
};

export default function StatsPanel({ entries }: { entries: Entry[] }) {
  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const costs = entries.filter((e) => e.type === "cost").reduce((s, e) => s + Number(e.amount), 0);
  const net = income - costs;

  // Top releases by netto omzet
  const byRelease = new Map<string, { title: string; net: number }>();
  for (const e of entries) {
    const title = e.releases?.title ?? "Onbekend";
    const current = byRelease.get(e.release_id) ?? { title, net: 0 };
    current.net += e.type === "income" ? Number(e.amount) : e.type === "cost" ? -Number(e.amount) : 0;
    byRelease.set(e.release_id, current);
  }
  const topReleases = [...byRelease.values()]
    .sort((a, b) => b.net - a.net)
    .slice(0, 5);
  const maxReleaseNet = Math.max(1, ...topReleases.map((r) => r.net));

  // Omzet per maand, laatste 6 maanden
  const now = new Date();
  const months: { key: string; label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: MONTH_LABELS[d.getMonth()], total: 0 });
  }
  for (const e of entries) {
    if (e.type !== "income" || !e.entry_date) continue;
    const key = e.entry_date.slice(0, 7);
    const m = months.find((m) => m.key === key);
    if (m) m.total += Number(e.amount);
  }
  const maxMonth = Math.max(1, ...months.map((m) => m.total));

  return (
    <div className="mb-8">
      <h2 className="text-[13.5px] font-medium text-ink mb-3">Statistieken</h2>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <StatCard label="Totale omzet" value={fmt(income)} />
        <StatCard label="Totale kosten" value={fmt(costs)} />
        <StatCard label="Netto" value={fmt(net)} highlight />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl2 shadow-card p-5">
          <div className="text-[11px] font-medium text-muted tracking-wide mb-4">
            TOP RELEASES
          </div>
          {topReleases.length === 0 && (
            <p className="text-muted text-[12.5px]">Nog geen data.</p>
          )}
          <div className="flex flex-col gap-3">
            {topReleases.map((r) => (
              <div key={r.title}>
                <div className="flex justify-between text-[12.5px] mb-1">
                  <span className="text-ink truncate pr-2">{r.title}</span>
                  <span className="text-muted font-mono flex-shrink-0">{fmt(r.net)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(4, (r.net / maxReleaseNet) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl2 shadow-card p-5">
          <div className="text-[11px] font-medium text-muted tracking-wide mb-4">
            OMZET PER MAAND
          </div>
          <div className="flex items-end justify-between gap-2 h-24">
            {months.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center h-16">
                  <div
                    className="w-full max-w-[22px] rounded-t-sm bg-accent"
                    style={{ height: `${Math.max(4, (m.total / maxMonth) * 100)}%` }}
                    title={fmt(m.total)}
                  />
                </div>
                <span className="text-[10px] text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl2 shadow-card p-5">
      <div className="text-[11px] font-medium text-muted tracking-wide">{label.toUpperCase()}</div>
      <div
        className={`text-[22px] font-semibold tracking-tight mt-1 ${highlight ? "text-accent" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}
