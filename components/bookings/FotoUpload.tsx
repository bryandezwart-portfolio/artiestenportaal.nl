"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FotoUpload({
  slug,
  label,
  waarde,
  onKlaar,
}: {
  slug: string;
  label: string;
  waarde: string;
  onKlaar: (url: string) => void;
}) {
  const invoer = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const bestand = e.target.files?.[0];
    if (!bestand) return;

    setBezig(true);
    setFout("");

    const ext = bestand.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const pad = `${slug}/${Date.now()}.${ext}`;

    const supabase = createClient();
    const { error } = await supabase.storage.from("acts").upload(pad, bestand, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      setFout("Uploaden mislukt: " + error.message);
      setBezig(false);
      return;
    }

    const { data } = supabase.storage.from("acts").getPublicUrl(pad);
    onKlaar(data.publicUrl);
    setBezig(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">{label}</label>
      <div className="flex items-center gap-3">
        {waarde ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={waarde} alt="" className="h-16 w-16 rounded-lg border border-neutral-200 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-[11px] text-neutral-400">leeg</div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => invoer.current?.click()}
            disabled={bezig}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
          >
            {bezig ? "Bezig..." : waarde ? "Vervangen" : "Foto kiezen"}
          </button>
          {waarde && (
            <button type="button" onClick={() => onKlaar("")} className="text-left text-[12px] text-neutral-400 hover:text-neutral-700">
              Verwijderen
            </button>
          )}
        </div>
        <input ref={invoer} type="file" accept="image/*" onChange={upload} className="hidden" />
      </div>
      {fout && <p className="mt-1.5 text-[12px] text-red-600">{fout}</p>}
    </div>
  );
}
