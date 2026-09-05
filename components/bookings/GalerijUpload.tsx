"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GalerijUpload({
  slug,
  fotos,
  onKlaar,
}: {
  slug: string;
  fotos: string[];
  onKlaar: (urls: string[]) => void;
}) {
  const invoer = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const bestanden = Array.from(e.target.files ?? []);
    if (bestanden.length === 0) return;

    setBezig(true);
    setFout("");
    const supabase = createClient();
    const nieuwe: string[] = [];

    for (const bestand of bestanden) {
      const ext = bestand.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const pad = `${slug}/galerij-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await supabase.storage.from("acts").upload(pad, bestand, { cacheControl: "3600" });
      if (error) {
        setFout("Uploaden mislukt: " + error.message);
        setBezig(false);
        return;
      }
      const { data } = supabase.storage.from("acts").getPublicUrl(pad);
      nieuwe.push(data.publicUrl);
    }

    onKlaar([...fotos, ...nieuwe]);
    setBezig(false);
    if (invoer.current) invoer.current.value = "";
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">Fotogalerij — onder de biografie</label>
      <div className="flex flex-wrap items-center gap-2">
        {fotos.map((f) => (
          <div key={f} className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f} alt="" className="h-20 w-20 rounded-lg border border-neutral-200 object-cover" />
            <button
              type="button"
              onClick={() => onKlaar(fotos.filter((x) => x !== f))}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => invoer.current?.click()}
          disabled={bezig}
          className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-[12px] text-neutral-500 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {bezig ? "..." : "+ foto"}
        </button>
        <input ref={invoer} type="file" accept="image/*" multiple onChange={upload} className="hidden" />
      </div>
      {fout && <p className="mt-1.5 text-[12px] text-red-600">{fout}</p>}
      <p className="mt-2 text-[11px] text-neutral-400">Je kunt meerdere foto&apos;s tegelijk kiezen. Hover over een foto om hem te verwijderen.</p>
    </div>
  );
}
