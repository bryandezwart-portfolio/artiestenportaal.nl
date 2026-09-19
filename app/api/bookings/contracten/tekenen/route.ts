import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();
import {
  vindSjabloon,
  vulIn,
  VELDEN,
  type ActType,
  type Partij,
  type Soort,
} from "@/lib/bookings/contract-sjablonen";
import { maakContractPdf, type Inhoud } from "@/lib/bookings/contract-pdf";
import { haalLogo, haalHandtekening } from "@/lib/bookings/merk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    token: string;
    waarden?: Record<string, string>;
    naam: string;
    plaats: string;
    handtekening: string;
    /** Verificatiecode die per mail is gestuurd */
    code?: string;
  };

  if (!body.token || !body.naam?.trim() || !body.plaats?.trim() || !body.handtekening) {
    return NextResponse.json({ fout: "Naam, plaats en handtekening zijn verplicht" }, { status: 400 });
  }
  if (!body.handtekening.startsWith("data:image/png;base64,") || body.handtekening.length > 600_000) {
    return NextResponse.json({ fout: "De handtekening is niet geldig" }, { status: 400 });
  }

  // 1. het contract bij het token zoeken
  const { data: contract } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .select("*")
    .eq("token", body.token)
    .maybeSingle();

  if (!contract) return NextResponse.json({ fout: "Onbekende link" }, { status: 404 });
  if (contract.status === "getekend") return NextResponse.json({ fout: "Deze overeenkomst is al getekend" }, { status: 409 });
  if (contract.status === "vervallen") return NextResponse.json({ fout: "Deze versie is vervallen" }, { status: 410 });

  // verificatiecode controleren (alleen als er een is opgeslagen)
  if (contract.code_hash) {
    if (!body.code?.trim()) {
      return NextResponse.json({ fout: "Vul de verificatiecode in die je per mail hebt ontvangen" }, { status: 400 });
    }
    const pogingen = Number((contract as any).code_pogingen ?? 0) + 1;
    await supabaseAdmin
      .from("bdzbookings_contracten")
      .update({ code_pogingen: pogingen })
      .eq("id", contract.id);
    if (pogingen > 5) {
      return NextResponse.json({ fout: "Te veel onjuiste pogingen. Vraag een nieuwe code aan." }, { status: 429 });
    }
    if (new Date() > new Date((contract as any).code_verloopt_op)) {
      return NextResponse.json({ fout: "De code is verlopen. Vraag een nieuwe aan." }, { status: 410 });
    }
    const crypto2 = await import("crypto");
    const ingevoerdHash = crypto2.default.createHash("sha256").update(body.code.trim()).digest("hex");
    if (ingevoerdHash !== contract.code_hash) {
      return NextResponse.json({ fout: `Onjuiste code (poging ${pogingen} van 5)` }, { status: 401 });
    }
    await supabaseAdmin
      .from("bdzbookings_contracten")
      .update({ code_pogingen: 0 })
      .eq("id", contract.id);
  }

  const partij = contract.partij as Partij;
  const type = contract.act_type as ActType;
  // oude rijen hebben nog geen soort; die zijn altijd een boeking
  const soort = ((contract as any).soort ?? "boeking") as Soort;
  // een samenwerkingsovereenkomst hangt aan de act, niet aan een boeking
  const referentie = String((contract as any).booking_id ?? (contract as any).act_id ?? "").slice(0, 8);

  // 2. alleen de velden die deze partij mág invullen overnemen
  const toegestaan = Object.entries(VELDEN)
    .filter(([, v]) => v.eigenaar === partij)
    .map(([naam]) => naam);

  const eigenInvoer: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.waarden ?? {})) {
    if (toegestaan.includes(k) && typeof v === "string") eigenInvoer[k] = v.slice(0, 300);
  }

  const nu = new Date();
  const waarden = {
    ...(contract.waarden as Record<string, string>),
    ...eigenInvoer,
    bureau_datum: nu.toLocaleDateString("nl-NL"),
    bureau_plaats: "Cuijk",
  };

  // 3. de definitieve tekst samenstellen en bevriezen
  const sjabloon = vindSjabloon(partij, type, soort);
  const inhoud: Inhoud = {
    titel: sjabloon.titel,
    ondertitel: sjabloon.ondertitel,
    intro: sjabloon.intro,
    partijen: sjabloon.partijen.map((b) => ({ label: b.label, regels: b.regels.map((r) => vulIn(r, waarden)) })),
    artikelen: sjabloon.artikelen.map((b) => ({ label: b.label, regels: b.regels.map((r) => vulIn(r, waarden)) })),
  };

  // 4. bewijsgegevens
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  const userAgent = req.headers.get("user-agent");
  const tijdstip = nu.toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" });

  // 5. de getekende pdf maken
  const [logo, eigenKrabbel] = await Promise.all([haalLogo(), haalHandtekening()]);
  const tegenpartij = partij === "klant" ? "Opdrachtgever" : sjabloon.partijen[sjabloon.partijen.length - 1].label.replace(":", "");
  const voorlopig = await maakContractPdf({
    inhoud,
    tegenpartij,
    referentie,
    bureau: {
      naam: "Brian Verpoorten",
      plaats: "Cuijk",
      datum: nu.toLocaleDateString("nl-NL"),
      afbeelding: eigenKrabbel,
    },
    ondertekenaar: {
      naam: body.naam.trim().slice(0, 120),
      plaats: body.plaats.trim().slice(0, 80),
      datum: nu.toLocaleDateString("nl-NL"),
      afbeelding: body.handtekening,
    },
    bewijsregel: null,
    logo,
  });

  // de vingerafdruk gaat over het document zonder de bewijsregel,
  // en wordt daarna zichtbaar in het document zelf gezet
  const hash = crypto.createHash("sha256").update(voorlopig).digest("hex");
  const bewijsregel =
    `Digitaal ondertekend door ${body.naam.trim()} op ${tijdstip}` +
    (ip ? ` vanaf ip ${ip}` : "") +
    ` via artiestenportaal.nl · vingerafdruk ${hash.slice(0, 16)}`;

  const pdf = await maakContractPdf({
    inhoud,
    tegenpartij,
    referentie,
    bureau: {
      naam: "Brian Verpoorten",
      plaats: "Cuijk",
      datum: nu.toLocaleDateString("nl-NL"),
      afbeelding: eigenKrabbel,
    },
    ondertekenaar: {
      naam: body.naam.trim().slice(0, 120),
      plaats: body.plaats.trim().slice(0, 80),
      datum: nu.toLocaleDateString("nl-NL"),
      afbeelding: body.handtekening,
    },
    bewijsregel,
    logo,
  });

  // 6. opslaan
  const map = (contract as any).booking_id ?? `act-${(contract as any).act_id}`;
  const pad = `${map}/${soort === "samenwerking" ? "samenwerking" : partij}-getekend-${Date.now()}.pdf`;
  const { error: uploadFout } = await supabaseAdmin.storage
    .from("contracten")
    .upload(pad, pdf, { contentType: "application/pdf", upsert: true });
  if (uploadFout) return NextResponse.json({ fout: uploadFout.message }, { status: 500 });

  const { error: updateFout } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .update({
      waarden,
      inhoud,
      pdf_pad: pad,
      document_hash: hash,
      status: "getekend",
      getekend_op: nu.toISOString(),
    })
    .eq("id", contract.id);
  if (updateFout) return NextResponse.json({ fout: updateFout.message }, { status: 500 });

  await supabaseAdmin.from("bdzbookings_ondertekeningen").insert([
    {
      contract_id: contract.id,
      wie: partij,
      naam: body.naam.trim(),
      email: (waarden as any)[partij === "klant" ? "klant_email" : "act_email"] ?? null,
      handtekening: body.handtekening,
      ip_adres: ip,
      user_agent: userAgent,
      document_hash: hash,
    },
    {
      contract_id: contract.id,
      wie: "bureau",
      naam: "Brian Verpoorten",
      email: "info@bdzbookings.nl",
      document_hash: hash,
    },
  ]);

  const { data: link } = await supabaseAdmin.storage.from("contracten").createSignedUrl(pad, 60 * 60 * 24 * 30);

  // kopie per mail sturen
  if (process.env.RESEND_API_KEY) {
    const naarAct = (waarden as any)[partij === "klant" ? "klant_email" : "act_email"] ?? null;
    const naamAct = (waarden as any)[partij === "klant" ? "klant_contact" : "act_eigennaam"] ||
                    (waarden as any)[partij === "klant" ? "klant_naam" : "act_naam"] || "";
    const LOGO_URL = "https://www.artiestenportaal.nl/bdzbookings-logo.png";
    if (naarAct && link?.signedUrl) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Bryan de Zwart Bookings <noreply@bdzbookings.nl>",
          to: [naarAct],
          subject: "Getekende overeenkomst — Bryan de Zwart Bookings",
          html: `<div style="background:#fafafa;padding:32px 16px;font-family:-apple-system,sans-serif;"><div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;"><img src="${LOGO_URL}" width="150" style="display:block;margin-bottom:20px;" /><p style="margin:0;color:#a3a3a3;font-size:13px;">Ondertekend</p><h1 style="margin:6px 0 0;font-size:20px;color:#171717;">Hoi ${naamAct},</h1><p style="margin:12px 0 0;font-size:14px;color:#525252;line-height:1.5;">Bedankt. De overeenkomst is ondertekend. Hieronder kun je de getekende pdf downloaden. Bewaar hem op een veilige plek.</p><a href="${link.signedUrl}" style="display:block;margin-top:24px;background:#171717;color:#fff;text-align:center;padding:13px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:500;">Download de getekende overeenkomst</a><p style="margin:20px 0 0;font-size:12px;color:#a3a3a3;">Vragen? Bel of app me even.<br/>Bryan de Zwart — BDZBookings — 085 060 6460</p></div></div>`,
        }),
      }).catch(() => {});
    }
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bryan de Zwart Bookings <noreply@bdzbookings.nl>",
        to: ["info@bdzbookings.nl"],
        subject: `Getekend: ${(waarden as any).act_naam || (waarden as any).klant_naam || "overeenkomst"}`,
        html: `<div style="font-family:-apple-system,sans-serif;padding:24px;max-width:480px;"><p style="font-size:16px;color:#171717;font-weight:600;margin:0 0 12px;">${(waarden as any).act_naam || (waarden as any).klant_naam || "Iemand"} heeft getekend.</p><p style="font-size:14px;color:#525252;margin:0 0 8px;">Naam: ${body.naam.trim()}<br/>Tijdstip: ${tijdstip}<br/>IP: ${ip || "onbekend"}</p>${link?.signedUrl ? `<p style="margin:16px 0 0;"><a href="${link.signedUrl}" style="color:#171717;font-weight:500;">Bekijk de getekende pdf</a></p>` : ""}</div>`,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, pdf: link?.signedUrl, hash });
}
