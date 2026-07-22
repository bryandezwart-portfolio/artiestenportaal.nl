import { createClient } from "@/lib/supabase/server";
import NewReleaseForm from "./new-release-form";
import ReleaseSearchList from "./release-search-list";

export default async function ReleasesPage() {
  const supabase = createClient();

  const [{ data: releases }, { data: artists }] = await Promise.all([
    supabase
      .from("releases")
      .select("id, title, release_date, label_percent, distributor, isrc, upc, iswc, artists(name)")
      .order("created_at", { ascending: false }),
    supabase.from("artists").select("id, name").order("name"),
  ]);

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-7">
          <h1 className="text-[28px] font-semibold text-ink tracking-tight">Releases</h1>
          <p className="text-muted text-[13px] mt-0.5">
            Elke release met de afgesproken verdeling tussen label en artiest
          </p>
        </header>

        <NewReleaseForm artists={artists ?? []} />

        <ReleaseSearchList releases={(releases ?? []) as any} />
      </div>
    </main>
  );
}
