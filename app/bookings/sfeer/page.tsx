import { createClient } from "@/lib/supabase/server";
import SfeerBeheer from "@/components/bookings/SfeerBeheer";

export const dynamic = "force-dynamic";

export default async function SfeerPagina() {
  const supabase = createClient();
  const { data } = await supabase
    .from("bdzbookings_sfeer")
    .select("id, foto_url, bijschrift, volgorde, actief, plek")
    .order("volgorde");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-[22px] font-semibold text-neutral-900">Sfeerfoto&apos;s</h1>
      <p className="mb-8 mt-1 text-[14px] text-neutral-500">
        Deze foto&apos;s staan op bdzbookings.nl, in de grote balk bovenaan de homepage en op de actspagina.
      </p>
      <SfeerBeheer start={data ?? []} />
    </main>
  );
}
