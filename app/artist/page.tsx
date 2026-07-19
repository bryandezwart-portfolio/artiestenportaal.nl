import { createClient } from "@/lib/supabase/server";
import ReleaseCard from "./release-card";

export default async function ArtistView() {
  const supabase = createClient();

  // Geen filter nodig: RLS zorgt dat een artiest hier alleen eigen releases + boekingen ziet.
  const { data: releases } = await supabase
    .from("releases")
    .select("id, title, artist_split, entries(id, type, description, amount, entry_date)")
    .order("created_at", { ascending: false });

  return (
    <main className="px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[28px] font-semibold text-ink tracking-tight mb-1">Mijn releases</h1>
        <p className="text-muted text-[13px] mb-7">Jouw verdiensten per release</p>

        <div className="flex flex-col gap-3">
          {(!releases || releases.length === 0) && (
            <div className="p-10 text-center bg-surface rounded-xl2 shadow-card">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-line mx-auto mb-3" />
              <p className="text-muted text-[13px]">
                Nog geen releases gekoppeld aan jouw account.
              </p>
            </div>
          )}

          {releases?.map((r: any) => (
            <ReleaseCard key={r.id} release={r} />
          ))}
        </div>
      </div>
    </main>
  );
}
