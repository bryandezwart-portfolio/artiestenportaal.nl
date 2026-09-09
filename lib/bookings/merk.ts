import fs from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();

/**
 * Laadt een afbeelding als data-url, zodat react-pdf hem kan plaatsen.
 * Eerst wordt in de map public gekeken, daarna in de Supabase-bucket.
 * Het resultaat blijft in het geheugen staan, dus dit gebeurt maar één keer.
 */
const geheugen = new Map<string, string | null>();

async function laad(lokaalPad: string | null, bucketPad: string | null): Promise<string | null> {
  const sleutel = `${lokaalPad}|${bucketPad}`;
  if (geheugen.has(sleutel)) return geheugen.get(sleutel)!;

  let resultaat: string | null = null;

  if (lokaalPad) {
    try {
      const buf = await fs.readFile(path.join(process.cwd(), lokaalPad));
      resultaat = `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      // bestand staat er niet, of is op de server niet meegekopieerd
    }
  }

  if (!resultaat && bucketPad) {
    try {
      const { data } = await supabaseAdmin.storage.from("contracten").download(bucketPad);
      if (data) {
        const buf = Buffer.from(await data.arrayBuffer());
        resultaat = `data:image/png;base64,${buf.toString("base64")}`;
      }
    } catch {
      // ook niet gevonden: dan valt de pdf terug op tekst
    }
  }

  geheugen.set(sleutel, resultaat);
  return resultaat;
}

/** Het logo boven aan het contract. */
export function haalLogo() {
  return laad("public/bdzbookings-logo.png", "merk/logo.png");
}

/** Jouw eigen handtekening onder het contract. */
export function haalHandtekening() {
  return laad("public/handtekening-bryan.png", "handtekeningen/bureau.png");
}
