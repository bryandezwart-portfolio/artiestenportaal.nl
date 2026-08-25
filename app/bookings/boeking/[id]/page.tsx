import { notFound } from "next/navigation";
import BookingBeheer from "@/components/bookings/BookingBeheer";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function BoekingPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bdzbookings_bookings")
    .select("*, bdzbookings_acts(name)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error("Boeking ophalen mislukt:", error?.message);
    notFound();
  }

  const boeking = {
    ...data,
    act_naam: (data as any).bdzbookings_acts?.name ?? "Onbekende act",
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <BookingBeheer boeking={boeking as any} />
    </div>
  );
}
