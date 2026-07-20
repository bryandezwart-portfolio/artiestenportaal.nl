import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// LET OP: gebruik deze client alleen in server-side code (API routes, server components).
// De service_role key omzeilt Row Level Security volledig en mag NOOIT naar de browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
