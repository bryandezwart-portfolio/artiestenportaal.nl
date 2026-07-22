import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import CleanupButton from "./cleanup-button";

export default async function ActivityPage() {
  const supabase = createClient();
  const { data: entries } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <main className="animate-blur-in px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-7 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Activiteit</h1>
            <p className="text-muted text-[13px] mt-0.5">
              Overzicht van wie wat heeft gewijzigd &middot; wordt automatisch na 90 dagen opgeschoond
            </p>
          </div>
          <CleanupButton />
        </header>
        <div className="bg-surface rounded-xl2 shadow-card divide-y divide-line overflow-hidden">
          {(!entries || entries.length === 0) && (
            <p className="text-muted text-[13px] p-8 text-center">Nog geen activiteit gelogd.</p>
          )}
          {entries?.map((e) => (
            <div key={e.id} className="px-6 py-3.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-ink">{e.description}</span>
                <span className="text-muted text-[12px] shrink-0 ml-3">
                  {formatDate(e.created_at)}
                </span>
              </div>
              <div className="text-[11.5px] text-muted mt-0.5">
                {e.actor_email ?? "onbekend"} &middot; {e.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
