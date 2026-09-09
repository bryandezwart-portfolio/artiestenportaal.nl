import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const ROOD = "#C00000";
const GRIJS = "#595959";
const LIJN = "#BFBFBF";
const VULLING = "#F2F2F2";

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 46, paddingHorizontal: 44, fontSize: 9, fontFamily: "Helvetica", color: "#1A1A1A" },
  merk: { fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  logo: { height: 40, objectFit: "contain", objectPosition: "left", alignSelf: "flex-start", marginBottom: 2 },
  ondermerk: { fontSize: 8, color: GRIJS, marginTop: 2, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: ROOD },
  titel: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 14 },
  ondertitel: { fontSize: 9, color: GRIJS, fontFamily: "Helvetica-Oblique", marginTop: 3 },
  kop: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 5 },
  intro: { marginTop: 10, marginBottom: 2, lineHeight: 1.2 },
  tabel: { borderWidth: 1, borderColor: LIJN, borderBottomWidth: 0 },
  rij: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LIJN },
  links: { width: "30%", backgroundColor: VULLING, padding: 6, borderRightWidth: 1, borderRightColor: LIJN },
  rechts: { width: "70%", padding: 6 },
  label: { fontFamily: "Helvetica-Bold" },
  regel: { marginBottom: 1, lineHeight: 1.15 },
  regelBullet: { marginBottom: 1, marginLeft: 11, textIndent: -11, lineHeight: 1.15 },
  handtekeningen: { flexDirection: "row", marginTop: 16 },
  kolom: { width: "50%", paddingRight: 14 },
  veldregel: { marginBottom: 9 },
  krabbelVak: { height: 40, borderBottomWidth: 1, borderBottomColor: LIJN, marginBottom: 4, justifyContent: "flex-end" },
  krabbel: { height: 36, maxWidth: 150, objectFit: "contain", objectPosition: "left", alignSelf: "flex-start" },
  voet: { marginTop: 14, fontSize: 8, color: GRIJS, fontFamily: "Helvetica-Oblique" },
  bewijs: { marginTop: 10, padding: 6, backgroundColor: VULLING, fontSize: 7.5, color: GRIJS },
  paginanummer: { position: "absolute", bottom: 24, left: 44, right: 44, fontSize: 7.5, color: GRIJS, flexDirection: "row", justifyContent: "space-between" },
});

export type Blok = { label: string; regels: string[] };

/** De bevroren tekst van een contract: alles is al ingevuld. */
export type Inhoud = {
  titel: string;
  ondertitel: string | null;
  intro: string;
  partijen: Blok[];
  artikelen: Blok[];
};

export type Ondertekenaar = {
  naam: string;
  plaats?: string | null;
  datum?: string | null;
  /** De krabbel als data-url (image/png). */
  afbeelding?: string | null;
};

export type ContractPdfProps = {
  inhoud: Inhoud;
  /** Naam onder de rechterkolom, bijvoorbeeld "Opdrachtgever" of "DJ". */
  tegenpartij: string;
  referentie?: string;
  bureau?: Ondertekenaar | null;
  ondertekenaar?: Ondertekenaar | null;
  /** Regel met tijdstip, ip-adres en vingerafdruk, onder aan het document. */
  bewijsregel?: string | null;
  /** Het logo als data-url. Ontbreekt het, dan komt er een tekstregel te staan. */
  logo?: string | null;
};

function Regel({ tekst }: { tekst: string }) {
  const bullet = /^[a-z]\.\s/.test(tekst);
  return <Text style={bullet ? s.regelBullet : s.regel}>{tekst}</Text>;
}

function Blokken({ blokken, genummerd }: { blokken: Blok[]; genummerd?: boolean }) {
  return (
    <View style={s.tabel}>
      {blokken.map((b, i) => (
        <View key={i} style={s.rij} wrap={false}>
          <View style={s.links}>
            <Text style={s.label}>{genummerd ? `${i + 1}. ${b.label}` : b.label}</Text>
          </View>
          <View style={s.rechts}>
            {b.regels.map((r, j) => (
              <Regel key={j} tekst={r} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function Kolom({ titel, naam, wie }: { titel: string; naam: string; wie?: Ondertekenaar | null }) {
  return (
    <View style={s.kolom}>
      <Text style={s.veldregel}>Datum: {wie?.datum || "……………………………"}</Text>
      <Text style={s.veldregel}>Plaats: {wie?.plaats || "……………………………"}</Text>
      <View style={s.krabbelVak}>
        {wie?.afbeelding ? <Image style={s.krabbel} src={wie.afbeelding} /> : null}
      </View>
      <Text style={s.label}>{titel}</Text>
      <Text>{wie?.naam || naam}</Text>
    </View>
  );
}

export function ContractPdf({ inhoud, tegenpartij, referentie, bureau, ondertekenaar, bewijsregel, logo }: ContractPdfProps) {
  return (
    <Document title={inhoud.titel} author="Bryan de Zwart Bookings">
      <Page size="A4" style={s.page}>
        {logo ? (
          <Image style={s.logo} src={logo} />
        ) : (
          <Text style={s.merk}>BRYAN DE ZWART BOOKINGS</Text>
        )}
        <Text style={s.ondermerk}>Boekingskantoor voor dj’s, artiesten, bands en acts</Text>

        <Text style={s.titel}>{inhoud.titel}</Text>
        {inhoud.ondertitel ? <Text style={s.ondertitel}>{inhoud.ondertitel}</Text> : null}

        <Text style={s.kop}>Partijen</Text>
        <Blokken blokken={inhoud.partijen} />

        <Text style={s.intro}>{inhoud.intro}</Text>

        <Text style={s.kop}>De afspraken</Text>
        <Blokken blokken={inhoud.artikelen} genummerd />

        <Text style={s.kop}>Ondertekening voor akkoord</Text>
        <View style={s.handtekeningen} wrap={false}>
          <Kolom titel="Bryan de Zwart Bookings" naam="Brian Verpoorten" wie={bureau} />
          <Kolom titel={tegenpartij} naam="Naam: ……………………………" wie={ondertekenaar} />
        </View>

        {bewijsregel ? (
          <View style={s.bewijs} wrap={false}>
            <Text>{bewijsregel}</Text>
          </View>
        ) : (
          <Text style={s.voet}>Opgemaakt in tweevoud. Graag getekend retour naar info@bdzbookings.nl.</Text>
        )}

        <View style={s.paginanummer} fixed>
          <Text>{referentie ? `Referentie ${referentie}` : "Bryan de Zwart Bookings"}</Text>
          <Text render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/** Maakt de pdf als buffer, klaar om op te slaan of te mailen. */
export async function maakContractPdf(props: ContractPdfProps): Promise<Buffer> {
  return renderToBuffer(<ContractPdf {...props} />);
}
