import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LOGO = "https://www.artiestenportaal.nl/bdzbookings-logo.png";

function schoon(tekst: unknown, max = 500): string {
  return String(tekst ?? "").trim().slice(0, max);
}

function langeDatum(datum: string | null): string {
  if (!datum) return "nog niet bekend";
  return new Date(datum).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function regel(label: string, waarde: string): string {
  if (!waarde) return "";
  return `<tr><td style="padding:6px 0;color:#737373;font-size:13px;width:140px;vertical-align:top">${label}</td><td style="padding:6px 0;color:#171717;font-size:14px">${waarde}</td></tr>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const naam = schoon(body.naam, 120);
    const email = schoon(body.email, 160);
    const telefoon = schoon(body.telefoon, 40);
    const plaats = schoon(body.plaats, 120);
    const bericht = schoon(body.bericht, 3000);
    const datum = schoon(body.datum, 20) || null;
    const tijdstip = schoon(body.tijdstip, 60);
    const artiesten = schoon(body.artiesten, 300);
    const actSlug = schoon(body.act_slug, 120);

    if (!naam || !email || !telefoon || !plaats || !bericht) {
      return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
    }

    if (!email.includes("@") || email.length < 5) {
      return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }

    const db = createAdminClient();

    let actId: string | null = null;
    if (actSlug) {
      const { data: act } = await db
        .from("bdzbookings_acts")
        .select("id")
        .eq("slug", actSlug)
        .maybeSingle();
      actId = act?.id ?? null;
    }

    const { data: aanvraag, error } = await db
      .from("bdzbookings_aanvragen")
      .insert({
        naam,
        email,
        telefoon,
        datum,
        tijdstip: tijdstip || null,
        plaats,
        artiesten: artiesten || null,
        bericht,
        act_id: actId,
      })
      .select()
      .single();

    if (error) {
      console.error("Opslaan aanvraag mislukt:", error.message);
      return NextResponse.json({ error: "Opslaan mislukt" }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      const gegevens = [
        regel("Naam", naam),
        regel("E-mail", email),
        regel("Telefoon", telefoon),
        regel("Datum", langeDatum(datum)),
        regel("Tijdstip", tijdstip),
        regel("Plaats", plaats),
        regel("Artiest(en)", artiesten),
      ].join("");

      const naarMij = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <img src="${LOGO}" alt="Bryan de Zwart Bookings" style="height:40px;margin-bottom:24px">
          <h2 style="font-size:18px;color:#171717;margin:0 0 4px">Nieuwe aanvraag</h2>
          <p style="font-size:13px;color:#737373;margin:0 0 20px">Via bdzbookings.nl</p>
          <table style="width:100%;border-collapse:collapse">${gegevens}</table>
          <div style="margin-top:20px;padding:16px;background:#fafafa;border-radius:12px">
            <p style="font-size:12px;color:#737373;margin:0 0 6px">Bericht</p>
            <p style="font-size:14px;color:#171717;margin:0;white-space:pre-wrap">${bericht}</p>
          </div>
        </div>`;

      const naarAanvrager = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <img src="${LOGO}" alt="Bryan de Zwart Bookings" style="height:40px;margin-bottom:24px">
          <h2 style="font-size:18px;color:#171717;margin:0 0 12px">Bedankt voor je aanvraag</h2>
          <p style="font-size:14px;color:#404040;line-height:1.6;margin:0 0 20px">
            Hallo ${naam},<br><br>
            Je aanvraag is binnengekomen. Ik bel je binnen een werkdag om samen te kijken wat past.
            Dit is nog geen boeking — er zit dus niets vast.
          </p>
          <p style="font-size:12px;color:#737373;margin:0 0 8px">Dit heb je doorgegeven:</p>
          <table style="width:100%;border-collapse:collapse">${gegevens}</table>
          <div style="margin-top:20px;padding:16px;background:#fafafa;border-radius:12px">
            <p style="font-size:12px;color:#737373;margin:0 0 6px">Je bericht</p>
            <p style="font-size:14px;color:#171717;margin:0;white-space:pre-wrap">${bericht}</p>
          </div>
          <p style="font-size:13px;color:#737373;margin:24px 0 0">
            Met vriendelijke groet,<br>Bryan de Zwart
          </p>
        </div>`;

      const stuur = async (naarAdres: string, onderwerp: string, html: string) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Bryan de Zwart Bookings <bookings@artiestenportaal.nl>",
            to: naarAdres,
            subject: onderwerp,
            html,
          }),
        });
        if (!res.ok) console.error("Mail mislukt:", await res.text());
      };

      await stuur(
        process.env.BDZ_AANVRAAG_EMAIL || "bdz-ventures@protonmail.com",
        `Aanvraag van ${naam} — ${plaats}`,
        naarMij
      );
      await stuur(email, "Je aanvraag is binnengekomen", naarAanvrager);
    }

    return NextResponse.json({ ok: true, id: aanvraag.id });
  } catch (e) {
    console.error("Onverwachte fout bij aanvraag:", e);
    return NextResponse.json({ error: "Onverwachte fout" }, { status: 500 });
  }
}
