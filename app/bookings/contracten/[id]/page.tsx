import { createAdminClient } from "@/lib/supabase/admin";
import ContractMaker from "@/components/bookings/ContractMaker";
import Link from "next/link";
import type { ActType } from "@/lib/bookings/contract-sjablonen";

export const dynamic = "force-dynamic";

const supabaseAdmin = createAdminClient();

export default async function ContractPagina({ params }: { params: { id: string } }) {
  const { data: boeking } = await supabaseAdmin
    .from("bdzbookings_bookings")
    .select("*, act:bdzbookings_acts(*)")
    .eq("id", params.id)
    .maybeSingle();

  if (!boeking) {
    return (
      <div className="p-8">
        <p className="text-neutral-600">Deze boeking bestaat niet (meer).</p>
        <Link href="/bookings" className="mt-3 inline-block underline">Terug naar het overzicht</Link>
      </div>
    );
  }

  // eerder ingevulde waarden ophalen, zodat je niet opnieuw hoeft te typen
  const { data: eerder } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .select("partij, waarden, status, token, pdf_pad, getekend_op")
    .eq("booking_id", params.id)
    .order("aangemaakt_op", { ascending: false });

  const act = (boeking as any).act;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/bookings" className="text-sm text-neutral-500 underline">← Terug naar het overzicht</Link>

      <h1 className="mt-3 text-2xl font-semibold text-neutral-900">Overeenkomsten</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {act?.name} · {(boeking as any).datum} · {(boeking as any).locatie ?? (boeking as any).locatie_naam ?? "locatie onbekend"}
      </p>

      <ContractMaker
        bookingId={params.id}
        actType={(act?.type ?? "dj") as ActType}
        actNaam={act?.name ?? ""}
        eerder={(eerder ?? []) as any}
      />
    </div>
  );
}
