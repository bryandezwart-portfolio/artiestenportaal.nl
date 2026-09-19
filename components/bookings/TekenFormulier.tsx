"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  vindSjabloon,
  vulIn,
  VELDEN,
  type ActType,
  type Partij,
  type Soort,
} from "@/lib/bookings/contract-sjablonen";

type Props = {
  token: string;
  partij: Partij;
  actType: ActType;
  soort?: Soort;
  waarden: Record<string, string>;
  heeftCode: boolean;
};

function veldenInSjabloon(regels: string[][]) {
  const gevonden = new Set<string>();
  for (const groep of regels)
    for (const r of groep)
      for (const m of r.matchAll(/{{(\w+)}}/g)) gevonden.add(m[1]);
  return gevonden;
}

function Krabbelvak({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tekent = useRef(false);
  const [leeg, setLeeg] = useState(true);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const schaal = window.devicePixelRatio || 1;
    c.width = c.clientWidth * schaal;
    c.height = 160 * schaal;
    const ctx = c.getContext("2d")!;
    ctx.scale(schaal, schaal);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
  }, []);

  const punt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = punt(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    tekent.current = true;
  };

  const beweeg = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!tekent.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = punt(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => {
    if (!tekent.current) return;
    tekent.current = false;
    setLeeg(false);
    onChange(canvasRef.current!.toDataURL("image/png"));
  };

  const wissen = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setLeeg(true);
    onChange(null);
  };

  return (
    <div>
      <div className="rounded-xl border border-neutral-300 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={beweeg}
          onPointerUp={stop}
          onPointerLeave={stop}
          className="w-full touch-none block"
          style={{ height: 160 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          {leeg ? "Zet hier je handtekening met de muis of je vinger." : "Ziet het er goed uit?"}
        </p>
        <button type="button" onClick={wissen} className="text-xs text-neutral-500 underline">
          Opnieuw
        </button>
      </div>
    </div>
  );
}

export default function TekenFormulier({ token, partij, actType, soort = "boeking", waarden, heeftCode }: Props) {
  const sjabloon = useMemo(() => vindSjabloon(partij, actType, soort), [partij, actType, soort]);

  const mijnVelden = useMemo(() => {
    const aanwezig = veldenInSjabloon([
      ...sjabloon.partijen.map((b) => b.regels),
      ...sjabloon.artikelen.map((b) => b.regels),
    ]);
    return Object.entries(VELDEN)
      .filter(([naam, v]) => v.eigenaar === partij && aanwezig.has(naam))
      .map(([naam, v]) => ({ naam, label: v.label }));
  }, [sjabloon, partij]);

  const [invoer, setInvoer] = useState<Record<string, string>>(() =>
    Object.fromEntries(mijnVelden.map((v) => [v.naam, waarden[v.naam] ?? ""]))
  );
  const [naam, setNaam] = useState(
    partij === "act"
      ? (waarden.act_eigennaam || waarden.act_naam || "").trim()
      : (waarden.klant_contact || waarden.klant_naam || "").trim()
  );
  const [plaats, setPlaats] = useState("");
  const [handtekening, setHandtekening] = useState<string | null>(null);
  const [akkoord, setAkkoord] = useState(false);

  const [codeStap, setCodeStap] = useState<"wachten" | "verstuurd" | "geverifieerd">(
    heeftCode ? "wachten" : "geverifieerd"
  );
  const [codeInvoer, setCodeInvoer] = useState("");
  const [codeNaar, setCodeNaar] = useState("");
  const [codeBezig, setCodeBezig] = useState(false);
  const [codeFout, setCodeFout] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState<string | null>(null);

  const alles = { ...waarden, ...invoer };
  const kanTekenen =
    codeStap === "geverifieerd" &&
    naam.trim().length > 1 &&
    plaats.trim().length > 1 &&
    handtekening &&
    akkoord;

  async function vraagCode() {
    setCodeBezig(true);
    setCodeFout(null);
    try {
      const res = await fetch("/api/bookings/contracten/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fout || "Versturen mislukt");
      setCodeNaar(data.naar);
      setCodeStap("verstuurd");
    } catch (e: any) {
      setCodeFout(e.message);
    } finally {
      setCodeBezig(false);
    }
  }

  async function controleerCode() {
    setCodeBezig(true);
    setCodeFout(null);
    try {
      const res = await fetch("/api/bookings/contracten/tekenen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code: codeInvoer, naam: naam || "check", plaats: "check", handtekening: "check" }),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 429 || res.status === 410) throw new Error(data.fout);
      if (res.status === 400 && data.fout?.includes("verplicht")) { setCodeStap("geverifieerd"); return; }
      if (!res.ok) throw new Error(data.fout || "Controleren mislukt");
      setCodeStap("geverifieerd");
    } catch (e: any) {
      setCodeFout(e.message);
    } finally {
      setCodeBezig(false);
    }
  }

  async function versturen() {
    setBezig(true);
    setFout(null);
    try {
      const res = await fetch("/api/bookings/contracten/tekenen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, waarden: invoer, naam, plaats, handtekening, code: codeInvoer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fout || "Er ging iets mis");
      setKlaar(data.pdf);
    } catch (e: any) {
      setFout(e.message);
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-lg font-semibold">Gelukt, bedankt</h1>
          <p className="mt-2 text-sm text-neutral-600">
            De overeenkomst is ondertekend. Je ontvangt een kopie per mail.
          </p>
          <a href={klaar} className="mt-6 inline-block rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white">
            Download de pdf
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <p className="text-xs font-semibold tracking-wide text-neutral-500">BRYAN DE ZWART BOOKINGS</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{sjabloon.titel}</h1>
          {sjabloon.ondertitel ? <p className="text-sm text-neutral-500">{sjabloon.ondertitel}</p> : null}
        </header>

        <section className="rounded-2xl bg-white shadow-sm p-6 text-sm">
          {sjabloon.partijen.map((blok, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold text-neutral-900">{blok.label}</p>
              {blok.regels.map((r, j) => <p key={j} className="text-neutral-700">{vulIn(r, alles)}</p>)}
            </div>
          ))}
          <p className="my-4 text-neutral-700">{sjabloon.intro}</p>
          {sjabloon.artikelen.map((blok, i) => (
            <div key={i} className="mb-4 border-t border-neutral-200 pt-3">
              <p className="font-semibold text-neutral-900">{i + 1}. {blok.label}</p>
              {blok.regels.map((r, j) => <p key={j} className="text-neutral-700 leading-relaxed">{vulIn(r, alles)}</p>)}
            </div>
          ))}
        </section>

        {heeftCode && codeStap !== "geverifieerd" ? (
          <section className="mt-6 rounded-2xl bg-white shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900">Stap 1 — Bevestig je identiteit</h2>
            {codeStap === "wachten" ? (
              <>
                <p className="mt-1 text-sm text-neutral-500">We sturen een code naar het e-mailadres dat bij deze overeenkomst hoort.</p>
                {codeFout ? <p className="mt-3 text-sm text-red-600">{codeFout}</p> : null}
                <button type="button" onClick={vraagCode} disabled={codeBezig}
                  className="mt-4 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40">
                  {codeBezig ? "Bezig..." : "Stuur verificatiecode"}
                </button>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-neutral-500">
                  Code verstuurd naar <strong>{codeNaar}</strong>. Geldig 15 minuten.
                </p>
                <div className="mt-4 flex gap-3">
                  <input value={codeInvoer}
                    onChange={(e) => setCodeInvoer(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-36 rounded-xl border border-neutral-300 px-3 py-2 text-center text-2xl font-mono tracking-widest"
                    maxLength={6} />
                  <button type="button" onClick={controleerCode} disabled={codeBezig || codeInvoer.length < 6}
                    className="rounded-xl bg-neutral-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40">
                    {codeBezig ? "Bezig..." : "Bevestigen"}
                  </button>
                </div>
                {codeFout ? <p className="mt-3 text-sm text-red-600">{codeFout}</p> : null}
                <button type="button" onClick={vraagCode} disabled={codeBezig} className="mt-3 text-sm text-neutral-500 underline">
                  Nieuwe code sturen
                </button>
              </>
            )}
          </section>
        ) : null}

        {mijnVelden.length > 0 && codeStap === "geverifieerd" ? (
          <section className="mt-6 rounded-2xl bg-white shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900">{heeftCode ? "Stap 2 — " : ""}Even je gegevens aanvullen</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {mijnVelden.map((v) => (
                <label key={v.naam} className="block">
                  <span className="text-sm text-neutral-700">{v.label}</span>
                  <input value={invoer[v.naam] ?? ""}
                    onChange={(e) => setInvoer({ ...invoer, [v.naam]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
                </label>
              ))}
            </div>
          </section>
        ) : null}

        {codeStap === "geverifieerd" ? (
          <section className="mt-6 rounded-2xl bg-white shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900">{heeftCode ? "Stap 3 — " : ""}Ondertekenen</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-neutral-700">Je naam</span>
                <input value={naam} onChange={(e) => setNaam(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-700">Plaats</span>
                <input value={plaats} onChange={(e) => setPlaats(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="mt-4"><Krabbelvak onChange={setHandtekening} /></div>
            <label className="mt-4 flex items-start gap-3 text-sm text-neutral-700">
              <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-1" />
              <span>Ik heb de overeenkomst gelezen en ga akkoord. Ik weet dat deze digitale handtekening net zo geldt als een handtekening op papier.</span>
            </label>
            {fout ? <p className="mt-4 text-sm text-red-600">{fout}</p> : null}
            <button onClick={versturen} disabled={!kanTekenen || bezig}
              className="mt-5 w-full rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-40">
              {bezig ? "Bezig..." : "Ondertekenen"}
            </button>
          </section>
        ) : null}

        <p className="mt-6 text-center text-xs text-neutral-400">
          Bryan de Zwart Bookings &middot; 085 060 6460 &middot; info@bdzbookings.nl
        </p>
      </div>
    </main>
  );
}
