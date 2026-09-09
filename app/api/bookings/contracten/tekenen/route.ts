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

  const partij = contract.partij as Partij;
  const type = contract.act_type as ActType;

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
  const sjabloon = vindSjabloon(partij, type);
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
    referentie: String(contract.booking_id).slice(0, 8),
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
    referentie: String(contract.booking_id).slice(0, 8),
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
  const pad = `${contract.booking_id}/${partij}-getekend-${Date.now()}.pdf`;
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

  return NextResponse.json({ ok: true, pdf: link?.signedUrl, hash });
}
