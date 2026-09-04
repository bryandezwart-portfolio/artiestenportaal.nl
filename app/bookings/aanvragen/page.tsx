import AanvragenLijst from "@/components/bookings/AanvragenLijst";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AanvragenPage() {
  const supabase = createAdminClient();

  const { data: aanvragen, error } = await supabase
    .from("bdzbookings_aanvragen")
    .select("*, bdzbookings_acts(slug, name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ophalen aanvragen mislukt:", error.message);
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <AanvragenLijst aanvragen={aanvragen ?? []} />
    </div>
  );
}
