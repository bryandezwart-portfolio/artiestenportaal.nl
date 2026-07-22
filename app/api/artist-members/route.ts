import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/log-activity";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json({ error: "artistId ontbreekt." }, { status: 400 });
  }

  const { data: links } = await supabase
    .from("artist_users")
    .select("user_id")
    .eq("artist_id", artistId);

  if (!links || links.length === 0) {
    return NextResponse.json({ members: [] });
  }

  const adminClient = createAdminClient();
  const { data: list } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  const ids = new Set(links.map((l) => l.user_id));
  const members = (list?.users ?? [])
    .filter((u) => ids.has(u.id))
    .map((u) => ({ id: u.id, email: u.email }));

  return NextResponse.json({ members });
}

export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const userId = searchParams.get("userId");

  if (!artistId || !userId) {
    return NextResponse.json({ error: "artistId en userId zijn verplicht." }, { status: 400 });
  }

  // Ontkoppelt alleen de login van deze artiest — het onderliggende
  // Supabase-account zelf blijft bestaan (kan eventueel los verwijderd
  // worden via Authentication → Users als dat ook echt de bedoeling is).
  const { error } = await supabase
    .from("artist_users")
    .delete()
    .eq("artist_id", artistId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logActivity(supabase, user.email, "login_unlinked", `Login losgekoppeld van artiest`);

  return NextResponse.json({ success: true });
}
