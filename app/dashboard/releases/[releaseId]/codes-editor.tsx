"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CodesEditor({
  releaseId,
  initialIsrc,
  initialUpc,
  initialIswc,
}: {
  releaseId: string;
  initialIsrc: string | null;
  initialUpc: string | null;
  initialIswc: string | null;
}) {
  const [isrc, setIsrc] = useState(initialIsrc ?? "");
  const [upc, setUpc] = useState(initialUpc ?? "");
  const [iswc, setIswc] = useState(initialIswc ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    await fetch("/api/releases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: releaseId, isrc, upc, iswc }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-surface rounded-xl2 shadow-card p-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted tracking-wide">CODES</span>
        {saving && <span className="text-xs text-muted">opslaan…</span>}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">ISRC</label>
          <input
            value={isrc}
            onChange={(e) => setIsrc(e.target.value)}
            onBlur={save}
            placeholder="bv. NLB123456789"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">UPC/EAN</label>
          <input
            value={upc}
            onChange={(e) => setUpc(e.target.value)}
            onBlur={save}
            placeholder="bv. 0123456789012"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="text-[11.5px] font-medium text-muted mb-1.5 block">ISWC</label>
          <input
            value={iswc}
            onChange={(e) => setIswc(e.target.value)}
            onBlur={save}
            placeholder="bv. T-123456789-0"
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          />
        </div>
      </div>
    </div>
  );
}
