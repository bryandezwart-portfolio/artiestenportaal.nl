import ActZoeker from "@/components/bookings/ActZoeker";
import { createAdminClient } from "@/lib/supabase/admin";
import { GELEGENHEDEN, TIJDPERKEN } from "@/lib/bookings/keuzelijsten";

export const dynamic = "force-dynamic";

export default async function ZoekenPage() {
  const supabase = createAdminClient();

  const { data: rijen } = await supabase
    .from("bdzbookings_acts")
    .select("genres, tijdperken, gelegenheden");

  const genreSet = new Set<string>();
  const tijdperkSet = new Set<string>();
  const gelegenheidSet = new Set<string>();

  (rijen ?? []).forEach((rij) => {
    (rij.genres ?? []).forEach((g: string) => g && genreSet.add(g));
    (rij.tijdperken ?? []).forEach((t: string) => t && tijdperkSet.add(t));
    (rij.gelegenheden ?? []).forEach((g: string) => g && gelegenheidSet.add(g));
  });

  const eigen = [...gelegenheidSet]
    .filter((g) => !GELEGENHEDEN.includes(g))
    .sort((a, b) => a.localeCompare(b, "nl"));

  return (
    <ActZoeker
      genres={[...genreSet].sort((a, b) => a.localeCompare(b, "nl"))}
      tijdperken={TIJDPERKEN.filter((t) => tijdperkSet.has(t))}
      gelegenheden={[...GELEGENHEDEN, ...eigen]}
    />
  );
}
