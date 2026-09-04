import ActZoeker from "@/components/bookings/ActZoeker";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ZoekenPage() {
  const supabase = createAdminClient();

  const { data: rijen } = await supabase
    .from("bdzbookings_acts")
    .select("genres, tijdperken");

  const genreSet = new Set<string>();
  const tijdperkSet = new Set<string>();

  (rijen ?? []).forEach((rij) => {
    (rij.genres ?? []).forEach((g: string) => g && genreSet.add(g));
    (rij.tijdperken ?? []).forEach((t: string) => t && tijdperkSet.add(t));
  });

  const VOLGORDE = ["50s", "60s", "70s", "80s", "90s", "00s", "10s", "20s"];

  return (
    <ActZoeker
      genres={[...genreSet].sort((a, b) => a.localeCompare(b, "nl"))}
      tijdperken={VOLGORDE.filter((t) => tijdperkSet.has(t))}
    />
  );
}
