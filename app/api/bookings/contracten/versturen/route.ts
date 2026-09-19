import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();

const LOGO_URL = "https://www.artiestenportaal.nl/bdzbookings-logo.png";

export async function POST(req: NextRequest) {
  // alleen beheerders
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  if (!user) return NextResponse.json({ fout: "Niet ingelogd" }, { status: 401 });

  const { data: admin } = await supabaseAdmin
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) return NextResponse.json({ fout: "Geen toegang" }, { status: 403 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ fout: "RESEND_API_KEY ontbreekt" }, { status: 500 });
  }

  const { contract_id, naar: naarOverride } = (await req.json()) as {
    contract_id: string;
    /** Optioneel: een ander adres dan dat van de act. */
    naar?: string;
  };
  if (!contract_id) {
    return NextResponse.json({ fout: "contract_id is verplicht" }, { status: 400 });
  }

  const { data: contract } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .select("id, soort, act_id, booking_id, token, status, waarden")
    .eq("id", contract_id)
    .maybeSingle();

  if (!contract) return NextResponse.json({ fout: "Overeenkomst niet gevonden" }, { status: 404 });
  if (contract.status === "getekend") {
    return NextResponse.json({ fout: "Deze overeenkomst is al getekend" }, { status: 409 });
  }
  if (contract.status === "vervallen") {
    return NextResponse.json({ fout: "Deze versie is vervallen" }, { status: 410 });
  }
  if (!contract.token) {
    return NextResponse.json({ fout: "Deze overeenkomst heeft geen tekenlink" }, { status: 400 });
  }

  // het e-mailadres: eerst wat je zelf meegeeft, anders dat van de act
  const waarden = (contract.waarden ?? {}) as Record<string, string>;
  let naam = waarden.act_eigennaam || waarden.act_naam || "";
  let naar = (naarOverride ?? "").trim() || waarden.act_email || "";

  if (contract.act_id) {
    const { data: act } = await supabaseAdmin
      .from("bdzbookings_acts")
      .select("name, contact_naam, contact_email")
      .eq("id", contract.act_id)
      .maybeSingle();
    if (act) {
      naam = naam || act.contact_naam || act.name || "";
      naar = naar || act.contact_email || "";
    }
  }

  if (!naar) {
    return NextResponse.json({ fout: "Geen e-mailadres bekend bij deze act." }, { status: 400 });
  }

  const basis = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const tekenlink = `${basis}/tekenen/${contract.token}`;
  const isSamenwerking = contract.soort === "samenwerking";
  const titel = isSamenwerking ? "Samenwerkingsovereenkomst" : "Aftekenlijst optreden";

  const uitleg = isSamenwerking
    ? `Hierbij de samenwerkingsovereenkomst tussen ons. Die teken je \u00e9\u00e9n keer;
       daarna hoef je per boeking alleen nog een korte aftekenlijst af te vinken.
       Loop 'm rustig door, vul je gegevens aan en teken onderaan.`
    : `Hierbij de aftekenlijst voor het optreden. Loop 'm even na en teken onderaan af,
       dan staat het vast.`;

  const html = `
<div style="background:#fafafa;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;">
    <img src="${LOGO_URL}" alt="BDZBookings" width="150" style="display:block;margin-bottom:20px;" />

    <p style="margin:0;color:#a3a3a3;font-size:13px;">${titel}</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#171717;">Hoi ${naam},</h1>
    <p style="margin:12px 0 0;font-size:14px;color:#525252;line-height:1.5;">${uitleg}</p>

    <a href="${tekenlink}" style="display:block;margin-top:24px;background:#171717;color:#ffffff;text-align:center;padding:13px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:500;">
      Bekijken en ondertekenen
    </a>

    <p style="margin:20px 0 0;font-size:12px;color:#a3a3a3;line-height:1.5;">
      Deze link is persoonlijk \u2014 deel 'm niet met anderen.<br />
      Vragen? Bel of app me even.<br />
      Bryan de Zwart \u2014 BDZBookings
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
      subject: `${titel} \u2014 Bryan de Zwart Bookings`,
      html,
    }),
  });

  if (!res.ok) {
    const tekst = await res.text();
    console.error("Resend gaf een fout:", tekst);
    return NextResponse.json({ fout: "Versturen mislukt", detail: tekst }, { status: 500 });
  }

  // vastleggen dat hij eruit is; "verstuurd" blijft tekenbaar
  if (contract.status === "concept") {
    await supabaseAdmin
      .from("bdzbookings_contracten")
      .update({ status: "verstuurd", verstuurd_op: new Date().toISOString() })
      .eq("id", contract.id);
  }

  return NextResponse.json({ verstuurd: true, naar });
}
