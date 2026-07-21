import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site-url";

export async function POST(request: Request) {
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

  const { artistId, email } = await request.json();

  if (!artistId || !email) {
    return NextResponse.json({ error: "Artiest en e-mailadres zijn verplicht." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  let userId: string | null = null;

  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: `${SITE_URL}/auth/callback` }
  );

  if (invited?.user) {
    userId = invited.user.id;
  } else if (inviteError) {
    const { data: list } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      userId = existing.id;
      const publicClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await publicClient.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
      });
    } else {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Kon geen account koppelen." }, { status: 400 });
  }

  const { error: linkError } = await adminClient
    .from("artist_users")
    .upsert({ artist_id: artistId, user_id: userId }, { onConflict: "artist_id,user_id" });

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
