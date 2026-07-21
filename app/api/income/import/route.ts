import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

type ImportRow = {
  date?: string;
  platform?: string;
  title: string;
  artist?: string;
  grossAmount: number;
  labelPercent?: number;
  notes?: string;
};

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const { supabase, user } = check;

  const body = await request.json();
  const rows: ImportRow[] = body.rows;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Geen rijen om te importeren." }, { status: 400 });
  }

  const { data: releases } = await supabase
    .from("releases")
    .select("id, title, label_percent, artists(name)");

  const normalize = (s: string) => s.trim().toLowerCase();

  const toInsert: Record<string, unknown>[] = [];
  const unmatched: ImportRow[] = [];

  for (const row of rows) {
    if (!row.title || row.grossAmount === undefined || row.grossAmount === null) continue;

    const match = releases?.find((r: any) => {
      const titleMatch = normalize(r.title) === normalize(row.title);
      if (!titleMatch) return false;
      if (row.artist) {
        return normalize(r.artists?.name || "") === normalize(row.artist);
      }
      return true;
    });

    if (!match) {
      unmatched.push(row);
      continue;
    }

    const labelPct = row.labelPercent !== undefined && row.labelPercent !== null
      ? Number(row.labelPercent)
      : Number(match.label_percent);

    toInsert.push({
      release_id: match.id,
      entry_date: row.date || new Date().toISOString().slice(0, 10),
      platform: row.platform || "Overig",
      gross_amount: Number(row.grossAmount),
      label_percent: labelPct,
      artist_percent: 100 - labelPct,
      notes: row.notes || null,
      created_by: user.id,
    });
  }

  if (toInsert.length > 0) {
    const { error } = await supabase.from("income_entries").insert(toInsert);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({
    success: true,
    imported: toInsert.length,
    unmatched,
  });
}
