import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();
import {
  vindSjabloon,
  vulIn,
  SJABLOON_VERSIE,
  type Partij,
  type ActType,
} from "@/lib/bookings/contract-sjablonen";
import { maakContractPdf, type Inhoud } from "@/lib/bookings/contract-pdf";
import { haalLogo, haalHandtekening } from "@/lib/bookings/merk";

// react-pdf draait niet op de edge runtime
export const runtime = "nodejs";

const BTW = 0.21;

/**
 * Uitloop wordt gerekend tegen het gewone uurtarief.
 * Wil je uitloop duurder maken, zet dit dan op bijvoorbeeld 1.5.
 */
const UITLOOP_FACTOR = 1;

const euro = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const datumNL = (d: string | null) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

const tijd = (t: string | null) => (t ? t.slice(0, 5) : "");

/** Rekent de speelduur uit, ook als het optreden over middernacht heen loopt. */
function speelUren(start: string | null, eind: string | null) {
  if (!start || !eind) return 0;
  const naarMin = (t: string) => {
    const [u, m] = t.slice(0, 5).split(":").map(Number);
    return u * 60 + m;
  };
  let duur = naarMin(eind) - naarMin(start);
  if (duur <= 0) duur += 24 * 60;
  return duur / 60;
}

/** Trekt het aantal minuten reistijd van de aanvangstijd af. */
function aankomstTijd(start: string | null, minuten: number | null) {
  if (!start) return "";
  const [u, m] = start.slice(0, 5).split(":").map(Number);
  const totaal = u * 60 + m - (minuten ?? 60);
  const d = ((totaal % 1440) + 1440) % 1440;
  return `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  // 1. alleen beheerders
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  if (!user) return NextResponse.json({ fout: "Niet ingelogd" }, { status: 401 });

  const { data: admin } = await supabaseAdmin
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) return NextResponse.json({ fout: "Geen toegang" }, { status: 403 });

  // 2. wat moet er gemaakt worden
  const { booking_id, partij, bureau_datum, bureau_plaats, waarden: eigenInvoer } = (await req.json()) as {
    booking_id: string;
    partij: Partij;
    /** Wat je zelf in het portaal hebt ingevuld. */
    waarden?: Record<string, string>;
    /** Optioneel: de datum die onder jouw handtekening komt. Leeg = vandaag. */
    bureau_datum?: string;
    /** Optioneel: de plaats onder jouw handtekening. Leeg = Cuijk. */
    bureau_plaats?: string;
  };
  if (!booking_id || !["klant", "act"].includes(partij)) {
    return NextResponse.json({ fout: "booking_id en partij (klant of act) zijn verplicht" }, { status: 400 });
  }

  // 3. de boeking ophalen
  const { data: b, error } = await supabaseAdmin
    .from("bdzbookings_bookings")
    .select("*, act:bdzbookings_acts(*)")
    .eq("id", booking_id)
    .single();
  if (error || !b) return NextResponse.json({ fout: "Boeking niet gevonden" }, { status: 404 });

  const act = (b as any).act;
  const type = (act?.type ?? "dj") as ActType;

  // 4. de velden vullen
  //    Kloppen de kolomnamen niet met jouw tabel? Pas ze hier aan; de rest blijft werken.
  const gage = Number((b as any).gage ?? (b as any).basistarief ?? 0);
  const commissie = Number((b as any).commissie ?? 0);
  const onkosten = Number((b as any).toeslag ?? 0);
  const subtotaal = partij === "klant" ? gage + commissie + onkosten : gage + onkosten;

  const waarden: Record<string, string> = {
    datum: datumNL((b as any).datum),
    gelegenheid: (b as any).gelegenheid ?? "",
    bezoekers: (b as any).bezoekers ? String((b as any).bezoekers) : "",
    binnen_buiten: (b as any).binnen_buiten ?? "",
    start_tijd: tijd((b as any).start_tijd),
    eind_tijd: tijd((b as any).eind_tijd),
    aankomst: aankomstTijd((b as any).start_tijd, (b as any).reistijd_min),
    reistijd: (b as any).reistijd_min ? String((b as any).reistijd_min) : "",

    locatie_naam: (b as any).locatie_naam ?? (b as any).locatie ?? "",
    locatie_adres: (b as any).locatie_adres ?? "",
    locatie_plaats: (b as any).locatie_plaats ?? "",
    locatie_contact: (b as any).locatie_contact ?? "",

    opdrachtgever_naam: (b as any).klant_naam ?? (b as any).opdrachtgever ?? "",
    klant_naam: (b as any).klant_naam ?? (b as any).opdrachtgever ?? "",
    klant_contact: (b as any).klant_contact ?? (b as any).klant_naam ?? (b as any).opdrachtgever ?? "",
    klant_email: (b as any).klant_email ?? "",
    klant_telefoon: (b as any).klant_telefoon ?? "",

    act_naam: act?.name ?? "",
    act_soort: act?.specialiteit ?? "",
    act_email: act?.contact_email ?? "",
    act_telefoon: act?.contact_telefoon ?? "",

    gage: euro(gage),
    commissie: euro(commissie),
    onkosten: euro(onkosten),
    totaal: euro(subtotaal * (1 + BTW)),

    subtotaal: euro(subtotaal),
    btw: euro(subtotaal * BTW),
    btw_pct: String(Math.round(BTW * 100)),
  };

  // naam van de opdrachtgever: uit de boeking, anders uit wat je zelf invulde
  if (!waarden.opdrachtgever_naam) {
    waarden.opdrachtgever_naam =
      (eigenInvoer?.klant_bedrijf || eigenInvoer?.klant_contact || "").trim();
  }

  // tarief voor uitloop: uurtarief gedeeld door twee, afgerond op vijf euro
  const uren = speelUren((b as any).start_tijd, (b as any).eind_tijd);
  if (uren > 0) {
    waarden.speeltijd_in_totaal = String(uren).replace(".", ",");
  }
  if (uren > 0 && gage > 0) {
    const halfUur = Math.round(((gage / uren) * UITLOOP_FACTOR) / 2 / 5) * 5;
    waarden.speeltijd_wordt_achteraf_gefactureerd_tegen = String(halfUur);
    waarden.blok_wordt_achteraf_gefactureerd_tegen = String(halfUur);
    waarden.wordt_achteraf_gefactureerd_tegen_per = "30";
  }

  // wat je zelf hebt ingevuld gaat boven wat er uit de boeking komt
  for (const [k, v] of Object.entries(eigenInvoer ?? {})) {
    if (typeof v === "string" && v.trim()) waarden[k] = v.trim().slice(0, 300);
  }

  // 5. de tekst bevriezen: precies wat er op papier komt
  const sjabloon = vindSjabloon(partij, type);
  const inhoud: Inhoud = {
    titel: sjabloon.titel,
    ondertitel: sjabloon.ondertitel,
    intro: sjabloon.intro,
    partijen: sjabloon.partijen.map((blok) => ({ label: blok.label, regels: blok.regels.map((r) => vulIn(r, waarden)) })),
    artikelen: sjabloon.artikelen.map((blok) => ({ label: blok.label, regels: blok.regels.map((r) => vulIn(r, waarden)) })),
  };

  // 6. pdf maken
  const tegenpartij = partij === "klant" ? "Opdrachtgever" : sjabloon.partijen[sjabloon.partijen.length - 1].label.replace(":", "");
  // jouw eigen ondertekening staat er meteen op
  const [logo, eigenKrabbel] = await Promise.all([haalLogo(), haalHandtekening()]);
  const pdf = await maakContractPdf({
    inhoud,
    tegenpartij,
    referentie: String(booking_id).slice(0, 8),
    logo,
    bureau: {
      naam: "Brian Verpoorten",
      datum: bureau_datum?.trim() || new Date().toLocaleDateString("nl-NL"),
      plaats: bureau_plaats?.trim() || "Cuijk",
      afbeelding: eigenKrabbel,
    },
  });
  const hash = crypto.createHash("sha256").update(pdf).digest("hex");

  // 7. opslaan in de bucket
  const pad = `${booking_id}/${partij}-${Date.now()}.pdf`;
  const { error: uploadFout } = await supabaseAdmin.storage
    .from("contracten")
    .upload(pad, pdf, { contentType: "application/pdf", upsert: true });
  if (uploadFout) return NextResponse.json({ fout: uploadFout.message }, { status: 500 });

  // 8. een eerdere versie voor dezelfde partij vervalt — ook als die al
  //    getekend was. De oude pdf en het bewijs van ondertekening blijven staan.
  await supabaseAdmin
    .from("bdzbookings_contracten")
    .update({ status: "vervallen" })
    .eq("booking_id", booking_id)
    .eq("partij", partij)
    .in("status", ["concept", "verstuurd", "getekend"]);

  const { data: contract, error: insertFout } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .insert({
      booking_id,
      partij,
      act_type: type,
      sjabloon_id: sjabloon.id,
      sjabloon_versie: SJABLOON_VERSIE,
      waarden,
      inhoud,
      pdf_pad: pad,
      document_hash: hash,
      status: "concept",
      token: crypto.randomBytes(24).toString("base64url"),
    })
    .select()
    .single();
  if (insertFout) return NextResponse.json({ fout: insertFout.message }, { status: 500 });

  // 9. tijdelijke downloadlink (7 dagen)
  const { data: link } = await supabaseAdmin.storage.from("contracten").createSignedUrl(pad, 60 * 60 * 24 * 7);

  // de link die je naar de klant of de act stuurt
  const basis = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artiestenportaal.nl";
  const tekenlink = `${basis}/tekenen/${contract.token}`;

  return NextResponse.json({ contract_id: contract.id, pdf: link?.signedUrl, tekenlink, hash });
}
