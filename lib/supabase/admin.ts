import { createClient } from "@supabase/supabase-js";

// LET OP: alleen gebruiken in server-only code (API routes), nooit in de browser.
// Vereist de SERVICE ROLE key (Supabase → Project Settings → API → service_role).
// Deze omzeilt Row Level Security volledig — vandaar de env-variabele zonder
// NEXT_PUBLIC_-prefix, zodat hij nooit naar de client wordt meegestuurd.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (of NEXT_PUBLIC_SUPABASE_URL) ontbreekt in de environment variables."
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
