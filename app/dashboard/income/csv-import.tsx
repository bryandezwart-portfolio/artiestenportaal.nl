"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { csvToIncomeRows } from "@/lib/csv";

type Result = { imported: number; unmatched: any[] } | null;

export default function CsvImport() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof csvToIncomeRows>["rows"]>([]);
  const [headerFound, setHeaderFound] = useState<boolean | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleTextChange(value: string) {
    setText(value);
    setResult(null);
    setError("");
    if (!value.trim()) {
      setPreview([]);
      setHeaderFound(null);
      return;
    }
    const { rows, headerFound } = csvToIncomeRows(value);
    setPreview(rows);
    setHeaderFound(headerFound);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleTextChange(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    setError("");
    const res = await fetch("/api/income/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: preview }),
    });
    const data = await res.json();
    setImporting(false);

    if (!res.ok) {
      setError(data.error || "Import mislukt.");
      return;
    }

    setResult({ imported: data.imported, unmatched: data.unmatched });
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-surface rounded-xl2 shadow-card p-4 text-[13.5px] font-medium text-accent hover:bg-surfaceHover transition text-center"
      >
        + Inkomsten importeren uit CSV
      </button>
    );
  }

  return (
    <div className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col gap-4 animate-pop-in">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">CSV importeren</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12.5px] text-muted hover:text-ink"
        >
          Sluiten
        </button>
      </div>

      <p className="text-[12.5px] text-muted leading-relaxed">
        Exporteer het tabblad <strong>Inkomsten</strong> uit je Excel-sheet als CSV
        (Bestand → Downloaden → CSV) en upload het hier, of plak de rijen direct.
        Verwachte kolommen: <em>Datum, Platform, Titel, Artiest, Bruto Inkomsten, Label %, Opmerkingen</em>.
        De release wordt herkend op titel (+ artiest indien opgegeven) — bestaat de
        release nog niet, maak die dan eerst aan bij Releases.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[13px] font-medium bg-canvas border border-line px-3.5 py-2 rounded-lg hover:bg-surfaceHover transition"
        >
          CSV-bestand kiezen…
        </button>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
        <span className="text-[12px] text-muted">of plak hieronder</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={6}
        placeholder="Datum,Platform,Titel,Artiest,Bruto Inkomsten,Label %,Opmerkingen"
        className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[12.5px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
      />

      {headerFound === false && text.trim() && (
        <p className="text-danger text-[12.5px]">
          Kolommen niet herkend. Zorg dat er minstens een "Titel" en een "Bruto Inkomsten"
          kolom in de eerste rij (header) staat.
        </p>
      )}

      {headerFound && preview.length > 0 && (
        <div className="border border-line rounded-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-canvas sticky top-0">
                <tr className="text-left text-muted">
                  <th className="px-3 py-2 font-medium">Datum</th>
                  <th className="px-3 py-2 font-medium">Platform</th>
                  <th className="px-3 py-2 font-medium">Titel</th>
                  <th className="px-3 py-2 font-medium">Artiest</th>
                  <th className="px-3 py-2 font-medium text-right">Bruto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {preview.slice(0, 50).map((r, i) => (
                  <tr key={i} className="text-ink">
                    <td className="px-3 py-1.5">{r.date ?? "—"}</td>
                    <td className="px-3 py-1.5">{r.platform ?? "—"}</td>
                    <td className="px-3 py-1.5">{r.title}</td>
                    <td className="px-3 py-1.5">{r.artist ?? "—"}</td>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {Number.isFinite(r.grossAmount) ? r.grossAmount.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 text-[11.5px] text-muted bg-canvas border-t border-line">
            {preview.length} rijen gevonden{preview.length > 50 ? " (eerste 50 getoond)" : ""}
          </div>
        </div>
      )}

      {error && <p className="text-danger text-[12.5px]">{error}</p>}

      {result && (
        <div className="text-[12.5px] rounded-lg bg-accentSoft text-accent px-3.5 py-2.5">
          ✓ {result.imported} boeking(en) geïmporteerd.
          {result.unmatched.length > 0 && (
            <> {result.unmatched.length} rij(en) niet gematcht (release niet gevonden op titel).</>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={importing || preview.length === 0 || headerFound === false}
        className="self-start bg-accent text-white text-[13.5px] font-medium rounded-lg px-4 py-2 hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
      >
        {importing ? "Bezig…" : `${preview.length || ""} rijen importeren`}
      </button>
    </div>
  );
}
