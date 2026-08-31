import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const velden = await request.json();

    const toegestaan = [
      "name",
      "tarief_bedrag",
      "genres",
      "actief",
      "tijdperken",
      "specialiteit",
      "publiek_min",
      "publiek_max",
      "contact_naam",
      "contact_rol",
      "contact_email",
      "contact_telefoon",
      "aantal_personen",
      "bezetting",
    ];

    const update: Record<string, unknown> = {};
    for (const veld of toegestaan) {
      if (veld in velden) update[veld] = velden[veld];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Niets om op te slaan" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("bdzbookings_acts")
      .update(update)
      .eq("slug", params.slug)
      .select()
      .single();

    if (error) {
      console.error("Opslaan act mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath(`/bookings/acts/${params.slug}`);
    revalidatePath("/bookings");
    return NextResponse.json({ act: data });
  } catch (e) {
    console.error("Onverwachte fout bij opslaan:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
