import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Wordt dagelijks aangeroepen door Vercel Cron (zie vercel.json).
// Stuurt een e-mail naar alle label-admins met releases die binnen 7 dagen
// gepland staan — zodat je nooit een release mist.
export async function GET(request: Request) {
  // Beveiliging: alleen Vercel's eigen cron-systeem (of iemand met het
  // geheime CRON_SECRET) mag dit endpoint aanroepen.
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  try {
    const adminClient = createAdminClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);

    const { data: releases } = await adminClient
      .from("releases")
      .select("title, release_date, artists(name)")
      .gte("release_date", today.toISOString().slice(0, 10))
      .lte("release_date", in7Days.toISOString().slice(0, 10))
      .order("release_date", { ascending: true });

    if (!releases || releases.length === 0) {
      return NextResponse.json({ success: true, sent: false, reason: "geen releases binnenkort" });
    }

    const { data: admins } = await adminClient.from("label_admins").select("user_id");
    const { data: userList } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const adminEmails = (userList?.users ?? [])
      .filter((u) => admins?.some((a) => a.user_id === u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];

    if (adminEmails.length === 0 || !process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        reason: "geen admin-e-mails of RESEND_API_KEY ontbreekt",
      });
    }

    const rows = releases
      .map(
        (r: any) =>
          `<tr><td style="padding:6px 12px;">${r.title}</td><td style="padding:6px 12px;color:#6E6E73;">${r.artists?.name ?? ""}</td><td style="padding:6px 12px;">${r.release_date}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:sans-serif;max-width:480px;">
        <h2 style="margin-bottom:4px;">Releases binnenkort</h2>
        <p style="color:#6E6E73;font-size:13px;">De volgende releases staan gepland binnen 7 dagen:</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">${rows}</table>
      </div>
    `;

    for (const email of adminEmails) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Artiestenportaal.nl <onboarding@resend.dev>",
          to: email,
          subject: `${releases.length} release(s) binnenkort`,
          html,
        }),
      });
    }

    return NextResponse.json({ success: true, sent: true, count: releases.length });
  } catch (err) {
    console.error("release-reminders cron: fout:", err);
    const message = err instanceof Error ? err.message : "Onverwachte fout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
