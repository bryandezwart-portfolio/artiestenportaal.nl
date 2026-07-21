// Kleine, dependency-vrije CSV-parser. Ondersteunt aanhalingstekens rond
// velden (bv. "Amsterdam, NL") en zowel , als ; als scheidingsteken.
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let delimiter: "," | ";" = ",";

  // Bepaal het scheidingsteken aan de hand van de eerste regel
  const firstLine = text.split(/\r?\n/)[0] ?? "";
  if ((firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0)) {
    delimiter = ";";
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field.trim());
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") continue;
      row.push(field.trim());
      field = "";
      if (row.some((f) => f.length > 0)) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((f) => f.length > 0)) rows.push(row);
  }

  return rows;
}

// Zet ruwe CSV-rijen om naar objecten op basis van de header-rij,
// met flexibele (Nederlandse) kolomnaam-herkenning.
export function csvToIncomeRows(text: string) {
  const rows = parseCSV(text);
  if (rows.length < 2) return { rows: [], headerFound: false };

  const header = rows[0].map((h) => h.toLowerCase().trim());

  const findCol = (...names: string[]) =>
    header.findIndex((h) => names.some((n) => h.includes(n)));

  const iDate = findCol("datum", "date");
  const iPlatform = findCol("platform");
  const iTitle = findCol("titel", "title");
  const iArtist = findCol("artiest", "artist");
  const iGross = findCol("bruto", "gross", "bedrag");
  const iLabelPct = findCol("label %", "label%", "label percent", "labelpercent");
  const iNotes = findCol("opmerking", "note");

  if (iTitle === -1 || iGross === -1) {
    return { rows: [], headerFound: false };
  }

  const parsed = rows.slice(1).map((r) => {
    const rawGross = (r[iGross] ?? "").replace(/[€\s]/g, "").replace(",", ".");
    const rawPct = iLabelPct !== -1 ? (r[iLabelPct] ?? "").replace(",", ".").replace("%", "") : "";
    let labelPercent: number | undefined = rawPct ? Number(rawPct) : undefined;
    if (labelPercent !== undefined && labelPercent <= 1) labelPercent = labelPercent * 100;

    return {
      date: iDate !== -1 ? normalizeDate(r[iDate]) : undefined,
      platform: iPlatform !== -1 ? r[iPlatform] : undefined,
      title: r[iTitle],
      artist: iArtist !== -1 ? r[iArtist] : undefined,
      grossAmount: Number(rawGross),
      labelPercent,
      notes: iNotes !== -1 ? r[iNotes] : undefined,
    };
  });

  return { rows: parsed, headerFound: true };
}

function normalizeDate(value: string): string | undefined {
  if (!value) return undefined;
  // dd-mm-jjjj of dd/mm/jjjj -> jjjj-mm-dd
  const eu = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (eu) {
    const [, d, m, y] = eu;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return value.slice(0, 10);
  return undefined;
}
