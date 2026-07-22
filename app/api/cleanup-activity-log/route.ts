import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: admin } = await supabase
      .from("label_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!admin) {
      return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const { data: deleted, error } = await adminClient
      .from("activity_log")
      .delete()
      .lt("created_at", cutoff.toISOString())
      .select("id");

    if (error) {
      console.error("cleanup-activity-log: verwijderen faalde:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedCount: deleted?.length ?? 0 });
  } catch (err) {
    console.error("cleanup-activity-log: onverwachte fout:", err);
    const message = err instanceof Error ? err.message : "Onverwachte serverfout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
