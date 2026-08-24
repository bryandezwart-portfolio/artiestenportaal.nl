import BDZBookingsDashboard from "@/components/bookings/BDZBookingsDashboard";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function formatTarief(bedrag: number, type: string) {
  const bedragTekst = `€ ${Math.round(bedrag)}`;
  return type === "uur" ? `${bedragTekst} p/u` : bedragTekst;
}

export default async function BookingsPage() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bdzbookings_acts")
    .select("id, slug, name, type, genres, tarief_type, tarief_bedrag, contact_naam, contact_rol, contact_email, contact_telefoon")
    .order("name");

  if (error || !data) {
    console.error("Ophalen acts mislukt:", error?.message);
    return <BDZBookingsDashboard />;
  }

  const acts = data.map((rij, index) => ({
    id: index + 1,
    dbId: rij.id,
    slug: rij.slug,
    name: rij.name,
    type: rij.type as "dj" | "artiest" | "band",
    genres: rij.genres ?? [],
    tarief: formatTarief(Number(rij.tarief_bedrag), rij.tarief_type),
    contact: {
      naam: rij.contact_naam ?? "",
      rol: rij.contact_rol ?? "",
      email: rij.contact_email ?? "",
      telefoon: rij.contact_telefoon ?? "",
    },
  }));

  return <BDZBookingsDashboard acts={acts} />;
}
