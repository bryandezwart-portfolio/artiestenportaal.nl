import { createClient } from "@/lib/supabase/server";
import SettlementView from "./settlement-view";

export default async function AfrekeningPage({
  searchParams,
}: {
  searchParams: { artistId?: string; from?: string; to?: string };
}) {
  const supabase = createClient();

  const { data: artists } = await supabase.from("artists").select("id, name").order("name");

  const artistId = searchParams.artistId || artists?.[0]?.id || "";
  const from = searchParams.from || `${new Date().getFullYear()}-01-01`;
  const to = searchParams.to || `${new Date().getFullYear()}-12-31`;

  let entries: any[] = [];
  let releases: any[] = [];

  if (artistId) {
    const { data: releaseRows } = await supabase
      .from("releases")
      .select("id, title, label_percent")
      .eq("artist_id", artistId);
    releases = releaseRows ?? [];

    const releaseIds = releases.map((r) => r.id);

    if (releaseIds.length > 0) {
      const [{ data: income }, { data: adjustments }] = await Promise.all([
        supabase
          .from("income_entries")
          .select("*")
          .in("release_id", releaseIds)
          .gte("entry_date", from)
          .lte("entry_date", to)
          .order("entry_date", { ascending: true }),
        supabase
          .from("adjustments")
          .select("*")
          .in("release_id", releaseIds)
          .gte("entry_date", from)
          .lte("entry_date", to)
          .order("entry_date", { ascending: true }),
      ]);

      entries = [
        ...(income ?? []).map((e) => ({ ...e, kind: "income" as const })),
        ...(adjustments ?? []).map((a) => ({ ...a, kind: "adjustment" as const })),
      ];
    }
  }

  const selectedArtist = artists?.find((a) => a.id === artistId);

  return (
    <SettlementView
      artists={artists ?? []}
      selectedArtistId={artistId}
      selectedArtistName={selectedArtist?.name ?? ""}
      from={from}
      to={to}
      releases={releases}
      entries={entries}
    />
  );
}
