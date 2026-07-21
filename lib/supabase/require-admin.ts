import { createClient } from "@/lib/supabase/server";

// Haalt de ingelogde gebruiker op en checkt of die label-admin is.
// Geeft { error: NextResponse } terug als het niet mag, anders { user }.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "Niet ingelogd.", status: 401 } } as const;
  }

  const { data: admin } = await supabase
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return { error: { message: "Geen toegang.", status: 403 } } as const;
  }

  return { user, supabase } as const;
}
