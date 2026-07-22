import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase } = check;

  const body = await request.json();
  const { artistId, title, releaseDate, labelPercent, distributor, isrc, upc, iswc, notes } = body;

  if (!artistId || !title || labelPercent === undefined || labelPercent === null) {
    return NextResponse.json(
      { error: "Artiest, titel en label-percentage zijn verplicht." },
      { status: 400 }
    );
  }

  const pct = Number(labelPercent);
  if (Number.isNaN(pct) || pct < 0 || pct > 100) {
    return NextResponse.json({ error: "Label-percentage moet tussen 0 en 100 zijn." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("releases")
    .insert({
      artist_id: artistId,
      title,
      release_date: releaseDate || null,
      label_percent: pct,
      artist_split: 100 - pct, // legacy kolom, blijft gesynchroniseerd
      distributor: distributor || null,
      isrc: isrc || null,
      upc: upc || null,
      iswc: iswc || null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: data.id });
}

export async function PATCH(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase } = check;

  const body = await request.json();
  const { id, title, releaseDate, labelPercent, distributor, isrc, upc, iswc, notes } = body;

  if (!id) {
    return NextResponse.json({ error: "id ontbreekt." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (title !== undefined) update.title = title;
  if (releaseDate !== undefined) update.release_date = releaseDate || null;
  if (distributor !== undefined) update.distributor = distributor || null;
  if (isrc !== undefined) update.isrc = isrc || null;
  if (upc !== undefined) update.upc = upc || null;
  if (iswc !== undefined) update.iswc = iswc || null;
  if (notes !== undefined) update.notes = notes || null;
  if (labelPercent !== undefined) {
    const pct = Number(labelPercent);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      return NextResponse.json({ error: "Label-percentage moet tussen 0 en 100 zijn." }, { status: 400 });
    }
    update.label_percent = pct;
    update.artist_split = 100 - pct;
  }

  const { error } = await supabase.from("releases").update(update).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
