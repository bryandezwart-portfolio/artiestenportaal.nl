"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SplitEditor({
  releaseId,
  initialLabelPercent,
}: {
  releaseId: string;
  initialLabelPercent: number;
}) {
  const [labelPercent, setLabelPercent] = useState(initialLabelPercent);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save(value: number) {
    setLabelPercent(value);
    setSaving(true);
    await fetch("/api/releases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: releaseId, labelPercent: value }),
    });
    setSaving(false);
    router.refresh();
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
        value={labelPercent}
        onChange={(e) => save(Number(e.target.value))}
        className="w-full accent-accent"
      />
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-artist font-medium">Artiest {100 - labelPercent}%</span>
        <span className="text-label font-medium">Label {labelPercent}%</span>
      </div>
      <p className="text-[11.5px] text-muted mt-2 leading-relaxed">
        Dit is de standaardverdeling voor nieuwe boekingen. Al geboekte inkomsten
        veranderen niet mee — die houden de verdeling van het moment van boeken.
      </p>
    </div>
  );
}
