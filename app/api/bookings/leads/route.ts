import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin() {
  const auth = createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) return { fout: "Niet ingelogd", status: 401 };

  const { data: admin } = await auth
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return { fout: "Geen toegang", status: 403 };
  return null;
}

export async function POST(request: Request) {
  const geenToegang = await checkAdmin();
  if (geenToegang) {
    return NextResponse.json({ error: geenToegang.fout }, { status: geenToegang.status });
  }

  try {
    const velden = await request.json();

    if (!velden?.act_naam) {
      return NextResponse.json({ error: "Naam ontbreekt" }, { status: 400 });
    }

    const toegestaan = [
      "act_naam",
      "type",
      "specialiteit",
      "status",
      "contact_naam",
      "contact_rol",
      "contact_email",
      "contact_telefoon",
      "richtprijs",
      "vervolgdatum",
    ];

    const nieuw: Record<string, unknown> = {};
    for (const veld of toegestaan) {
      if (veld in velden) nieuw[veld] = velden[veld];
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("bdzbookings_leads")
      .insert(nieuw)
      .select()
      .single();

    if (error) {
      console.error("Aanmaken lead mislukt:", error.message);
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
    }

    revalidatePath("/bookings/contacten");
    return NextResponse.json({ lead: data });
  } catch (e) {
    console.error("Onverwachte fout bij aanmaken lead:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const geenToegang = await checkAdmin();
  if (geenToegang) {
    return NextResponse.json({ error: geenToegang.fout }, { status: geenToegang.status });
  }

  try {
    const { id, ...velden } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Id ontbreekt" }, { status: 400 });
    }

    const toegestaan = [
      "act_naam",
      "type",
      "specialiteit",
      "status",
      "contact_naam",
      "contact_rol",
      "contact_email",
      "contact_telefoon",
      "richtprijs",
      "vervolgdatum",
      "act_id",
    ];

    const update: Record<string, unknown> = {};
    for (const veld of toegestaan) {
      if (veld in velden) update[veld] = velden[veld];
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("bdzbookings_leads")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Bijwerken lead mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings/contacten");
    return NextResponse.json({ lead: data });
  } catch (e) {
    console.error("Onverwachte fout bij bijwerken lead:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const geenToegang = await checkAdmin();
  if (geenToegang) {
    return NextResponse.json({ error: geenToegang.fout }, { status: geenToegang.status });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Id ontbreekt" }, { status: 400 });
    }

    const db = createAdminClient();
    const { error } = await db.from("bdzbookings_leads").delete().eq("id", id);

    if (error) {
      console.error("Verwijderen lead mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings/contacten");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Onverwachte fout bij verwijderen lead:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
