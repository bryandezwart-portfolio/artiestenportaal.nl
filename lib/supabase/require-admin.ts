import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AdminCheckOk = {
  ok: true;
  user: User;
  supabase: SupabaseClient;
};

type AdminCheckFail = {
  ok: false;
  error: string;
  status: number;
};

export type AdminCheck = AdminCheckOk | AdminCheckFail;

// Haalt de ingelogde gebruiker op en checkt of die label-admin is.
export async function requireAdmin(): Promise<AdminCheck> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Niet ingelogd.", status: 401 };
  }

  const { data: admin } = await supabase
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return { ok: false, error: "Geen toegang.", status: 403 };
  }

  return { ok: true, user, supabase };
}
