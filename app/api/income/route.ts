import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase, user } = check;

  const body = await request.json();
  const { releaseId, entryDate, platform, grossAmount, labelPercent, notes } = body;

  if (!releaseId || grossAmount === undefined || labelPercent === undefined) {
    return NextResponse.json(
      { error: "Release, brutobedrag en label-percentage zijn verplicht." },
      { status: 400 }
    );
  }

  const gross = Number(grossAmount);
  const pct = Number(labelPercent);
  if (Number.isNaN(gross) || gross < 0) {
    return NextResponse.json({ error: "Ongeldig brutobedrag." }, { status: 400 });
  }
  if (Number.isNaN(pct) || pct < 0 || pct > 100) {
    return NextResponse.json({ error: "Label-percentage moet tussen 0 en 100 zijn." }, { status: 400 });
  }

  const { error } = await supabase.from("income_entries").insert({
    release_id: releaseId,
    entry_date: entryDate || new Date().toISOString().slice(0, 10),
    platform: platform || "Overig",
    gross_amount: gross,
    label_percent: pct,
    artist_percent: 100 - pct,
    notes: notes || null,
    created_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase } = check;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ontbreekt." }, { status: 400 });

  const { error } = await supabase.from("income_entries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
