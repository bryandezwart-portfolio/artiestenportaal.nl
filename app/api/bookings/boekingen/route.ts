import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const b = await request.json();

    const verplicht = ["act_id", "datum", "start_tijd", "eind_tijd", "locatie"];
    for (const veld of verplicht) {
      if (!b[veld]) {
        return NextResponse.json({ error: `Veld ontbreekt: ${veld}` }, { status: 400 });
      }
    }

    const nieuweBoeking = {
      act_id: b.act_id,
      datum: b.datum,
      eind_datum: b.eind_datum || b.datum,
      start_tijd: b.start_tijd,
      eind_tijd: b.eind_tijd,
      locatie: b.locatie,
      speelschema: b.speelschema ?? null,
      gelegenheid: b.gelegenheid ?? "openbaar",
      opmerkingen: b.opmerkingen ?? null,
      extra_posten: b.extra_posten ?? [],
      bezoekers: b.bezoekers ?? null,
      basistarief: Number(b.basistarief) || 0,
      toeslag: Number(b.toeslag) || 0,
      commissie: Number(b.commissie) || 0,
      gage: Number(b.gage) || 0,
      status: b.status || "telefonisch bevestigd",
    };

    const supabase = createAdminClient();

    // Exacte duplicaten weigeren: zelfde act, datum en tijden is altijd een vergissing.
    // Deze controle kijkt in de database, niet in de gegevens die het formulier bij het
    // laden meekreeg - anders glipt een net aangemaakte boeking er alsnog doorheen.
    const { data: bestaande } = await supabase
      .from("bdzbookings_bookings")
      .select("id")
      .eq("act_id", nieuweBoeking.act_id)
      .eq("datum", nieuweBoeking.datum)
      .eq("start_tijd", String(nieuweBoeking.start_tijd).slice(0, 5) + ":00")
      .eq("eind_tijd", String(nieuweBoeking.eind_tijd).slice(0, 5) + ":00")
      .neq("status", "geannuleerd")
      .limit(1);

    if (bestaande && bestaande.length > 0) {
      return NextResponse.json(
        { error: "Deze act staat al ingepland op deze datum en tijd." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("bdzbookings_bookings")
      .insert(nieuweBoeking)
      .select()
      .single();

    if (error) {
      console.error("Boeking opslaan mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/bookings");
    return NextResponse.json({ boeking: data });
  } catch (e) {
    console.error("Onverwachte fout bij boeking opslaan:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
