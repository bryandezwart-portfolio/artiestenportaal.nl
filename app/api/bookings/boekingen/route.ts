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
      bezoekers: b.bezoekers ?? null,
      basistarief: Number(b.basistarief) || 0,
      toeslag: Number(b.toeslag) || 0,
      commissie: Number(b.commissie) || 0,
      gage: Number(b.gage) || 0,
      status: b.status || "telefonisch bevestigd",
    };

    const supabase = createAdminClient();
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
