import NewBookingForm from "@/components/bookings/NewBookingForm";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const supabase = createAdminClient();

  const { data: actRijen } = await supabase
    .from("bdzbookings_acts")
    .select("id, slug, name, type, tarief_type, tarief_bedrag, standaard_commissie, tiers")
    .order("name");

  const acts = (actRijen ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type as "dj" | "artiest" | "band",
    tariefType: r.tarief_type as "vast" | "uur",
    tariefBedrag: Number(r.tarief_bedrag),
    standaardCommissie: Number(r.standaard_commissie),
    tiers: (r.tiers as any) ?? [],
  }));

  const { data: boekingRijen } = await supabase
    .from("bdzbookings_bookings")
    .select("id, act_id, datum, start_tijd, eind_tijd, locatie")
    .order("datum");

  const bestaandeBoekingen = (boekingRijen ?? []).map((b) => ({
    id: b.id as any,
    actId: b.act_id as any,
    date: b.datum,
    start: String(b.start_tijd).slice(0, 5),
    end: String(b.eind_tijd).slice(0, 5),
    locatie: b.locatie,
  }));

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <NewBookingForm acts={acts} bestaandeBoekingen={bestaandeBoekingen} />
    </div>
  );
}
