import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const TOEGESTAAN = [
  "datum",
  "eind_datum",
  "start_tijd",
  "eind_tijd",
  "locatie",
  "bezoekers",
  "basistarief",
  "toeslag",
  "commissie",
  "gage",
  "status",
  "soundcheck_notitie",
  "extra_posten",
  "speelschema",
  "gelegenheid",
  "opmerkingen",
];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const velden = await request.json();

    const update: Record<string, unknown> = {};
    for (const veld of TOEGESTAAN) {
      if (veld in velden) update[veld] = velden[veld];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Niets om op te slaan" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("bdzbookings_bookings")
      .update(update)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Boeking bijwerken mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/bookings");
    revalidatePath(`/bookings/boeking/${params.id}`);
    return NextResponse.json({ boeking: data });
  } catch (e) {
    console.error("Onverwachte fout bij bijwerken:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
