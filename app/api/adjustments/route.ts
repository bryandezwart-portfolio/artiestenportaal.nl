import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { logActivity } from "@/lib/log-activity";

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase, user } = check;

  const body = await request.json();
  const { releaseId, type, entryDate, amount, description } = body;

  if (!releaseId || !type || amount === undefined) {
    return NextResponse.json({ error: "Release, type en bedrag zijn verplicht." }, { status: 400 });
  }
  if (type !== "cost" && type !== "advance") {
    return NextResponse.json({ error: "Type moet 'cost' of 'advance' zijn." }, { status: 400 });
  }

  const { error } = await supabase.from("adjustments").insert({
    release_id: releaseId,
    type,
    entry_date: entryDate || new Date().toISOString().slice(0, 10),
    amount: Number(amount),
    description: description || null,
    created_by: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity(
    supabase,
    user.email,
    type === "cost" ? "cost_added" : "advance_added",
    `${type === "cost" ? "Kosten" : "Voorschot"} geboekt: €${Number(amount).toFixed(2)}`
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase, user } = check;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ontbreekt." }, { status: 400 });

  const { error } = await supabase.from("adjustments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity(supabase, user.email, "adjustment_deleted", `Kosten/voorschot verwijderd`);

  return NextResponse.json({ success: true });
}
