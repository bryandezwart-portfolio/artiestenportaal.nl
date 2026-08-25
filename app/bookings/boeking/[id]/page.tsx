import { notFound } from "next/navigation";
import BookingBeheer from "@/components/bookings/BookingBeheer";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function BoekingPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bdzbookings_bookings")
    .select("*, bdzbookings_acts(name, tarief_type, tarief_bedrag, standaard_commissie)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error("Boeking ophalen mislukt:", error?.message);
    notFound();
  }

  const boeking = {
    ...data,
    act_naam: (data as any).bdzbookings_acts?.name ?? "Onbekende act",
    act_tarief_type: (data as any).bdzbookings_acts?.tarief_type ?? "vast",
    act_tarief_bedrag: Number((data as any).bdzbookings_acts?.tarief_bedrag ?? 0),
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <BookingBeheer boeking={boeking as any} />
    </div>
  );
}
