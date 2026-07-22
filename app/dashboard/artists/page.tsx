import { createClient } from "@/lib/supabase/server";
import ArtistRow from "./artist-row";
import NewArtistForm from "./new-artist-form";

export default async function ArtistsPage() {
  const supabase = createClient();

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, artist_code, contract_status, contract_notes, contract_start_date, contract_end_date")
    .order("name", { ascending: true });

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-7">
          <h1 className="text-[28px] font-semibold text-ink tracking-tight">Artiesten</h1>
          <p className="text-muted text-[13px] mt-0.5">
            Beheer contactgegevens en houd de contractstatus bij
          </p>
        </header>

        <NewArtistForm />

        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden">
          {(!artists || artists.length === 0) && (
            <p className="text-muted text-[13px] p-8 text-center">
              Nog geen artiesten. Voeg er hierboven een toe.
            </p>
          )}
          {artists?.map((a) => (
            <ArtistRow key={a.id} artist={a as any} />
          ))}
        </div>
      </div>
    </main>
  );
}
