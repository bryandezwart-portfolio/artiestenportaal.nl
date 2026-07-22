"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CleanupButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleCleanup() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/cleanup-activity-log", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || "Opschonen mislukt.");
      return;
    }
    setMessage(
      data.deletedCount > 0
        ? `${data.deletedCount} oude regel${data.deletedCount === 1 ? "" : "s"} verwijderd.`
        : "Niets ouder dan 90 dagen om te verwijderen."
    );
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleCleanup}
        disabled={loading}
        className="text-[13px] font-medium bg-surface border border-line px-3.5 py-2 rounded-lg hover:bg-surfaceHover transition disabled:opacity-50 shrink-0"
      >
        {loading ? "Bezig…" : "Ouder dan 90 dagen opschonen"}
      </button>
      {message && <p className="text-[11.5px] text-muted">{message}</p>}
    </div>
  );
}
