import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import NewReleaseForm from "./new-release-form";
import { formatDate } from "@/lib/format";

export default async function ReleasesPage() {
  const supabase = createClient();

  const [{ data: releases }, { data: artists }] = await Promise.all([
    supabase
      .from("releases")
      .select("id, title, release_date, label_percent, distributor, artists(name)")
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

        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden mt-6">
          {(!releases || releases.length === 0) && (
            <p className="text-muted text-[13px] p-8 text-center">Nog geen releases toegevoegd.</p>
          )}
          {releases?.map((r: any) => (
            <Link
              key={r.id}
              href={`/dashboard/releases/${r.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-surfaceHover transition"
            >
              <div>
                <div className="text-[14px] font-medium text-ink">{r.title}</div>
                <div className="text-[12.5px] text-muted mt-0.5">
                  {r.artists?.name} &middot; {formatDate(r.release_date)}
                  {r.distributor ? ` \u00b7 ${r.distributor}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-mono shrink-0 ml-3">
                <span className="text-artist">{100 - r.label_percent}%</span>
                <span className="text-line">/</span>
                <span className="text-label">{r.label_percent}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
