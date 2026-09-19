import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();

const LOGO_URL = "https://www.artiestenportaal.nl/bdzbookings-logo.png";
const VERLOOPT_NA_MINUTEN = 15;
const MAX_POGINGEN = 5;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ fout: "RESEND_API_KEY ontbreekt" }, { status: 500 });
  }

  const { token } = (await req.json()) as { token: string };
  if (!token) return NextResponse.json({ fout: "Token is verplicht" }, { status: 400 });

  // contract ophalen
  const { data: contract } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .select("id, status, partij, waarden, act_id")
    .eq("token", token)
    .maybeSingle();

  if (!contract) return NextResponse.json({ fout: "Onbekende link" }, { status: 404 });
  if (contract.status === "getekend") return NextResponse.json({ fout: "Al getekend" }, { status: 409 });
  if (contract.status === "vervallen") return NextResponse.json({ fout: "Vervallen" }, { status: 410 });

  // e-mailadres bepalen
  const waarden = (contract.waarden ?? {}) as Record<string, string>;
  let naar = waarden.act_email || waarden.klant_email || "";
  let naam = waarden.act_eigennaam || waarden.act_naam || waarden.klant_contact || "";

  if (!naar && contract.act_id) {
    const { data: act } = await supabaseAdmin
      .from("bdzbookings_acts")
      .select("contact_email, contact_naam, name")
      .eq("id", contract.act_id)
      .maybeSingle();
    if (act) {
      naar = act.contact_email || "";
      naam = naam || act.contact_naam || act.name || "";
    }
  }

  if (!naar) {
    return NextResponse.json({ fout: "Geen e-mailadres bekend. Neem contact op met Bryan de Zwart Bookings." }, { status: 400 });
  }

  // zescijferige code genereren
  const code = String(Math.floor(100000 + crypto.randomInt(900000)));
  const hash = crypto.createHash("sha256").update(code).digest("hex");
  const verloopt = new Date(Date.now() + VERLOOPT_NA_MINUTEN * 60 * 1000).toISOString();

  await supabaseAdmin
    .from("bdzbookings_contracten")
    .update({ code_hash: hash, code_verloopt_op: verloopt, code_pogingen: 0 })
    .eq("id", contract.id);

  // mail sturen
  const html = `
<div style="background:#fafafa;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;">
    <img src="${LOGO_URL}" alt="BDZBookings" width="150" style="display:block;margin-bottom:20px;" />
    <p style="margin:0;color:#a3a3a3;font-size:13px;">Verificatiecode</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#171717;">Hoi ${naam},</h1>
    <p style="margin:12px 0 0;font-size:14px;color:#525252;line-height:1.5;">
      Vul deze code in om de overeenkomst te tekenen. De code is ${VERLOOPT_NA_MINUTEN} minuten geldig.
    </p>
    <div style="margin:24px 0;text-align:center;background:#f5f5f5;border-radius:12px;padding:20px;">
      <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#171717;">${code}</span>
    </div>
    <p style="margin:0;font-size:12px;color:#a3a3a3;line-height:1.5;">
      Niet jij die wil tekenen? Negeer dan deze mail.<br />
      Bryan de Zwart &mdash; BDZBookings
    </p>
  </div>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Bryan de Zwart Bookings <noreply@bdzbookings.nl>",
      to: [naar],
      subject: "Je verificatiecode voor de overeenkomst",
      html,
    }),
  });

  if (!res.ok) {
    const tekst = await res.text();
    console.error("Resend fout bij verificatiecode:", tekst);
    return NextResponse.json({ fout: "Versturen mislukt" }, { status: 500 });
  }

  // geef het gemaskeerde adres terug zodat het formulier het kan tonen
  const [lokaal, domein] = naar.split("@");
  const gemaskeerd = lokaal.slice(0, 2) + "***@" + domein;

  return NextResponse.json({ verstuurd: true, naar: gemaskeerd });
}
