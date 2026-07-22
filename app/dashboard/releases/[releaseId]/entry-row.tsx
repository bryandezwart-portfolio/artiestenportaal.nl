"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatEUR, formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type IncomeEntry = {
  id: string;
  entry_date: string;
  platform: string;
  gross_amount: number;
  label_amount: number;
  artist_amount: number;
  label_percent: number;
  notes: string | null;
  attachment_path: string | null;
};

type AdjustmentEntry = {
  id: string;
  entry_date: string;
  type: "cost" | "advance";
  amount: number;
  description: string | null;
  attachment_path: string | null;
};

export default function EntryRow({
  kind,
  entry,
}: {
  kind: "income" | "adjustment";
  entry: IncomeEntry | AdjustmentEntry;
}) {
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const table = kind === "income" ? "income_entries" : "adjustments";
  const apiEndpoint = kind === "income" ? "/api/income" : "/api/adjustments";

  async function handleDelete() {
    if (!confirm("Deze boeking verwijderen?")) return;
    setDeleting(true);
    await fetch(`${apiEndpoint}?id=${entry.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");

    const path = `${entry.id}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("attachments").upload(path, file);

    if (uploadErr) {
      setUploading(false);
      setUploadError("Uploaden mislukt: " + uploadErr.message);
      return;
    }

    const { error: updateErr } = await supabase
      .from(table)
      .update({ attachment_path: path })
      .eq("id", entry.id);

    setUploading(false);
    if (updateErr) {
      setUploadError("Opslaan mislukt: " + updateErr.message);
      return;
    }
    router.refresh();
  }

  async function handleDownload() {
    if (!entry.attachment_path) return;
    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(entry.attachment_path, 60);
    if (error || !data) return;
    window.open(data.signedUrl, "_blank");
  }

  const AttachmentControl = (
    <>
      {entry.attachment_path ? (
        <button
          onClick={handleDownload}
          className="text-[11px] text-accent hover:underline shrink-0"
          title="Bijlage bekijken"
        >
          📎 Bijlage
        </button>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-[11px] text-muted hover:text-ink opacity-0 group-hover:opacity-100 transition shrink-0 disabled:opacity-50"
        >
          {uploading ? "…" : "+ Bijlage"}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </>
  );

  if (kind === "income") {
    const e = entry as IncomeEntry;
    return (
      <div className="group flex flex-col px-6 py-3.5 text-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 bg-accentSoft text-accent">
              {e.platform}
            </span>
            <span className="text-ink">{formatDate(e.entry_date)}</span>
            {e.notes && <span className="text-muted"> &middot; {e.notes}</span>}
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <span className="text-[11px] text-muted font-mono">{e.label_percent}% label</span>
            <span className="font-mono text-ink">{formatEUR(e.gross_amount)}</span>
            {AttachmentControl}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 text-danger text-[12px] transition disabled:opacity-50"
            >
              Verwijderen
            </button>
          </div>
        </div>
        {uploadError && <p className="text-danger text-[11px] mt-1">{uploadError}</p>}
      </div>
    );
  }

  const a = entry as AdjustmentEntry;
  return (
    <div className="group flex flex-col px-6 py-3.5 text-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <span
            className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full mr-2 ${
              a.type === "cost" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {a.type === "cost" ? "Kosten" : "Voorschot"}
          </span>
          <span className="text-ink">{formatDate(a.entry_date)}</span>
          {a.description && <span className="text-muted"> &middot; {a.description}</span>}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="font-mono text-ink">{formatEUR(a.amount)}</span>
          {AttachmentControl}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 text-danger text-[12px] transition disabled:opacity-50"
          >
            Verwijderen
          </button>
        </div>
      </div>
      {uploadError && <p className="text-danger text-[11px] mt-1">{uploadError}</p>}
    </div>
  );
}
