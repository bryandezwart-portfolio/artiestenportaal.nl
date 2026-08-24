import NewBookingForm from "@/components/bookings/NewBookingForm";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bdzbookings_acts")
    .select("id, name, type, tarief_type, tarief_bedrag, standaard_commissie, tiers")
    .order("name");

  const acts = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type as "dj" | "artiest" | "band",
    tariefType: r.tarief_type as "vast" | "uur",
    tariefBedrag: Number(r.tarief_bedrag),
    standaardCommissie: Number(r.standaard_commissie),
    tiers: (r.tiers as any) ?? [],
  }));

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <NewBookingForm acts={acts} />
    </div>
  );
}
