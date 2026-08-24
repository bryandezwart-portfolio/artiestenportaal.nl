import { notFound } from "next/navigation";
import ActDetail from "@/components/bookings/ActDetail";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SLUG = "the-riverbeats";

export default async function TheRiverbeatsPage() {
  const supabase = createAdminClient();

  const { data: act, error } = await supabase
    .from("bdzbookings_acts")
    .select("*")
    .eq("slug", SLUG)
    .single();

  if (error || !act) {
    console.error("Act ophalen mislukt:", error?.message);
    notFound();
  }

  const { data: bookingen } = await supabase
    .from("bdzbookings_bookings")
    .select("*")
    .eq("act_id", act.id)
    .order("datum");

  const { data: onbeschikbaarheid } = await supabase
    .from("bdzbookings_onbeschikbaarheid")
    .select("*")
    .eq("act_id", act.id)
    .order("van");

  return (
    <ActDetail
      act={act}
      bookingen={bookingen ?? []}
      onbeschikbaarheid={onbeschikbaarheid ?? []}
    />
  );
}
