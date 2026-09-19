import { notFound } from "next/navigation";
import ActDetail from "@/components/bookings/ActDetail";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ActPage({ params }: { params: { slug: string } }) {
  const SLUG = params.slug;
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

  // de lopende samenwerkingsovereenkomst van deze act, als die er is
  const { data: samenwerking } = await supabase
    .from("bdzbookings_contracten")
    .select("id, status, token, ingangsdatum, getekend_op")
    .eq("act_id", act.id)
    .eq("soort", "samenwerking")
    .neq("status", "vervallen")
    .order("aangemaakt_op", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <ActDetail
      act={act}
      bookingen={bookingen ?? []}
      onbeschikbaarheid={onbeschikbaarheid ?? []}
      samenwerking={samenwerking ?? null}
    />
  );
}
