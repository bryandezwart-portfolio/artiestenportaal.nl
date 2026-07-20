import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  // Alleen label-admins mogen artiesten uitnodigen.
  const { data: admin } = await supabase
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const { name, email } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  let userId: string | null = null;

  if (email) {
    const origin = new URL(request.url).origin;
    const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { redirectTo: `${origin}/artist` }
    );

    if (invited?.user) {
      userId = invited.user.id;
    } else if (inviteError) {
      // Account bestaat mogelijk al (bv. eerder handmatig aangemaakt) — zoek het op.
      const { data: list } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const existing = list?.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        userId = existing.id;
      } else {
        return NextResponse.json({ error: inviteError.message }, { status: 400 });
      }
    }
  }

  const { error: insertError } = await adminClient.from("artists").insert({
    name,
    user_id: userId,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
