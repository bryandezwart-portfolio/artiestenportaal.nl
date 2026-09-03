import ContactenLijst from "@/components/bookings/ContactenLijst";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ContactenPage() {
  const supabase = createAdminClient();

  const { data: leads, error } = await supabase
    .from("bdzbookings_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: notities } = await supabase
    .from("bdzbookings_lead_notities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ophalen contacten mislukt:", error.message);
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <ContactenLijst leads={leads ?? []} notities={notities ?? []} />
    </div>
  );
}
