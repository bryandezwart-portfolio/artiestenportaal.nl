// Genereert een .ics kalenderfeed voor één act.
// Google Calendar / Apple Kalender kunnen hierop "abonneren" via de webcal-link,
// zodat nieuwe boekingen automatisch in de agenda van de act verschijnen.

interface CalendarEvent {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description?: string;
}

const EVENTS: CalendarEvent[] = [
  {
    uid: "booking-1@bdzbookings",
    title: "Optreden — DJ Lumo",
    start: new Date("2026-08-28T22:00:00+02:00"),
    end: new Date("2026-08-29T02:00:00+02:00"),
    location: "Club Vault, Arnhem",
    description: "Soundcheck: 21:00. Draaiboek volgt via BDZBookings.",
  },
  {
    uid: "booking-4@bdzbookings",
    title: "Optreden — DJ Lumo",
    start: new Date("2026-09-04T23:00:00+02:00"),
    end: new Date("2026-09-05T01:00:00+02:00"),
    location: "Warehouse XL, Nijmegen",
    description: "Soundcheck: 22:00. Draaiboek volgt via BDZBookings.",
  },
];

function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(text: string): string {
  return text.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
}

function buildICS(events: CalendarEvent[]): string {
  const now = toICSDate(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BDZBookings//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:BDZBookings — DJ Lumo",
    "X-WR-TIMEZONE:Europe/Amsterdam",
  ];

  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${toICSDate(e.start)}`,
      `DTEND:${toICSDate(e.end)}`,
      `SUMMARY:${escapeICS(e.title)}`,
      `LOCATION:${escapeICS(e.location)}`,
      e.description ? `DESCRIPTION:${escapeICS(e.description)}` : "",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

export async function GET() {
  const ics = buildICS(EVENTS);
  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="dj-lumo.ics"',
    },
  });
}
