import type { SupabaseClient } from "@supabase/supabase-js";

// Best-effort logging: als het loggen zelf faalt, laten we de eigenlijke
// actie (die al gelukt is) niet alsnog mislukken — vandaar geen throw.
export async function logActivity(
  supabase: SupabaseClient,
  actorEmail: string | null | undefined,
  action: string,
  description: string
) {
  try {
    await supabase.from("activity_log").insert({
      actor_email: actorEmail ?? null,
      action,
      description,
    });
  } catch {
    // stil negeren — logging mag nooit de echte actie blokkeren
  }
}
