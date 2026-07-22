import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site-url";

export async function POST(request: Request) {
  try {
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

    const { name, email, artistCode } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    let userId: string | null = null;

    if (email) {
      const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
        email,
        { redirectTo: `${SITE_URL}/auth/callback` }
      );

      if (invited?.user) {
        userId = invited.user.id;
      } else if (inviteError) {
        console.error("create-artist: inviteUserByEmail faalde:", inviteError);
        const { data: list } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
        const existing = list?.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );
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
          return NextResponse.json(
            { error: inviteError.message || "Uitnodigen mislukt (onbekende fout)." },
            { status: 400 }
          );
        }
      }
    }

    const { data: newArtist, error: insertError } = await adminClient
      .from("artists")
      .insert({ name, artist_code: artistCode || null })
      .select("id")
      .single();

    if (insertError) {
      console.error("create-artist: insert in artists faalde:", insertError);
      const message = insertError.code === "23505"
        ? "Deze artiestcode is al in gebruik door een andere artiest."
        : insertError.message || "Opslaan mislukt (onbekende fout).";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (userId) {
      await adminClient
        .from("artist_users")
        .insert({ artist_id: newArtist.id, user_id: userId });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("create-artist: onverwachte fout:", err);
    const message = err instanceof Error ? err.message : "Onverwachte serverfout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
