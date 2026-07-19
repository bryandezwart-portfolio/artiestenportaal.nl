import { createClient } from "@/lib/supabase/server";

export default async function ArtistView() {
  const supabase = createClient();

  // Geen filter nodig: RLS zorgt dat een artiest hier alleen eigen releases ziet.
  const { data: releases } = await supabase
    .from("releases")
    .select("id, title, artist_split, entries(type, amount)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink tracking-tight mb-1">Mijn releases</h1>
        <p className="text-muted text-sm mb-8">Jouw verdiensten per release</p>

        <div className="flex flex-col gap-4">
          {(!releases || releases.length === 0) && (
            <p className="text-muted text-sm text-center py-12">
              Nog geen releases gekoppeld aan jouw account.
            </p>
          )}

          {releases?.map((r: any) => {
            const income = r.entries
              .filter((e: any) => e.type === "income")
              .reduce((s: number, e: any) => s + Number(e.amount), 0);
            const costs = r.entries
              .filter((e: any) => e.type === "cost")
              .reduce((s: number, e: any) => s + Number(e.amount), 0);
            const advances = r.entries
              .filter((e: any) => e.type === "advance")
              .reduce((s: number, e: any) => s + Number(e.amount), 0);
            const net = income - costs;
            const yours = Math.max(net * (r.artist_split / 100) - advances, 0);

            return (
              <div key={r.id} className="bg-surface rounded-xl2 shadow-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{r.title}</span>
                  <span className="text-xs font-mono text-artist">{r.artist_split}% jouw deel</span>
                </div>
                <div className="text-3xl font-semibold text-ink mt-3 tracking-tight">
                  {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                    yours
                  )}
                </div>
                <div className="text-xs text-muted mt-1">te ontvangen</div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
