import { RapportageWeergave } from "@/components/bookings/RapportageWeergave";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function RapportagePage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("bdzbookings_bookings")
    .select("id, datum, locatie, gage, commissie, status, bdzbookings_acts(name)")
    .neq("status", "geannuleerd")
    .order("datum");

  const boekingen = (data ?? []).map((r: any, i: number) => ({
    id: i + 1,
    actNaam: r.bdzbookings_acts?.name ?? "Onbekende act",
    datum: r.datum,
    locatie: r.locatie,
    gage: Number(r.gage),
    commissie: Number(r.commissie),
  }));

  return <RapportageWeergave boekingen={boekingen} />;
}
