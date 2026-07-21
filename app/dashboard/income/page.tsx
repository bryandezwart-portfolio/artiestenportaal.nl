import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CsvImport from "./csv-import";
import { formatEUR, formatDate } from "@/lib/format";

export default async function IncomePage() {
  const supabase = createClient();

  const { data: income } = await supabase
    .from("income_entries")
    .select("id, entry_date, platform, gross_amount, label_amount, artist_amount, release_id, releases(title, artists(name))")
    .order("entry_date", { ascending: false })
    .limit(200);

  const totalGross = income?.reduce((s, e) => s + Number(e.gross_amount), 0) ?? 0;

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-7">
          <h1 className="text-[28px] font-semibold text-ink tracking-tight">Inkomsten</h1>
          <p className="text-muted text-[13px] mt-0.5">
            Alle betalingen per platform &middot; {formatEUR(totalGross)} bruto totaal
          </p>
        </header>

        <CsvImport />

        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden mt-6">
          {(!income || income.length === 0) && (
            <p className="text-muted text-[13px] p-8 text-center">Nog geen boekingen.</p>
          )}
          {income?.map((e: any) => (
            <Link
              key={e.id}
              href={`/dashboard/releases/${e.release_id}`}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-surfaceHover transition text-[13px]"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 bg-accentSoft text-accent">
                  {e.platform}
                </span>
                <span className="text-ink font-medium">{e.releases?.title}</span>
                <span className="text-muted"> &middot; {e.releases?.artists?.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-muted">{formatDate(e.entry_date)}</span>
                <span className="font-mono text-ink">{formatEUR(e.gross_amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
