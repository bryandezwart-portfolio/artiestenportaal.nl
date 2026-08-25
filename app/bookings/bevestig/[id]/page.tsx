import { notFound } from "next/navigation";
import BookingConfirmation from "@/components/bookings/BookingConfirmation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function BevestigPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bdzbookings_bookings")
    .select("*, bdzbookings_acts(name)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error("Boeking ophalen mislukt:", error?.message);
    notFound();
  }

  const rij = data as any;
  const postenVoorAct = Array.isArray(rij.extra_posten)
    ? rij.extra_posten
        .filter((p: any) => p?.voor === "act")
        .reduce((som: number, p: any) => som + (Number(p.bedrag) || 0), 0)
    : 0;

  const boeking = {
    id: rij.id,
    act_naam: rij.bdzbookings_acts?.name ?? "Onbekende act",
    datum: rij.datum,
    eind_datum: rij.eind_datum ?? rij.datum,
    start_tijd: rij.start_tijd,
    eind_tijd: rij.eind_tijd,
    locatie: rij.locatie,
    speelschema: rij.speelschema ?? null,
    bezoekers: rij.bezoekers ?? null,
    posten_act: Array.isArray(rij.extra_posten)
      ? rij.extra_posten.filter((p: any) => p?.voor === "act")
      : [],
    gelegenheid: rij.gelegenheid ?? null,
    opmerkingen: rij.opmerkingen ?? null,
    soundcheck_notitie: rij.soundcheck_notitie ?? null,
    act_bedrag: Number(rij.basistarief) + Number(rij.toeslag) + postenVoorAct,
    bevestigd_door_act: rij.bevestigd_door_act ?? false,
    bevestigd_op: rij.bevestigd_op ?? null,
    gemeld_klopt_niet: rij.gemeld_klopt_niet ?? false,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <BookingConfirmation boeking={boeking} />
    </div>
  );
}
