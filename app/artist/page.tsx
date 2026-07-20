import { createClient } from "@/lib/supabase/server";
import ArtistOverview from "./overview";

export default async function ArtistView() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artistRow } = await supabase
    .from("artists")
    .select("name, contract_status, contract_notes")
    .eq("user_id", user?.id)
    .maybeSingle();

  // Geen extra filter nodig: RLS zorgt dat een artiest hier alleen eigen
  // releases + boekingen ziet.
  const { data: releases } = await supabase
    .from("releases")
    .select(
      "id, title, artist_split, distributor, entries(id, type, platform, description, amount, entry_date)"
    )
    .order("created_at", { ascending: false });

  return (
    <ArtistOverview
      artistName={artistRow?.name}
      contractStatus={artistRow?.contract_status ?? "niet_gestart"}
      contractNotes={artistRow?.contract_notes}
      releases={(releases as any) ?? []}
    />
  );
}
