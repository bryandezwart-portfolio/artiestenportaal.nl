import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bdzbookings_acts")
    .select("slug, name, type, specialiteit, genres, tijdperken, publiek_min, publiek_max, omschrijving, kaart_foto, foto_url, fotos, video_url, website, socials")
    .eq("publiek_zichtbaar", true)
    .or("actief.is.null,actief.eq.true")
    .eq("volwassenen_only", false)
    .order("name");

  if (error) {
    return NextResponse.json({ error: "Ophalen mislukt" }, { status: 500, headers: CORS });
  }

  const acts = (data ?? []).map((a) => ({
    slug: a.slug,
    naam: a.name,
    type: a.type,
    specialiteit: a.specialiteit ?? null,
    genres: a.genres ?? [],
    tijdperken: a.tijdperken ?? [],
    publiek_van: a.publiek_min ?? null,
    publiek_tot: a.publiek_max ?? null,
    omschrijving: a.omschrijving ?? null,
    kaart_foto: a.kaart_foto ?? null,
    foto: a.foto_url ?? null,
    fotos: a.fotos ?? [],
    video: a.video_url ?? null,
    website: a.website ?? null,
    socials: a.socials ?? {},
  }));

  return NextResponse.json({ acts }, { headers: CORS });
}
