"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Sfeerfoto = {
  id: string;
  foto_url: string;
  bijschrift: string | null;
  volgorde: number;
  actief: boolean;
  plek: string;
};

const PLEKKEN = [
  {
    sleutel: "homepage-slider",
    titel: "Homepage — grote balk bovenaan",
    uitleg: "Deze foto's wisselen elkaar af. Zet er gerust meerdere in.",
    meerdere: true,
  },
  {
    sleutel: "homepage-blok",
    titel: "Homepage — foto verderop",
    uitleg: "Eén foto, halverwege de homepage.",
    meerdere: false,
  },
  {
    sleutel: "acts-kop",
    titel: "Actspagina — foto bovenaan",
    uitleg: "Eén foto, achter de titel 'Artiesten, dj's en bands'.",
    meerdere: false,
  },
];

export default function SfeerBeheer({ start }: { start: Sfeerfoto[] }) {
  const [fotos, setFotos] = useState<Sfeerfoto[]>(start);
  const [bezigMet, setBezigMet] = useState<string | null>(null);
  const [fout, setFout] = useState("");
  const invoeren = useRef<Record<string, HTMLInputElement | null>>({});

  function voorPlek(plek: string) {
    return fotos.filter((f) => f.plek === plek).sort((a, b) => a.volgorde - b.volgorde);
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>, plek: string, meerdere: boolean) {
    const bestanden = Array.from(e.target.files ?? []);
    if (bestanden.length === 0) return;

    setBezigMet(plek);
    setFout("");
    const supabase = createClient();
    const bestaand = voorPlek(plek);

    if (!meerdere && bestaand.length > 0) {
      for (const oud of bestaand) {
        await supabase.from("bdzbookings_sfeer").delete().eq("id", oud.id);
        const pad = oud.foto_url.split("/sfeer/").pop();
        if (pad) await supabase.storage.from("sfeer").remove([pad]);
      }
    }

    const teUploaden = meerdere ? bestanden : [bestanden[0]];
    const toegevoegd: Sfeerfoto[] = [];
    let volgnr = meerdere ? bestaand.length : 0;

    for (const bestand of teUploaden) {
      const ext = bestand.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const pad = `${plek}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error: uploadFout } = await supabase.storage
        .from("sfeer")
        .upload(pad, bestand, { cacheControl: "3600" });
      if (uploadFout) {
        setFout("Uploaden mislukt: " + uploadFout.message);
        setBezigMet(null);
        return;
      }

      const { data } = supabase.storage.from("sfeer").getPublicUrl(pad);
      const { data: rij, error: dbFout } = await supabase
        .from("bdzbookings_sfeer")
        .insert({ foto_url: data.publicUrl, volgorde: volgnr, plek })
        .select()
        .single();
      if (dbFout) {
        setFout("Opslaan mislukt: " + dbFout.message);
        setBezigMet(null);
        return;
      }
      toegevoegd.push(rij as Sfeerfoto);
      volgnr++;
    }

    const behouden = meerdere ? fotos : fotos.filter((f) => f.plek !== plek);
    setFotos([...behouden, ...toegevoegd]);
    setBezigMet(null);
    const invoer = invoeren.current[plek];
    if (invoer) invoer.value = "";
  }

  async function verwijder(foto: Sfeerfoto) {
    if (!confirm("Deze foto verwijderen?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("bdzbookings_sfeer").delete().eq("id", foto.id);
    if (error) {
      setFout("Verwijderen mislukt: " + error.message);
      return;
    }
    const pad = foto.foto_url.split("/sfeer/").pop();
    if (pad) await supabase.storage.from("sfeer").remove([pad]);
    setFotos(fotos.filter((f) => f.id !== foto.id));
  }

  async function verplaats(plek: string, index: number, richting: -1 | 1) {
    const rij = voorPlek(plek);
    const doel = index + richting;
    if (doel < 0 || doel >= rij.length) return;
    [rij[index], rij[doel]] = [rij[doel], rij[index]];

    const supabase = createClient();
    const bijgewerkt = rij.map((f, i) => ({ ...f, volgorde: i }));
    setFotos([...fotos.filter((f) => f.plek !== plek), ...bijgewerkt]);
    for (const f of bijgewerkt) {
      await supabase.from("bdzbookings_sfeer").update({ volgorde: f.volgorde }).eq("id", f.id);
    }
  }

  return (
    <div className="space-y-12">
      {PLEKKEN.map((plek) => {
        const rij = voorPlek(plek.sleutel);
        const bezig = bezigMet === plek.sleutel;
        return (
          <section key={plek.sleutel}>
            <h2 className="text-[15px] font-semibold text-neutral-900">{plek.titel}</h2>
            <p className="mb-4 mt-0.5 text-[13px] text-neutral-500">{plek.uitleg}</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {rij.map((foto, i) => (
                <div key={foto.id} className="overflow-hidden rounded-xl border border-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.foto_url} alt="" className="h-36 w-full object-cover" />
                  <div className="flex items-center justify-between gap-1 p-2">
                    {plek.meerdere ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => verplaats(plek.sleutel, i, -1)}
                          disabled={i === 0}
                          className="rounded border border-neutral-200 px-2 py-1 text-[12px] disabled:opacity-30"
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          onClick={() => verplaats(plek.sleutel, i, 1)}
                          disabled={i === rij.length - 1}
                          className="rounded border border-neutral-200 px-2 py-1 text-[12px] disabled:opacity-30"
                        >
                          &rarr;
                        </button>
                      </div>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => verwijder(foto)}
                      className="rounded px-2 py-1 text-[12px] text-red-600 hover:bg-red-50"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}

              {(plek.meerdere || rij.length === 0) && (
                <button
                  type="button"
                  onClick={() => invoeren.current[plek.sleutel]?.click()}
                  disabled={bezig}
                  className="flex h-36 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[13px] text-neutral-500 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  {bezig ? "Bezig..." : "+ Foto toevoegen"}
                </button>
              )}

              {!plek.meerdere && rij.length > 0 && (
                <button
                  type="button"
                  onClick={() => invoeren.current[plek.sleutel]?.click()}
                  disabled={bezig}
                  className="flex h-36 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[13px] text-neutral-500 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  {bezig ? "Bezig..." : "Vervangen"}
                </button>
              )}
            </div>

            <input
              ref={(el) => {
                invoeren.current[plek.sleutel] = el;
              }}
              type="file"
              accept="image/*"
              multiple={plek.meerdere}
              onChange={(e) => upload(e, plek.sleutel, plek.meerdere)}
              className="hidden"
            />
          </section>
        );
      })}

      {fout && <p className="text-[13px] text-red-600">{fout}</p>}
      <p className="text-[12px] text-neutral-400">
        Liggende foto&apos;s werken het beste, ongeveer 2000 pixels breed.
      </p>
    </div>
  );
}
