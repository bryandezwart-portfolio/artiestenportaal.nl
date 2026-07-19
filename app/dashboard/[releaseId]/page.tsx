import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import SplitEditor from "./split-editor";
import { AddEntryButton, DeleteEntryButton } from "./entry-actions";

const TYPE_LABEL: Record<string, string> = {
  income: "Inkomsten",
  cost: "Kosten",
  advance: "Voorschot",
};

const TYPE_STYLE: Record<string, string> = {
  income: "bg-green-50 text-green-700",
  cost: "bg-red-50 text-red-700",
  advance: "bg-amber-50 text-amber-700",
};

export default async function ReleaseDetail({
  params,
}: {
  params: { releaseId: string };
}) {
  const supabase = createClient();

  const { data: release } = await supabase
    .from("releases")
    .select("id, title, artist_split, artists(name)")
    .eq("id", params.releaseId)
    .single();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("release_id", params.releaseId)
    .order("entry_date", { ascending: false });

  if (!release) {
    return (
      <main className="px-6 py-16 text-center text-muted text-[13.5px]">
        Release niet gevonden.
      </main>
    );
  }

  return (
    <main className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="text-[13px] text-accent hover:underline mb-4 inline-block"
        >
          ← Overzicht
        </Link>

        <h1 className="text-[26px] font-semibold text-ink tracking-tight">{release.title}</h1>
        <p className="text-muted text-[13px] mt-0.5 mb-7">{(release as any).artists?.name}</p>

        <SplitEditor releaseId={release.id} initialSplit={release.artist_split} />

        <div className="flex items-center justify-between mt-8 mb-3">
          <h2 className="text-[13.5px] font-medium text-ink">Boekingen</h2>
          <AddEntryButton releaseId={release.id} />
        </div>

        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden">
          {(!entries || entries.length === 0) && (
            <p className="text-muted text-[13px] p-8 text-center">Nog geen boekingen.</p>
          )}
          {entries?.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-6 py-3.5 text-[13.5px]">
              <div className="min-w-0">
                <span
                  className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 ${TYPE_STYLE[e.type]}`}
                >
                  {TYPE_LABEL[e.type]}
                </span>
                <span className="text-ink">{e.description || "—"}</span>
                {e.entry_date && (
                  <span className="text-muted ml-2 text-[11.5px]">{e.entry_date}</span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono text-ink">
                  {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                    Number(e.amount)
                  )}
                </span>
                <DeleteEntryButton entryId={e.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
