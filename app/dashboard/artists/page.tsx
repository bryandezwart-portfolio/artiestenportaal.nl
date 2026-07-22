import { createClient } from "@/lib/supabase/server";
import NewArtistForm from "./new-artist-form";
import ArtistSearchList from "./artist-search-list";

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

        <ArtistSearchList artists={(artists ?? []) as any} />
      </div>
    </main>
  );
}
