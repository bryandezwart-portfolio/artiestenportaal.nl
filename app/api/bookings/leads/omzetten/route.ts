import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function maakSlug(naam: string): string {
  return naam
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const auth = createClient();
    const {
      data: { user },
    } = await auth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { data: admin } = await auth
      .from("label_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Id ontbreekt" }, { status: 400 });
    }

    const db = createAdminClient();

    const { data: lead, error: leadFout } = await db
      .from("bdzbookings_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (leadFout || !lead) {
      return NextResponse.json({ error: "Contact niet gevonden" }, { status: 404 });
    }

    if (lead.act_id) {
      return NextResponse.json({ error: "Dit contact is al omgezet" }, { status: 400 });
    }

    const { data: act, error: actFout } = await db
      .from("bdzbookings_acts")
      .insert({
        slug: maakSlug(lead.act_naam),
        name: lead.act_naam,
        type: lead.type,
        specialiteit: lead.specialiteit,
        genres: [],
        tijdperken: [],
        publiek_min: 0,
        publiek_max: 100000,
        tarief_type: "vast",
        tarief_bedrag: lead.richtprijs ?? 0,
        standaard_commissie: 0,
        tiers: [],
        contact_naam: lead.contact_naam,
        contact_rol: lead.contact_rol,
        contact_email: lead.contact_email,
        contact_telefoon: lead.contact_telefoon,
      })
      .select()
      .single();

    if (actFout) {
      console.error("Omzetten naar act mislukt:", actFout.message);
      return NextResponse.json(
        {
          error:
            actFout.code === "23505"
              ? "Er bestaat al een act met deze naam."
              : actFout.message,
        },
        { status: 400 }
      );
    }

    await db.from("bdzbookings_leads").update({ act_id: act.id, status: "binnen" }).eq("id", id);

    revalidatePath("/bookings/contacten");
    revalidatePath("/bookings");
    return NextResponse.json({ act });
  } catch (e) {
    console.error("Onverwachte fout bij omzetten:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
