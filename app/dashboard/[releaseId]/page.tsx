import { createClient } from "@/lib/supabase/server";
import SplitEditor from "./split-editor";

export default async function ReleaseDetail({ params }: { params: { releaseId: string } }) {
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
    return <main className="p-10 text-center text-muted">Release niet gevonden.</main>;
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">{release.title}</h1>
        <p className="text-muted text-sm mt-0.5 mb-8">{(release as any).artists?.name}</p>

        <SplitEditor releaseId={release.id} initialSplit={release.artist_split} />

        <div className="bg-surface rounded-xl2 shadow-card mt-6 divide-y divide-line overflow-hidden">
          {(!entries || entries.length === 0) && (
            <p className="text-muted text-sm p-8 text-center">Nog geen boekingen.</p>
          )}
          {entries?.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-6 py-3.5 text-sm">
              <div>
                <span
                  className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 ${
                    e.type === "income"
                      ? "bg-green-50 text-green-700"
                      : e.type === "cost"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {e.type === "income" ? "Inkomsten" : e.type === "cost" ? "Kosten" : "Voorschot"}
                </span>
                <span className="text-ink">{e.description || "—"}</span>
              </div>
              <span className="font-mono text-ink">
                {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                  e.amount
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
