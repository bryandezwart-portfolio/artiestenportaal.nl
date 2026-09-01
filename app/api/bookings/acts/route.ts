import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { data: admin } = await supabase
      .from("label_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const velden = await request.json();

    if (!velden?.name || !velden?.slug) {
      return NextResponse.json({ error: "Naam ontbreekt" }, { status: 400 });
    }

    const toegestaan = [
      "slug",
      "name",
      "type",
      "specialiteit",
      "genres",
      "tijdperken",
      "publiek_min",
      "publiek_max",
      "tarief_type",
      "tarief_bedrag",
      "standaard_commissie",
      "tiers",
      "artiestklasse",
      "setmaat",
      "speelschema",
      "aantal_personen",
      "boeking_type",
      "bureau_naam",
      "bureau_contact",
      "bureau_email",
      "bureau_telefoon",
      "inkoop_bedrag",
      "volwassenen_only",
      "publiek_zichtbaar",
      "seizoen_maanden",
      "contact_naam",
      "contact_rol",
      "contact_email",
      "contact_telefoon",
    ];

    const nieuw: Record<string, unknown> = {};
    for (const veld of toegestaan) {
      if (veld in velden) nieuw[veld] = velden[veld];
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("bdzbookings_acts")
      .insert(nieuw)
      .select()
      .single();

    if (error) {
      console.error("Aanmaken act mislukt:", error.message);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    revalidatePath("/bookings");
    revalidatePath("/bookings/zoeken");
    return NextResponse.json({ act: data });
  } catch (e) {
    console.error("Onverwachte fout bij aanmaken act:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
