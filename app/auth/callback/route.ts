import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Deze route vangt links op vanuit e-mails (uitnodiging, magic link).
// Supabase stuurt de gebruiker hierheen met een ?code=..., die we omruilen
// voor een echte sessie. Zonder deze route werkt geen enkele e-maillink.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type"); // bv. "invite", "recovery", "magiclink"

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Bij een uitnodiging of wachtwoord-herstel: laat de gebruiker eerst een
  // eigen wachtwoord instellen voor toekomstige logins.
  if (type === "invite" || type === "recovery") {
    return NextResponse.redirect(`${origin}/auth/reset`);
  }

  return NextResponse.redirect(`${origin}/`);
}
