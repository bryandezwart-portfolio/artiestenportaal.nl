"use client";

import React from "react";

export interface ExtraPost {
  omschrijving: string;
  bedrag: number;
  bedragTekst?: string;
  voor: "act" | "mij";
}

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

export function totaalVoor(posten: ExtraPost[], voor: "act" | "mij") {
  return posten.filter((p) => p.voor === voor).reduce((som, p) => som + (Number(p.bedrag) || 0), 0);
}

export default function ExtraPosten({
  posten,
  onChange,
}: {
  posten: ExtraPost[];
  onChange: (p: ExtraPost[]) => void;
}) {
  function wijzig(index: number, veld: keyof ExtraPost, waarde: string) {
    const kopie = [...posten];
    if (veld === "bedrag") {
      kopie[index] = {
        ...kopie[index],
        bedragTekst: waarde,
        bedrag: parseFloat(waarde.replace(",", ".")) || 0,
      };
    } else if (veld === "voor") {
      kopie[index] = { ...kopie[index], voor: waarde as "act" | "mij" };
    } else {
      kopie[index] = { ...kopie[index], omschrijving: waarde };
    }
    onChange(kopie);
  }

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">Extra posten</label>

      {posten.length === 0 && (
        <p className="mb-2 text-[12px] text-neutral-400">
          Nog geen extra posten. Denk aan parkeerkosten, reiskosten of huur van apparatuur.
        </p>
      )}

      <div className="space-y-2">
        {posten.map((post, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={post.omschrijving}
              onChange={(e) => wijzig(i, "omschrijving", e.target.value)}
              placeholder="Bijv. parkeerkosten"
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
            <input
              type="text"
              value={post.bedragTekst ?? (post.bedrag || "")}
              onChange={(e) => wijzig(i, "bedrag", e.target.value)}
              placeholder="0"
              className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
            <select
              value={post.voor}
              onChange={(e) => wijzig(i, "voor", e.target.value)}
              className="w-32 rounded-xl border border-neutral-200 px-2 py-2 text-[13px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
            >
              <option value="act">Voor de act</option>
              <option value="mij">Voor mij</option>
            </select>
            <button
              type="button"
              onClick={() => onChange(posten.filter((_, j) => j !== i))}
              className="rounded-xl border border-neutral-200 px-3 text-[13px] text-neutral-400 transition hover:bg-neutral-50 hover:text-neutral-700"
              aria-label="Post verwijderen"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...posten, { omschrijving: "", bedrag: 0, voor: "act" }])}
        className="mt-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition hover:bg-neutral-50"
      >
        + Post toevoegen
      </button>

      {posten.length > 0 && (
        <p className="mt-2 text-[12px] text-neutral-500">
          Voor de act: {euro(totaalVoor(posten, "act"))} &middot; Voor jou: {euro(totaalVoor(posten, "mij"))}
        </p>
      )}
    </div>
  );
}
