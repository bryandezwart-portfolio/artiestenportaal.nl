import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LOGO_URL = "https://www.artiestenportaal.nl/bdzbookings-logo.png";

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function langeDatum(d: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d + "T12:00:00"));
}

function rij(label: string, waarde: string) {
  return `
    <tr>
      <td style="padding:6px 0;color:#737373;font-size:14px;">${label}</td>
      <td style="padding:6px 0;text-align:right;color:#171717;font-size:14px;font-weight:500;">${waarde}</td>
    </tr>`;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY ontbreekt" }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const naarOverride = typeof body?.naar === "string" ? body.naar.trim() : "";

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("bdzbookings_bookings")
      .select("*, bdzbookings_acts(name, contact_naam, contact_email, aantal_personen, bezetting)")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Boeking niet gevonden" }, { status: 404 });
    }

    const b = data as any;
    const act = b.bdzbookings_acts ?? {};
    const naar = naarOverride || act.contact_email;

    if (!naar) {
      return NextResponse.json(
        { error: "Geen e-mailadres bekend bij deze act." },
        { status: 400 }
      );
    }

    const postenAct = Array.isArray(b.extra_posten)
      ? b.extra_posten.filter((p: any) => p?.voor === "act")
      : [];
    const postenTotaal = postenAct.reduce((som: number, p: any) => som + (Number(p.bedrag) || 0), 0);
    const totaal = Number(b.basistarief) + Number(b.toeslag) + postenTotaal;

    const basisUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const bevestigUrl = `${basisUrl}/bookings/bevestig/${b.id}`;

    const overMiddernacht = b.eind_datum && b.eind_datum !== b.datum;

    const html = `
<div style="background:#fafafa;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;">
    <img src="${LOGO_URL}" alt="BDZBookings" width="150" style="display:block;margin-bottom:20px;" />

    <p style="margin:0;color:#a3a3a3;font-size:13px;">Boekingsbevestiging</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#171717;">Hoi ${act.contact_naam || act.name || ""},</h1>
    <p style="margin:12px 0 0;font-size:14px;color:#525252;line-height:1.5;">
      Zoals afgestemd staat onderstaande boeking voor <strong>${act.name}</strong> ingepland.
      Loop 'm even na en bevestig onderaan, dan is het rond voor de administratie.
    </p>

    <table style="width:100%;margin-top:20px;background:#fafafa;border-radius:12px;padding:16px;border-collapse:separate;border-spacing:0 0;">
      <tbody>
        ${rij("Datum", langeDatum(b.datum))}
        ${rij(
          "Tijd",
          `${String(b.start_tijd).slice(0, 5)} – ${String(b.eind_tijd).slice(0, 5)}${
            overMiddernacht ? " (volgende dag)" : ""
          }`
        )}
        ${rij("Locatie", b.locatie)}
        ${b.speelschema ? rij("Speelschema", b.speelschema) : ""}
        ${b.gelegenheid ? rij("Gelegenheid", b.gelegenheid.charAt(0).toUpperCase() + b.gelegenheid.slice(1)) : ""}
        ${b.bezoekers ? rij("Verwacht publiek", `ca. ${b.bezoekers} personen`) : ""}
        ${
          act.aantal_personen || act.bezetting
            ? rij(
                "Bezetting",
                [
                  act.aantal_personen
                    ? `${act.aantal_personen} ${act.aantal_personen === 1 ? "persoon" : "personen"}`
                    : "",
                  act.bezetting || "",
                ]
                  .filter(Boolean)
                  .join(" — ")
              )
            : ""
        }
        ${rij("Gage", euro(Number(b.basistarief) + Number(b.toeslag)))}
        ${postenAct.map((p: any) => rij(p.omschrijving || "Extra post", euro(Number(p.bedrag)))).join("")}
        ${rij("<strong>Totaal voor jou</strong>", `<strong>${euro(totaal)}</strong>`)}
      </tbody>
    </table>

    ${
      b.opmerkingen || b.soundcheck_notitie
        ? `<div style="margin-top:16px;border:1px solid #e5e5e5;border-radius:12px;padding:16px;">
             <p style="margin:0;color:#a3a3a3;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Voor deze avond</p>
             ${b.opmerkingen ? `<p style="margin:8px 0 0;font-size:14px;color:#404040;line-height:1.5;">${b.opmerkingen}</p>` : ""}
             ${b.soundcheck_notitie ? `<p style="margin:8px 0 0;font-size:14px;color:#404040;line-height:1.5;">${b.soundcheck_notitie}</p>` : ""}
           </div>`
        : ""
    }

    <a href="${bevestigUrl}" style="display:block;margin-top:24px;background:#171717;color:#ffffff;text-align:center;padding:13px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:500;">
      Boeking bekijken en bevestigen
    </a>

    <p style="margin:20px 0 0;font-size:12px;color:#a3a3a3;line-height:1.5;">
      Klopt er iets niet? Bel of app me even, dan zetten we het recht.<br />
      Bryan de Zwart — BDZBookings
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
        from: "BDZBookings <onboarding@resend.dev>",
        to: [naar],
        subject: `Boeking ${langeDatum(b.datum)} — ${b.locatie}`,
        html,
      }),
    });

    if (!res.ok) {
      const tekst = await res.text();
      console.error("Resend gaf een fout:", tekst);
      return NextResponse.json({ error: "Versturen mislukt", detail: tekst }, { status: 500 });
    }

    return NextResponse.json({ verstuurd: true, naar });
  } catch (e) {
    console.error("Onverwachte fout bij versturen:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
