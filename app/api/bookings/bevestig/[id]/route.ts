import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const kloptNiet = body?.klopt_niet === true;

    const supabase = createAdminClient();

    const update = kloptNiet
      ? { gemeld_klopt_niet: true }
      : { bevestigd_door_act: true, bevestigd_op: new Date().toISOString() };

    const { data, error } = await supabase
      .from("bdzbookings_bookings")
      .update(update)
      .eq("id", params.id)
      .select("id, bevestigd_door_act, bevestigd_op, gemeld_klopt_niet")
      .single();

    if (error) {
      console.error("Bevestiging opslaan mislukt:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/bookings");
    revalidatePath(`/bevestig/${params.id}`);
    return NextResponse.json({ boeking: data });
  } catch (e) {
    console.error("Onverwachte fout bij bevestigen:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
