import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const { lead_id, tekst } = await request.json();

    if (!lead_id || !tekst?.trim()) {
      return NextResponse.json({ error: "Notitie is leeg" }, { status: 400 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("bdzbookings_lead_notities")
      .insert({ lead_id, tekst: tekst.trim() })
      .select()
      .single();

    if (error) {
      console.error("Opslaan notitie mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/bookings/contacten");
    return NextResponse.json({ notitie: data });
  } catch (e) {
    console.error("Onverwachte fout bij opslaan notitie:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
