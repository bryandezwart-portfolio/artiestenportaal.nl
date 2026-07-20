"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DistributorEditor({
  releaseId,
  initialValue,
}: {
  releaseId: string;
  initialValue: string | null;
}) {
  const [value, setValue] = useState(initialValue ?? "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function save() {
    setSaving(true);
    await supabase.from("releases").update({ distributor: value || null }).eq("id", releaseId);
    setSaving(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-[12.5px] text-muted hover:text-ink transition"
      >
        {value ? (
          <>
            Distributeur: <span className="text-ink">{value}</span>
          </>
        ) : (
          "+ Distributeur toevoegen"
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="Naam distributeur"
        className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-[12.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
      />
      {saving && <span className="text-[11px] text-muted">opslaan…</span>}
    </div>
  );
}
