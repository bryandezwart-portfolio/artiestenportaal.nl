import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
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

    const velden = await request.json();

    const toegestaan = [
      "name",
      "tarief_bedrag",
      "genres",
      "omschrijving",
      "foto_url",
      "kaart_foto",
      "video_url",
      "website",
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

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
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

    const db = createAdminClient();

    const { data: act } = await db
      .from("bdzbookings_acts")
      .select("id")
      .eq("slug", params.slug)
      .single();

    if (!act) {
      return NextResponse.json({ error: "Act niet gevonden" }, { status: 404 });
    }

    const { count } = await db
      .from("bdzbookings_bookings")
      .select("id", { count: "exact", head: true })
      .eq("act_id", act.id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `Deze act heeft ${count} boeking(en) in het systeem. Archiveer hem in plaats van verwijderen, anders raak je die boekingen kwijt.`,
        },
        { status: 400 }
      );
    }

    const { error } = await db.from("bdzbookings_acts").delete().eq("id", act.id);

    if (error) {
      console.error("Verwijderen act mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings");
    revalidatePath("/bookings/contacten");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Onverwachte fout bij verwijderen act:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
