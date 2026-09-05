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

export async function PATCH(request: Request) {
  const geenToegang = await checkAdmin();
  if (geenToegang) {
    return NextResponse.json({ error: geenToegang.fout }, { status: geenToegang.status });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Id of status ontbreekt" }, { status: 400 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("bdzbookings_aanvragen")
      .update({ status, behandeld_op: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Bijwerken aanvraag mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings/aanvragen");
    return NextResponse.json({ aanvraag: data });
  } catch (e) {
    console.error("Onverwachte fout bij aanvraag:", e);
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
    if (!id) return NextResponse.json({ error: "Id ontbreekt" }, { status: 400 });

    const db = createAdminClient();
    const { error } = await db.from("bdzbookings_aanvragen").delete().eq("id", id);

    if (error) {
      console.error("Verwijderen aanvraag mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings/aanvragen");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Onverwachte fout bij verwijderen aanvraag:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
