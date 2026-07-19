"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SplitEditor({
  releaseId,
  initialSplit,
}: {
  releaseId: string;
  initialSplit: number;
}) {
  const [split, setSplit] = useState(initialSplit);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function save(value: number) {
    setSplit(value);
    setSaving(true);
    await supabase.from("releases").update({ artist_split: value }).eq("id", releaseId);
    setSaving(false);
  }

  return (
    <div className="bg-surface rounded-xl2 shadow-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted tracking-wide">VERDEELSLEUTEL</span>
        {saving && <span className="text-xs text-muted">opslaan…</span>}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => save(Number(e.target.value))}
        className="w-full accent-accent"
      />
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-artist font-medium">Artiest {split}%</span>
        <span className="text-label font-medium">Label {100 - split}%</span>
      </div>
    </div>
  );
}
