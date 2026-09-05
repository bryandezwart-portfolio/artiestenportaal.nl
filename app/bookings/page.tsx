import BDZBookingsDashboard from "@/components/bookings/BDZBookingsDashboard";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function formatTarief(bedrag: number, type: string) {
  const bedragTekst = `€ ${Math.round(bedrag)}`;
  return type === "uur" ? `${bedragTekst} p/u` : bedragTekst;
}

export default async function BookingsPage() {
  const supabase = createAdminClient();

  const { data: actRijen, error } = await supabase
    .from("bdzbookings_acts")
    .select("id, slug, name, type, genres, specialiteit, actief, tarief_type, tarief_bedrag, contact_naam, contact_rol, contact_email, contact_telefoon")
    .order("name");

  if (error || !actRijen) {
    console.error("Ophalen acts mislukt:", error?.message);
    return <BDZBookingsDashboard />;
  }

  const uuidNaarNummer = new Map<string, number>();
  const acts = actRijen.map((rij, index) => {
    uuidNaarNummer.set(rij.id, index + 1);
    return {
      id: index + 1,
      slug: rij.slug,
      name: rij.name,
      type: rij.type as "dj" | "artiest" | "band" | "act" | "overig",
      genres: rij.genres ?? [],
      specialiteit: rij.specialiteit ?? null,
      actief: rij.actief ?? true,
      tarief: formatTarief(Number(rij.tarief_bedrag), rij.tarief_type),
      contact: {
        naam: rij.contact_naam ?? "",
        rol: rij.contact_rol ?? "",
        email: rij.contact_email ?? "",
        telefoon: rij.contact_telefoon ?? "",
      },
    };
  });

  const { data: boekingRijen } = await supabase
    .from("bdzbookings_bookings")
    .select("id, act_id, datum, start_tijd, eind_tijd, locatie, status, bevestigd_door_act, gage")
    .order("datum");

  const events = (boekingRijen ?? [])
    .filter((b) => uuidNaarNummer.has(b.act_id))
    .map((b, index) => ({
      id: index + 1,
      boekingId: b.id,
      status: b.status,
      bevestigd: b.bevestigd_door_act ?? false,
      actId: uuidNaarNummer.get(b.act_id)!,
      dag: b.datum,
      start: String(b.start_tijd).slice(0, 5),
      eind: String(b.eind_tijd).slice(0, 5),
      locatie: b.locatie,
      gage: b.gage === null ? null : Number(b.gage),
      actNaam: actRijen.find((a) => a.id === b.act_id)?.name ?? "",
      actEmail: actRijen.find((a) => a.id === b.act_id)?.contact_email ?? "",
    }));

  return <BDZBookingsDashboard acts={acts} events={events} />;
}
