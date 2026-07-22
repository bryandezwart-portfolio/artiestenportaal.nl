import { createClient } from "@/lib/supabase/server";
import CsvImport from "./csv-import";
import IncomeSearchList from "./income-search-list";
import { formatEUR } from "@/lib/format";

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

        <IncomeSearchList income={(income ?? []) as any} />
      </div>
    </main>
  );
}
