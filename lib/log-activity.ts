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

  // Bewaartermijn: maximaal 90 dagen aan activiteiten. Alles ouder dan dat
  // wordt hier opgeruimd, best-effort, zodat de log niet onbeperkt groeit.
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    await supabase.from("activity_log").delete().lt("created_at", cutoff.toISOString());
  } catch {
    // stil negeren — opschonen mag nooit de echte actie blokkeren
  }
}
