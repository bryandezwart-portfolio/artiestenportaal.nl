// Automatisch gegenereerd uit de Word-sjablonen van BDZBookings.
// Wil je de tekst aanpassen? Pas dit bestand aan en verhoog SJABLOON_VERSIE,
// zodat je later kunt zien met welke versie een contract is getekend.

export const SJABLOON_VERSIE = 1;

/**
 * Jouw bedrijfsgegevens. Verhuis je of verandert de naam, dan pas je het
 * hier op één plek aan en staat het in alle acht de overeenkomsten goed.
 */
export const BOEKINGSKANTOOR: string[] = [
  "BDZ Ventures, handelend onder de naam Bryan de Zwart Bookings",
  "De Nieuwe Erven 3, unit 13617, 5431 NV Cuijk",
  "KvK 98283731, btw NL005322714B67",
  "085 060 6460, info@bdzbookings.nl",
  "Hierna: “BDZBookings”;",
];

export type Partij = "klant" | "act";
export type ActType = "dj" | "artiest" | "band" | "act";

export type Blok = { label: string; regels: string[] };

export type Sjabloon = {
  id: string;
  partij: Partij;
  type: ActType;
  titel: string;
  ondertitel: string | null;
  intro: string;
  partijen: Blok[];
  artikelen: Blok[];
};

/** Wie mag welk veld invullen. "bureau" = alleen jij. */
export const VELDEN: Record<string, { label: string; eigenaar: "bureau" | "klant" | "act" }> =
{
  "datum": {
    "label": "Datum optreden",
    "eigenaar": "bureau"
  },
  "gelegenheid": {
    "label": "Soort gelegenheid",
    "eigenaar": "bureau"
  },
  "bezoekers": {
    "label": "Verwacht aantal gasten",
    "eigenaar": "bureau"
  },
  "binnen_buiten": {
    "label": "Binnen of buiten",
    "eigenaar": "bureau"
  },
  "aankomst": {
    "label": "Wat de Act doet — Aankomst",
    "eigenaar": "bureau"
  },
  "start_tijd": {
    "label": "Aanvang",
    "eigenaar": "bureau"
  },
  "eind_tijd": {
    "label": "Einde",
    "eigenaar": "bureau"
  },
  "reistijd": {
    "label": "Reistijd in minuten",
    "eigenaar": "bureau"
  },
  "locatie_naam": {
    "label": "Naam locatie",
    "eigenaar": "bureau"
  },
  "locatie_adres": {
    "label": "Adres locatie",
    "eigenaar": "bureau"
  },
  "locatie_plaats": {
    "label": "Postcode en plaats locatie",
    "eigenaar": "bureau"
  },
  "locatie_contact": {
    "label": "Contactpersoon locatie",
    "eigenaar": "bureau"
  },
  "gage": {
    "label": "Gage exclusief btw",
    "eigenaar": "bureau"
  },
  "commissie": {
    "label": "Bemiddelingskosten 15%",
    "eigenaar": "bureau"
  },
  "onkosten": {
    "label": "Reis- en onkosten",
    "eigenaar": "bureau"
  },
  "totaal": {
    "label": "Totaalbedrag inclusief btw",
    "eigenaar": "bureau"
  },
  "subtotaal": {
    "label": "Overeengekomen bedrag exclusief btw",
    "eigenaar": "bureau"
  },
  "btw": {
    "label": "Btw-bedrag",
    "eigenaar": "bureau"
  },
  "btw_pct": {
    "label": "Btw-percentage",
    "eigenaar": "bureau"
  },
  "opdrachtgever_naam": {
    "label": "Naam opdrachtgever",
    "eigenaar": "bureau"
  },
  "klant_naam": {
    "label": "Naam klant",
    "eigenaar": "bureau"
  },
  "klant_bedrijf": {
    "label": "Bedrijfsnaam (leeg laten bij een particulier)",
    "eigenaar": "klant"
  },
  "klant_adres": {
    "label": "Adres klant",
    "eigenaar": "klant"
  },
  "klant_plaats": {
    "label": "Postcode en plaats klant",
    "eigenaar": "klant"
  },
  "klant_contact": {
    "label": "Naam of contactpersoon",
    "eigenaar": "klant"
  },
  "klant_telefoon": {
    "label": "Telefoon klant",
    "eigenaar": "klant"
  },
  "klant_email": {
    "label": "E-mail klant",
    "eigenaar": "klant"
  },
  "act_naam": {
    "label": "Naam van de act",
    "eigenaar": "bureau"
  },
  "act_eigennaam": {
    "label": "Eigen naam",
    "eigenaar": "act"
  },
  "act_soort": {
    "label": "Soort act",
    "eigenaar": "bureau"
  },
  "act_adres": {
    "label": "Adres act",
    "eigenaar": "act"
  },
  "act_plaats": {
    "label": "Postcode en plaats act",
    "eigenaar": "act"
  },
  "act_contact": {
    "label": "Contactpersoon act",
    "eigenaar": "act"
  },
  "act_telefoon": {
    "label": "Telefoon act",
    "eigenaar": "act"
  },
  "act_email": {
    "label": "E-mail act",
    "eigenaar": "act"
  },
  "indien_bedrijf": {
    "label": "KvK-nummer klant",
    "eigenaar": "klant"
  },
  "geluidscheck": {
    "label": "Tijden — Geluidscheck",
    "eigenaar": "bureau"
  },
  "speeltijd_in_totaal": {
    "label": "Tijden — Speeltijd in totaal",
    "eigenaar": "bureau"
  },
  "uur_in": {
    "label": "Tijden — aantal blokken",
    "eigenaar": "bureau"
  },
  "sfeer": {
    "label": "Muziek — gewenste stijl of sfeer",
    "eigenaar": "bureau"
  },
  "speciaal_moment": {
    "label": "Programma — speciaal moment",
    "eigenaar": "bureau"
  },
  "auto_van_de_dj_binnen": {
    "label": "Parkeerplek — afstand in meters",
    "eigenaar": "bureau"
  },
  "sfeerverlichting_draadloze_microfoon_voor_speeches": {
    "label": "Wat de DJ verzorgt — extra's",
    "eigenaar": "bureau"
  },
  "speeltijd_wordt_achteraf_gefactureerd_tegen": {
    "label": "Wijzigingen — tarief per extra half uur",
    "eigenaar": "bureau"
  },
  "aanvullende_afspraken": {
    "label": "Aanvullende afspraken — regel 1",
    "eigenaar": "bureau"
  },
  "aanvullende_afspraken_2": {
    "label": "Aanvullende afspraken — regel 2",
    "eigenaar": "bureau"
  },
  "aanvullende_afspraken_3": {
    "label": "Aanvullende afspraken — regel 3",
    "eigenaar": "bureau"
  },
  "artiest_technicus_begeleiding": {
    "label": "Artiest — artiest, technicus, begeleiding",
    "eigenaar": "act"
  },
  "aankomst_artiest": {
    "label": "Tijden — Aankomst Artiest",
    "eigenaar": "bureau"
  },
  "optreden": {
    "label": "Tijden — Optreden",
    "eigenaar": "bureau"
  },
  "van": {
    "label": "Wat de Act doet — van",
    "eigenaar": "bureau"
  },
  "optreden_op_dezelfde_avond_binnen": {
    "label": "Programma — De Artiest treedt live op en doet geen dubbel optreden op dezelfde avond binnen",
    "eigenaar": "bureau"
  },
  "b_minimaal": {
    "label": "Geluid — aantal microfoons",
    "eigenaar": "bureau"
  },
  "en": {
    "label": "Geluid — aantal monitors",
    "eigenaar": "bureau"
  },
  "of_vrij_speelvlak_van_minimaal": {
    "label": "Podium — breedte in meters",
    "eigenaar": "bureau"
  },
  "vrij_speelvlak_van_minimaal_x": {
    "label": "Podium — diepte in meters",
    "eigenaar": "bureau"
  },
  "kleedruimte_met_spiegel_stopcontact_en": {
    "label": "Kleedruimte — aantal stoelen",
    "eigenaar": "bureau"
  },
  "5_uur_een_maaltijd_voor": {
    "label": "Maaltijd — aantal personen",
    "eigenaar": "bureau"
  },
  "overig": {
    "label": "Wat de Artiest verzorgt — Overig",
    "eigenaar": "bureau"
  },
  "aantal_bandleden": {
    "label": "Band — Aantal bandleden",
    "eigenaar": "act"
  },
  "aantal_crew": {
    "label": "Band — Aantal crew",
    "eigenaar": "act"
  },
  "totaal_aanwezig": {
    "label": "Band — Totaal aanwezig",
    "eigenaar": "act"
  },
  "na_de_band": {
    "label": "Optreden — na de Band?",
    "eigenaar": "bureau"
  },
  "aankomst_crew_en_inladen": {
    "label": "Tijden — Aankomst crew en inladen",
    "eigenaar": "bureau"
  },
  "opbouw_geluid_en_licht": {
    "label": "Tijden — Opbouw geluid en licht",
    "eigenaar": "bureau"
  },
  "eten": {
    "label": "Tijden — Eten",
    "eigenaar": "bureau"
  },
  "zaal_open": {
    "label": "Tijden — Zaal open",
    "eigenaar": "bureau"
  },
  "van_minuten_van": {
    "label": "Tijden — van minuten, van",
    "eigenaar": "bureau"
  },
  "van_minuten_van_tot": {
    "label": "Tijden — van minuten, van tot",
    "eigenaar": "bureau"
  },
  "direct_na_het_optreden_uiterlijk": {
    "label": "Tijden — direct na het optreden, uiterlijk",
    "eigenaar": "bureau"
  },
  "a_podium_minimaal": {
    "label": "Podium — breedte in meters",
    "eigenaar": "bureau"
  },
  "a_podium_minimaal_meter_breed": {
    "label": "Podium — diepte in meters",
    "eigenaar": "bureau"
  },
  "meter_breed_meter_diep_en": {
    "label": "Podium — hoogte in meters",
    "eigenaar": "bureau"
  },
  "de_hele_avond_op_maximaal": {
    "label": "Podium en laden/lossen — de bus of aanhanger kan de hele avond op maximaal",
    "eigenaar": "bureau"
  },
  "zonder_overleg_dan_brengt_bdzbookings": {
    "label": "Podium en laden/lossen — e. Ontbreekt die hulp zonder overleg, dan brengt BDZBookings €",
    "eigenaar": "bureau"
  },
  "16a_binnen": {
    "label": "Stroom — afstand tot podium in meters",
    "eigenaar": "bureau"
  },
  "buurt_van_het_podium_met": {
    "label": "Kleedkamer en catering — a. Een afsluitbare, verwarmde en verlichte kleedkamer in de buurt van het podium, met",
    "eigenaar": "bureau"
  },
  "met_stoelen_spiegel_stopcontact_en": {
    "label": "Kleedkamer en catering — a. Een afsluitbare, verwarmde en verlichte kleedkamer in de buurt van het podium, met stoelen, spiegel, stopcontact en",
    "eigenaar": "bureau"
  },
  "in_de_kleedkamer": {
    "label": "Kleedkamer en catering — in de kleedkamer",
    "eigenaar": "bureau"
  },
  "kratten_fris_en": {
    "label": "Kleedkamer en catering — kratten fris en",
    "eigenaar": "bureau"
  },
  "c_een_warme_maaltijd_voor": {
    "label": "Kleedkamer en catering — c. Een warme maaltijd voor",
    "eigenaar": "bureau"
  },
  "warme_maaltijd_voor_personen_rond": {
    "label": "Catering — aantal personen",
    "eigenaar": "bureau"
  },
  "bijzonderheden_of_dieetwensen": {
    "label": "Kleedkamer en catering — bijzonderheden of dieetwensen",
    "eigenaar": "bureau"
  },
  "maximaal": {
    "label": "Gastenlijst — Maximaal",
    "eigenaar": "bureau"
  },
  "aantal_personen_dat_meekomt": {
    "label": "Act — Aantal personen dat meekomt",
    "eigenaar": "act"
  },
  "leeftijd_publiek": {
    "label": "Wat de Act doet — Leeftijd publiek",
    "eigenaar": "bureau"
  },
  "aantal_blokken": {
    "label": "Wat de Act doet — Aantal blokken",
    "eigenaar": "bureau"
  },
  "start_eerste_blok": {
    "label": "Wat de Act doet — Start eerste blok",
    "eigenaar": "bureau"
  },
  "einde": {
    "label": "Wat de Act doet — Einde",
    "eigenaar": "bureau"
  },
  "korte_omschrijving_van_de_act": {
    "label": "Wat de Act doet — Korte omschrijving van de act",
    "eigenaar": "bureau"
  },
  "de_act_doet": {
    "label": "Wat de Act doet — korte omschrijving",
    "eigenaar": "bureau"
  },
  "ruimte_of_speelvlak_van_minimaal": {
    "label": "Speelvlak — breedte in meters",
    "eigenaar": "bureau"
  },
  "of_speelvlak_van_minimaal_x": {
    "label": "Speelvlak — diepte in meters",
    "eigenaar": "bureau"
  },
  "b_vrije_hoogte_van_minimaal": {
    "label": "Vrije hoogte in meters",
    "eigenaar": "bureau"
  },
  "d_stroom": {
    "label": "Stroom — aantal groepen",
    "eigenaar": "bureau"
  },
  "4_uur_een_maaltijd_voor": {
    "label": "Maaltijd — aantal personen",
    "eigenaar": "bureau"
  },
  "e_opdrachtgever_zorgt_voor_minimaal": {
    "label": "Vuur — aantal brandblussers",
    "eigenaar": "bureau"
  },
  "blok_wordt_achteraf_gefactureerd_tegen": {
    "label": "Wijzigingen — tarief per extra blok",
    "eigenaar": "bureau"
  },
  "wordt_achteraf_gefactureerd_tegen_per": {
    "label": "Wijzigingen — lengte extra blok in minuten",
    "eigenaar": "bureau"
  },
  "na_het_optreden_op_rekening": {
    "label": "Rekeningnummer",
    "eigenaar": "act"
  },
  "op_rekening_t_n_v": {
    "label": "Ten name van",
    "eigenaar": "act"
  },
  "c_kvk_nummer": {
    "label": "KvK-nummer",
    "eigenaar": "act"
  },
  "btw_nummer": {
    "label": "Btw-nummer",
    "eigenaar": "act"
  },
  "niet_op_dezelfde_avond_binnen": {
    "label": "Programma — De Artiest treedt niet op dezelfde avond binnen",
    "eigenaar": "bureau"
  },
  "adres_contactpersoon": {
    "label": "Band — Adres contactpersoon",
    "eigenaar": "act"
  },
  "e_mail": {
    "label": "Act — E-mail",
    "eigenaar": "act"
  },
  "aankomst_en_inladen": {
    "label": "Tijden — Aankomst en inladen",
    "eigenaar": "bureau"
  },
  "wensen_voor_kleedkamer_en_catering": {
    "label": "Wat de Band verzorgt — Wensen voor kleedkamer en catering",
    "eigenaar": "bureau"
  },
  "aanwezig_vanaf": {
    "label": "Wat de Act doet — Aanwezig vanaf",
    "eigenaar": "bureau"
  },
  "korte_omschrijving": {
    "label": "Wat de Act doet — Korte omschrijving",
    "eigenaar": "bureau"
  },
  "benodigde_ruimte": {
    "label": "Wat de Act meebrengt — Benodigde ruimte",
    "eigenaar": "bureau"
  },
  "de_act_meebrengt": {
    "label": "Wat de Act meebrengt — overig",
    "eigenaar": "bureau"
  },
  "x_meter_vrije_hoogte": {
    "label": "Benodigde ruimte — diepte in meters",
    "eigenaar": "bureau"
  },
  "benodigde_stroom": {
    "label": "Wat de Act meebrengt — Benodigde stroom",
    "eigenaar": "bureau"
  }
};

export const SJABLONEN: Sjabloon[] =
[
  {
    "id": "klant-dj",
    "partij": "klant",
    "type": "dj",
    "titel": "Boekingsovereenkomst DJ",
    "ondertitel": null,
    "intro": "BDZBookings boekt de DJ voor Opdrachtgever en regelt de afspraken en de betaling. Opdrachtgever en BDZBookings spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Opdrachtgever:",
        "regels": [
          "Naam / contactpersoon: {{klant_contact}}",
          "Bedrijf (indien van toepassing): {{klant_bedrijf}}",
          "Adres: {{klant_adres}}",
          "Postcode en plaats: {{klant_plaats}}",
          "Telefoon: {{klant_telefoon}} E-mail: {{klant_email}}",
          "KvK (indien bedrijf): {{indien_bedrijf}}",
          "Hierna: “Opdrachtgever”;"
        ]
      },
      {
        "label": "Geboekte act:",
        "regels": [
          "Artiestennaam: {{act_naam}}",
          "Hierna: “de DJ”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Verwacht aantal gasten: {{bezoekers}}",
          "Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aankomst en opbouw: {{aankomst}} (minimaal 60 minuten voor aanvang)",
          "Geluidscheck: {{geluidscheck}}",
          "Aanvang: {{start_tijd}}  Einde: {{eind_tijd}}",
          "Speeltijd in totaal: {{speeltijd_in_totaal}} uur, in {{uur_in}} blok(ken)",
          "Afbouw start direct na het laatste nummer;"
        ]
      },
      {
        "label": "Muziek:",
        "regels": [
          "Gewenste stijl / sfeer: {{sfeer}}",
          "De DJ bepaalt de opbouw van de avond en de volgorde van de muziek, binnen de afgesproken stijl;",
          "Opdrachtgever levert uiterlijk 7 dagen vooraf een lijst met maximaal 15 wensen en eventuele nummers die absoluut niet gedraaid mogen worden;",
          "Verzoeknummers uit het publiek zijn welkom, maar de DJ beslist of ze passen;",
          "Openingsdans / speciaal moment: {{speciaal_moment}}"
        ]
      },
      {
        "label": "Bedrag:",
        "regels": [
          "Totaalbedrag inclusief btw: € {{totaal}}",
          "Waarvan btw ({{btw_pct}}%): € {{btw}}",
          "Dit is het bedrag dat Opdrachtgever betaalt. De gage van de DJ, de bemiddeling door BDZBookings en de eventuele reis- en onkosten zitten hierin;",
          "BDZBookings factureert dit bedrag; Opdrachtgever hoeft niets rechtstreeks met de act af te rekenen;"
        ]
      },
      {
        "label": "Betaling:",
        "regels": [
          "a. Opdrachtgever ontvangt van BDZBookings één factuur voor het totaalbedrag;",
          "b. Het volledige bedrag staat uiterlijk 14 dagen vóór de datum van het optreden op de rekening van BDZBookings. Wordt er binnen 14 dagen voor het optreden geboekt, dan geldt: direct na ontvangst van de factuur;",
          "c. Betaling gaat per bankoverschrijving of via de betaallink bij de factuur. Contant afrekenen op locatie is alleen mogelijk als dat vooraf schriftelijk is afgesproken;",
          "d. Bij te late betaling is Opdrachtgever de wettelijke (handels)rente en de incassokosten verschuldigd;"
        ]
      },
      {
        "label": "Wat Opdrachtgever regelt:",
        "regels": [
          "a. Een vrije en droge opstelplek van minimaal 2 x 1,5 meter, met een stevige tafel of dj-booth van ongeveer 90 cm hoog, tenzij anders afgesproken;",
          "b. Bij een optreden buiten: een overkapping die de apparatuur droog houdt, ook bij zijwind;",
          "c. Minimaal 1 vrije, geaarde groep van 230V / 16A binnen 5 meter van de opstelplek;",
          "d. Een parkeerplek voor de auto van de DJ binnen {{auto_van_de_dj_binnen}} meter van de ingang, en de mogelijkheid om daar te laden en te lossen;",
          "e. Vrije doorgang bij het in- en uitladen (geen trappen zonder overleg vooraf);",
          "f. Gedurende de hele avond frisdrank, koffie of water voor de DJ, en bij een optreden van meer dan 5 uur ook een maaltijd;",
          "g. Een plek waar de DJ zijn jas en spullen veilig kan opbergen;"
        ]
      },
      {
        "label": "Wat de DJ meebrengt:",
        "regels": [
          "Geluidsinstallatie: door de DJ / door Opdrachtgever (doorhalen wat niet van toepassing is)",
          "Licht: door de DJ / door Opdrachtgever (doorhalen wat niet van toepassing is)",
          "Draaigedeelte (controller, laptop, koptelefoon, microfoon) brengt de DJ altijd zelf mee;",
          "Extra's (rookmachine, sfeerverlichting, draadloze microfoon voor speeches): {{sfeerverlichting_draadloze_microfoon_voor_speeches}}",
          "Wordt de huisinstallatie gebruikt, dan levert Opdrachtgever vooraf de specificaties aan en zorgt hij dat de installatie werkt en aangesloten is;"
        ]
      },
      {
        "label": "Geluid:",
        "regels": [
          "a. Opdrachtgever meldt vooraf of er een geluidsbegrenzer hangt of dat er een maximum aantal decibel geldt, en hoe hoog dat maximum is;",
          "b. De DJ blijft binnen de norm die de gemeente of de locatie stelt;",
          "c. Is er niet vooraf gemeld dat er een begrenzer hangt en valt daardoor het geluid uit, dan is dat geen reden om de gage te verlagen;"
        ]
      },
      {
        "label": "Aanspreekpunt:",
        "regels": [
          "a. Bryan de Zwart is het aanspreekpunt vóór, tijdens en na de boeking, ook op de avond zelf: 085 060 6460 / info@bdzbookings.nl;",
          "b. Opdrachtgever wijst één contactpersoon aan die op de dag zelf aanwezig en bereikbaar is;",
          "c. Vragen of wijzigingen lopen via BDZBookings en niet rechtstreeks met de act;"
        ]
      },
      {
        "label": "Wijzigingen:",
        "regels": [
          "a. Wijzigingen in datum, tijden, locatie of programma gelden alleen als BDZBookings ze schriftelijk of per e-mail heeft bevestigd;",
          "b. Vraagt Opdrachtgever op de dag zelf om langer door te gaan, dan mag dat alleen als de act akkoord is. Extra speeltijd wordt achteraf gefactureerd tegen € {{speeltijd_wordt_achteraf_gefactureerd_tegen}} per half uur;"
        ]
      },
      {
        "label": "Annulering door Opdrachtgever:",
        "regels": [
          "Zegt Opdrachtgever de boeking af, dan geldt:",
          "a. meer dan 60 dagen vóór het optreden: 25% van het totaalbedrag;",
          "b. 60 tot en met 31 dagen vóór het optreden: 50% van het totaalbedrag;",
          "c. 30 tot en met 15 dagen vóór het optreden: 75% van het totaalbedrag;",
          "d. 14 dagen of korter vóór het optreden: 100% van het totaalbedrag;",
          "e. Al gemaakte kosten (bijvoorbeeld huur van apparatuur of reeds geboekt vervoer) worden altijd volledig doorbelast;",
          "f. Afzeggen doet Opdrachtgever schriftelijk of per e-mail aan info@bdzbookings.nl. De datum van ontvangst telt;"
        ]
      },
      {
        "label": "Uitval van de DJ:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan meldt BDZBookings dit direct;",
          "b. BDZBookings zorgt dan in overleg voor een vervanger van vergelijkbaar niveau, of partijen zoeken samen een nieuwe datum;",
          "c. Lukt geen van beide, dan wordt de overeenkomst ontbonden en betaalt BDZBookings het al betaalde bedrag binnen 14 dagen volledig terug;",
          "d. Verdere schadevergoeding is in dat geval niet verschuldigd;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (denk aan extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) treden partijen in overleg over een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten en betaalt Opdrachtgever de tot dan toe daadwerkelijk gemaakte kosten;",
          "c. Een tegenvallend aantal bezoekers, slechte kaartverkoop of een gewijzigd programma is geen overmacht;"
        ]
      },
      {
        "label": "Veiligheid en aansprakelijkheid:",
        "regels": [
          "a. Opdrachtgever zorgt voor een veilige werkplek en houdt zich aan de regels rond veiligheid, brandveiligheid en arbeidsomstandigheden;",
          "b. Opdrachtgever is aansprakelijk voor schade aan personen of spullen van de act, veroorzaakt door Opdrachtgever, zijn medewerkers of het publiek, en is daarvoor verzekerd;",
          "c. De act is verzekerd voor eigen apparatuur en heeft een bedrijfsaansprakelijkheidsverzekering;",
          "d. De act mag stoppen zonder de gage te verliezen als de veiligheid niet gewaarborgd is, bijvoorbeeld bij agressie, vechtpartijen of overmatig gedrang bij het podium;",
          "e. Publiek komt niet op het podium en niet bij de apparatuur. Drankjes horen niet op of naast de apparatuur;"
        ]
      },
      {
        "label": "Muziekrechten:",
        "regels": [
          "a. Opdrachtgever meldt het evenement aan bij Buma/Stemra en Sena en betaalt de verschuldigde vergoedingen;",
          "b. BDZBookings en de act zijn hiervoor niet aansprakelijk;"
        ]
      },
      {
        "label": "Foto's, video en promotie:",
        "regels": [
          "a. Opdrachtgever mag naam, foto en logo van de act gebruiken om het optreden aan te kondigen;",
          "b. BDZBookings en de act mogen foto's en korte video's van het optreden gebruiken op hun eigen website en social media, tenzij Opdrachtgever hier vooraf schriftelijk bezwaar tegen maakt;",
          "c. Een volledige opname van het optreden uitzenden, streamen of verkopen mag alleen met schriftelijke toestemming vooraf;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Is een bepaling niet geldig, dan blijft de rest gewoon gelden en vervangen partijen die bepaling door een bepaling die er zo dicht mogelijk bij komt;",
          "c. Op deze overeenkomst is Nederlands recht van toepassing;",
          "d. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "e. Is deze overeenkomst niet binnen 14 dagen ondertekend retour, dan vervalt de optie op de datum en is BDZBookings vrij om de datum aan iemand anders aan te bieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "klant-artiest",
    "partij": "klant",
    "type": "artiest",
    "titel": "Boekingsovereenkomst Artiest",
    "ondertitel": null,
    "intro": "BDZBookings boekt de Artiest voor Opdrachtgever en regelt de afspraken en de betaling. Opdrachtgever en BDZBookings spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Opdrachtgever:",
        "regels": [
          "Naam / contactpersoon: {{klant_contact}}",
          "Bedrijf (indien van toepassing): {{klant_bedrijf}}",
          "Adres: {{klant_adres}}",
          "Postcode en plaats: {{klant_plaats}}",
          "Telefoon: {{klant_telefoon}} E-mail: {{klant_email}}",
          "KvK (indien bedrijf): {{indien_bedrijf}}",
          "Hierna: “Opdrachtgever”;"
        ]
      },
      {
        "label": "Geboekte act:",
        "regels": [
          "Artiestennaam: {{act_naam}}",
          "Aantal personen dat meekomt (artiest, technicus, begeleiding): {{artiest_technicus_begeleiding}}",
          "Hierna: “de Artiest”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Verwacht aantal gasten: {{bezoekers}}",
          "Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aankomst Artiest: {{aankomst_artiest}}",
          "Geluidscheck: {{geluidscheck}} (podium is dan vrij en het geluid staat klaar)",
          "Optreden: {{optreden}} set(s) van {{van}} minuten",
          "Aanvang eerste set: {{start_tijd}}  Einde laatste set: {{eind_tijd}}",
          "De Artiest is uiterlijk 45 minuten voor aanvang aanwezig, tenzij anders afgesproken;"
        ]
      },
      {
        "label": "Programma:",
        "regels": [
          "Repertoire en volgorde bepaalt de Artiest;",
          "Openingsdans / speciaal moment: {{speciaal_moment}}",
          "Werkt de Artiest met eigen tracks of backing tracks, dan levert hij die zelf aan;",
          "De Artiest treedt live op en doet geen dubbel optreden op dezelfde avond binnen {{optreden_op_dezelfde_avond_binnen}} km, tenzij vooraf gemeld;"
        ]
      },
      {
        "label": "Bedrag:",
        "regels": [
          "Totaalbedrag inclusief btw: € {{totaal}}",
          "Waarvan btw ({{btw_pct}}%): € {{btw}}",
          "Dit is het bedrag dat Opdrachtgever betaalt. De gage van de Artiest, de bemiddeling door BDZBookings en de eventuele reis- en onkosten zitten hierin;",
          "BDZBookings factureert dit bedrag; Opdrachtgever hoeft niets rechtstreeks met de act af te rekenen;"
        ]
      },
      {
        "label": "Betaling:",
        "regels": [
          "a. Opdrachtgever ontvangt van BDZBookings één factuur voor het totaalbedrag;",
          "b. Het volledige bedrag staat uiterlijk 14 dagen vóór de datum van het optreden op de rekening van BDZBookings. Wordt er binnen 14 dagen voor het optreden geboekt, dan geldt: direct na ontvangst van de factuur;",
          "c. Betaling gaat per bankoverschrijving of via de betaallink bij de factuur. Contant afrekenen op locatie is alleen mogelijk als dat vooraf schriftelijk is afgesproken;",
          "d. Bij te late betaling is Opdrachtgever de wettelijke (handels)rente en de incassokosten verschuldigd;"
        ]
      },
      {
        "label": "Wat Opdrachtgever regelt:",
        "regels": [
          "a. Een deugdelijke geluidsinstallatie die past bij de zaal en het aantal gasten, inclusief een technicus die de installatie bedient, tenzij hieronder anders is ingevuld;",
          "b. Minimaal {{b_minimaal}} draadloze handmicrofoon(s) en {{en}} monitor(s) op het podium;",
          "c. Een podium of vrij speelvlak van minimaal {{of_vrij_speelvlak_van_minimaal}} x {{vrij_speelvlak_van_minimaal_x}} meter, vlak, stabiel en droog;",
          "d. Bij een optreden buiten: een overdekt podium, ook aan de zijkant, en droge stroomvoorziening;",
          "e. Minimaal 1 vrije, geaarde groep van 230V / 16A bij het podium;",
          "f. Een afsluitbare, verwarmde kleedruimte met spiegel, stopcontact en {{kleedruimte_met_spiegel_stopcontact_en}} stoel(en) in de buurt van het podium;",
          "g. Frisdrank, koffie en water, en bij een aanwezigheid van meer dan 5 uur een maaltijd voor {{5_uur_een_maaltijd_voor}} personen;",
          "h. Parkeergelegenheid vlakbij en de mogelijkheid om te laden en te lossen;"
        ]
      },
      {
        "label": "Wat de Artiest meebrengt:",
        "regels": [
          "Eigen geluidsinstallatie: ja / nee (doorhalen wat niet van toepassing is)",
          "Eigen technicus: ja / nee",
          "Eigen instrumenten, microfoon en muziekbestanden;",
          "Overig: {{overig}}"
        ]
      },
      {
        "label": "Geluid:",
        "regels": [
          "a. Opdrachtgever meldt vooraf of er een geluidsbegrenzer of een maximum aantal decibel geldt;",
          "b. De Artiest blijft binnen de norm die de gemeente of de locatie stelt;",
          "c. Is er niet vooraf gemeld dat er een begrenzer hangt, dan is een uitvallend optreden daardoor geen reden om de gage te verlagen;"
        ]
      },
      {
        "label": "Aanspreekpunt:",
        "regels": [
          "a. Bryan de Zwart is het aanspreekpunt vóór, tijdens en na de boeking, ook op de avond zelf: 085 060 6460 / info@bdzbookings.nl;",
          "b. Opdrachtgever wijst één contactpersoon aan die op de dag zelf aanwezig en bereikbaar is;",
          "c. Vragen of wijzigingen lopen via BDZBookings en niet rechtstreeks met de act;"
        ]
      },
      {
        "label": "Wijzigingen:",
        "regels": [
          "a. Wijzigingen in datum, tijden, locatie of programma gelden alleen als BDZBookings ze schriftelijk of per e-mail heeft bevestigd;",
          "b. Vraagt Opdrachtgever op de dag zelf om langer door te gaan, dan mag dat alleen als de act akkoord is. Extra speeltijd wordt achteraf gefactureerd tegen € {{speeltijd_wordt_achteraf_gefactureerd_tegen}} per half uur;"
        ]
      },
      {
        "label": "Annulering door Opdrachtgever:",
        "regels": [
          "Zegt Opdrachtgever de boeking af, dan geldt:",
          "a. meer dan 60 dagen vóór het optreden: 25% van het totaalbedrag;",
          "b. 60 tot en met 31 dagen vóór het optreden: 50% van het totaalbedrag;",
          "c. 30 tot en met 15 dagen vóór het optreden: 75% van het totaalbedrag;",
          "d. 14 dagen of korter vóór het optreden: 100% van het totaalbedrag;",
          "e. Al gemaakte kosten (bijvoorbeeld huur van apparatuur of reeds geboekt vervoer) worden altijd volledig doorbelast;",
          "f. Afzeggen doet Opdrachtgever schriftelijk of per e-mail aan info@bdzbookings.nl. De datum van ontvangst telt;"
        ]
      },
      {
        "label": "Uitval van de Artiest:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan meldt BDZBookings dit direct;",
          "b. BDZBookings zorgt dan in overleg voor een vervanger van vergelijkbaar niveau, of partijen zoeken samen een nieuwe datum;",
          "c. Lukt geen van beide, dan wordt de overeenkomst ontbonden en betaalt BDZBookings het al betaalde bedrag binnen 14 dagen volledig terug;",
          "d. Verdere schadevergoeding is in dat geval niet verschuldigd;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (denk aan extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) treden partijen in overleg over een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten en betaalt Opdrachtgever de tot dan toe daadwerkelijk gemaakte kosten;",
          "c. Een tegenvallend aantal bezoekers, slechte kaartverkoop of een gewijzigd programma is geen overmacht;"
        ]
      },
      {
        "label": "Veiligheid en aansprakelijkheid:",
        "regels": [
          "a. Opdrachtgever zorgt voor een veilige werkplek en houdt zich aan de regels rond veiligheid, brandveiligheid en arbeidsomstandigheden;",
          "b. Opdrachtgever is aansprakelijk voor schade aan personen of spullen van de act, veroorzaakt door Opdrachtgever, zijn medewerkers of het publiek, en is daarvoor verzekerd;",
          "c. De act is verzekerd voor eigen apparatuur en heeft een bedrijfsaansprakelijkheidsverzekering;",
          "d. De act mag stoppen zonder de gage te verliezen als de veiligheid niet gewaarborgd is, bijvoorbeeld bij agressie, vechtpartijen of overmatig gedrang bij het podium;",
          "e. Publiek komt niet op het podium en niet bij de apparatuur. Drankjes horen niet op of naast de apparatuur;"
        ]
      },
      {
        "label": "Muziekrechten:",
        "regels": [
          "a. Opdrachtgever meldt het evenement aan bij Buma/Stemra en Sena en betaalt de verschuldigde vergoedingen;",
          "b. BDZBookings en de act zijn hiervoor niet aansprakelijk;"
        ]
      },
      {
        "label": "Foto's, video en promotie:",
        "regels": [
          "a. Opdrachtgever mag naam, foto en logo van de act gebruiken om het optreden aan te kondigen;",
          "b. BDZBookings en de act mogen foto's en korte video's van het optreden gebruiken op hun eigen website en social media, tenzij Opdrachtgever hier vooraf schriftelijk bezwaar tegen maakt;",
          "c. Een volledige opname van het optreden uitzenden, streamen of verkopen mag alleen met schriftelijke toestemming vooraf;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Is een bepaling niet geldig, dan blijft de rest gewoon gelden en vervangen partijen die bepaling door een bepaling die er zo dicht mogelijk bij komt;",
          "c. Op deze overeenkomst is Nederlands recht van toepassing;",
          "d. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "e. Is deze overeenkomst niet binnen 14 dagen ondertekend retour, dan vervalt de optie op de datum en is BDZBookings vrij om de datum aan iemand anders aan te bieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "klant-band",
    "partij": "klant",
    "type": "band",
    "titel": "Boekingsovereenkomst Band",
    "ondertitel": null,
    "intro": "BDZBookings boekt de Band voor Opdrachtgever en regelt de afspraken en de betaling. Opdrachtgever en BDZBookings spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Opdrachtgever:",
        "regels": [
          "Naam / contactpersoon: {{klant_contact}}",
          "Bedrijf (indien van toepassing): {{klant_bedrijf}}",
          "Adres: {{klant_adres}}",
          "Postcode en plaats: {{klant_plaats}}",
          "Telefoon: {{klant_telefoon}} E-mail: {{klant_email}}",
          "KvK (indien bedrijf): {{indien_bedrijf}}",
          "Hierna: “Opdrachtgever”;"
        ]
      },
      {
        "label": "Geboekte act:",
        "regels": [
          "Naam band: {{act_naam}}",
          "Aantal bandleden: {{aantal_bandleden}}  Aantal crew: {{aantal_crew}}  Totaal aanwezig: {{totaal_aanwezig}}",
          "Hierna: “de Band”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Verwacht aantal gasten: {{bezoekers}}",
          "Binnen / buiten: {{binnen_buiten}}",
          "Is er een support-act of een DJ voor/na de Band? {{na_de_band}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aankomst crew en inladen: {{aankomst_crew_en_inladen}}",
          "Opbouw geluid en licht: {{opbouw_geluid_en_licht}}",
          "Geluidscheck: {{geluidscheck}} (het podium is dan leeg, schoon en vrij toegankelijk)",
          "Eten: {{eten}}",
          "Zaal open: {{zaal_open}}",
          "Optreden: {{optreden}} set(s) van {{van}} minuten, van {{van_minuten_van}} tot {{van_minuten_van_tot}}",
          "Uitladen: direct na het optreden, uiterlijk {{direct_na_het_optreden_uiterlijk}}"
        ]
      },
      {
        "label": "Podium en laden/lossen:",
        "regels": [
          "a. Podium minimaal {{a_podium_minimaal}} meter breed, {{a_podium_minimaal_meter_breed}} meter diep en {{meter_breed_meter_diep_en}} meter hoog, vlak, stabiel, droog en volledig vrij bij aankomst van de Band;",
          "b. Bij een optreden buiten is het podium overdekt, ook aan de achter- en zijkant, en zijn de kabels en stroompunten droog en veilig weggewerkt;",
          "c. Laden en lossen kan vlakbij het podium; de bus of aanhanger kan de hele avond op maximaal {{de_hele_avond_op_maximaal}} meter van de ingang staan;",
          "d. Zijn er trappen of is de afstand groter dan 25 meter, dan meldt Opdrachtgever dat vooraf en zorgt hij voor minimaal 2 (bij trappen 4) helpende handen bij het in- en uitladen;",
          "e. Ontbreekt die hulp zonder overleg, dan brengt BDZBookings € {{zonder_overleg_dan_brengt_bdzbookings}} per ontbrekende persoon in rekening;"
        ]
      },
      {
        "label": "Techniek en stroom:",
        "regels": [
          "Geluidsinstallatie: door de Band / door Opdrachtgever (doorhalen wat niet van toepassing is)",
          "Licht: door de Band / door Opdrachtgever",
          "Verzorgt Opdrachtgever geluid of licht, dan levert hij uiterlijk 14 dagen vooraf de specificaties aan en staat alles bij aankomst van de Band opgebouwd en werkend klaar;",
          "Eigen geluidstechnicus van de Band: ja / nee",
          "Stroom: minimaal 2 gescheiden, geaarde groepen van 230V / 16A binnen {{16a_binnen}} meter van het podium; indien nodig krachtstroom 400V / 32A: ja / nee",
          "De technische wensen van de Band staan in de bijlage (technische rider). Wijkt de situatie daarvan af, dan meldt Opdrachtgever dat vooraf;"
        ]
      },
      {
        "label": "Kleedkamer en catering:",
        "regels": [
          "a. Een afsluitbare, verwarmde en verlichte kleedkamer in de buurt van het podium, met {{buurt_van_het_podium_met}} stoelen, spiegel, stopcontact en {{met_stoelen_spiegel_stopcontact_en}} handdoeken;",
          "b. Bij aankomst koffie, thee en water; in de kleedkamer {{in_de_kleedkamer}} flessen/kratten fris en {{kratten_fris_en}} krat(ten) bier;",
          "c. Een warme maaltijd voor {{c_een_warme_maaltijd_voor}} personen rond {{warme_maaltijd_voor_personen_rond}} uur (bijzonderheden of dieetwensen: {{bijzonderheden_of_dieetwensen}});",
          "d. De hele avond frisdrank en water voor de leden van de Band en de crew;"
        ]
      },
      {
        "label": "Gastenlijst:",
        "regels": [
          "Maximaal {{maximaal}} personen hebben op verzoek van de Band vrije toegang tot het optreden;"
        ]
      },
      {
        "label": "Programma:",
        "regels": [
          "Repertoire, volgorde en geluidsvolume bepaalt de Band, binnen de afgesproken stijl en binnen de geldende geluidsnormen;",
          "Gewenste stijl / sfeer: {{sfeer}}",
          "Openingsdans / speciaal moment: {{speciaal_moment}}"
        ]
      },
      {
        "label": "Bedrag:",
        "regels": [
          "Totaalbedrag inclusief btw: € {{totaal}}",
          "Waarvan btw ({{btw_pct}}%): € {{btw}}",
          "Dit is het bedrag dat Opdrachtgever betaalt. De gage van de Band, de bemiddeling door BDZBookings en de eventuele reis- en onkosten zitten hierin;",
          "BDZBookings factureert dit bedrag; Opdrachtgever hoeft niets rechtstreeks met de act af te rekenen;"
        ]
      },
      {
        "label": "Betaling:",
        "regels": [
          "a. Opdrachtgever ontvangt van BDZBookings één factuur voor het totaalbedrag;",
          "b. Het volledige bedrag staat uiterlijk 14 dagen vóór de datum van het optreden op de rekening van BDZBookings. Wordt er binnen 14 dagen voor het optreden geboekt, dan geldt: direct na ontvangst van de factuur;",
          "c. Betaling gaat per bankoverschrijving of via de betaallink bij de factuur. Contant afrekenen op locatie is alleen mogelijk als dat vooraf schriftelijk is afgesproken;",
          "d. Bij te late betaling is Opdrachtgever de wettelijke (handels)rente en de incassokosten verschuldigd;"
        ]
      },
      {
        "label": "Merchandise:",
        "regels": [
          "De Band mag eigen merchandise verkopen. Opdrachtgever stelt daarvoor kosteloos een tafel of plek in de zaal beschikbaar. De opbrengst is volledig voor de Band;"
        ]
      },
      {
        "label": "Geluid:",
        "regels": [
          "a. Opdrachtgever meldt uiterlijk 14 dagen vooraf of er een geluidsbegrenzer hangt of een maximum aantal decibel geldt, en hoe hoog dat maximum is;",
          "b. De Band blijft binnen de norm die de gemeente of de locatie stelt;",
          "c. Is er niet vooraf gemeld dat er een begrenzer hangt, dan is een onderbroken of ingekort optreden daardoor geen reden om de gage te verlagen;"
        ]
      },
      {
        "label": "Aanspreekpunt:",
        "regels": [
          "a. Bryan de Zwart is het aanspreekpunt vóór, tijdens en na de boeking, ook op de avond zelf: 085 060 6460 / info@bdzbookings.nl;",
          "b. Opdrachtgever wijst één contactpersoon aan die op de dag zelf aanwezig en bereikbaar is;",
          "c. Vragen of wijzigingen lopen via BDZBookings en niet rechtstreeks met de act;"
        ]
      },
      {
        "label": "Wijzigingen:",
        "regels": [
          "a. Wijzigingen in datum, tijden, locatie of programma gelden alleen als BDZBookings ze schriftelijk of per e-mail heeft bevestigd;",
          "b. Vraagt Opdrachtgever op de dag zelf om langer door te gaan, dan mag dat alleen als de act akkoord is. Extra speeltijd wordt achteraf gefactureerd tegen € {{speeltijd_wordt_achteraf_gefactureerd_tegen}} per half uur;"
        ]
      },
      {
        "label": "Annulering door Opdrachtgever:",
        "regels": [
          "Zegt Opdrachtgever de boeking af, dan geldt:",
          "a. meer dan 60 dagen vóór het optreden: 25% van het totaalbedrag;",
          "b. 60 tot en met 31 dagen vóór het optreden: 50% van het totaalbedrag;",
          "c. 30 tot en met 15 dagen vóór het optreden: 75% van het totaalbedrag;",
          "d. 14 dagen of korter vóór het optreden: 100% van het totaalbedrag;",
          "e. Al gemaakte kosten (bijvoorbeeld huur van apparatuur of reeds geboekt vervoer) worden altijd volledig doorbelast;",
          "f. Afzeggen doet Opdrachtgever schriftelijk of per e-mail aan info@bdzbookings.nl. De datum van ontvangst telt;"
        ]
      },
      {
        "label": "Uitval van de Band:",
        "regels": [
          "a. Kan een bandlid door ziekte of ongeval niet spelen, dan zorgt de Band voor een invaller van vergelijkbaar niveau. Het optreden gaat dan gewoon door tegen de volle gage;",
          "b. Kan de Band als geheel niet optreden, dan meldt BDZBookings dat direct en zorgt BDZBookings in overleg voor een vervangende act of een nieuwe datum;",
          "c. Lukt geen van beide, dan wordt de overeenkomst ontbonden en betaalt BDZBookings het al betaalde bedrag binnen 14 dagen volledig terug. Verdere schadevergoeding is niet verschuldigd;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (denk aan extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) treden partijen in overleg over een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten en betaalt Opdrachtgever de tot dan toe daadwerkelijk gemaakte kosten;",
          "c. Een tegenvallend aantal bezoekers, slechte kaartverkoop of een gewijzigd programma is geen overmacht;"
        ]
      },
      {
        "label": "Veiligheid en aansprakelijkheid:",
        "regels": [
          "a. Opdrachtgever zorgt voor een veilige werkplek en houdt zich aan de regels rond veiligheid, brandveiligheid en arbeidsomstandigheden;",
          "b. Opdrachtgever is aansprakelijk voor schade aan personen of spullen van de act, veroorzaakt door Opdrachtgever, zijn medewerkers of het publiek, en is daarvoor verzekerd;",
          "c. De act is verzekerd voor eigen apparatuur en heeft een bedrijfsaansprakelijkheidsverzekering;",
          "d. De act mag stoppen zonder de gage te verliezen als de veiligheid niet gewaarborgd is, bijvoorbeeld bij agressie, vechtpartijen of overmatig gedrang bij het podium;",
          "e. Publiek komt niet op het podium en niet bij de apparatuur. Drankjes horen niet op of naast de apparatuur;"
        ]
      },
      {
        "label": "Muziekrechten:",
        "regels": [
          "a. Opdrachtgever meldt het evenement aan bij Buma/Stemra en Sena en betaalt de verschuldigde vergoedingen;",
          "b. BDZBookings en de act zijn hiervoor niet aansprakelijk;"
        ]
      },
      {
        "label": "Foto's, video en promotie:",
        "regels": [
          "a. Opdrachtgever mag naam, foto en logo van de act gebruiken om het optreden aan te kondigen;",
          "b. BDZBookings en de act mogen foto's en korte video's van het optreden gebruiken op hun eigen website en social media, tenzij Opdrachtgever hier vooraf schriftelijk bezwaar tegen maakt;",
          "c. Een volledige opname van het optreden uitzenden, streamen of verkopen mag alleen met schriftelijke toestemming vooraf;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Is een bepaling niet geldig, dan blijft de rest gewoon gelden en vervangen partijen die bepaling door een bepaling die er zo dicht mogelijk bij komt;",
          "c. Op deze overeenkomst is Nederlands recht van toepassing;",
          "d. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "e. Is deze overeenkomst niet binnen 14 dagen ondertekend retour, dan vervalt de optie op de datum en is BDZBookings vrij om de datum aan iemand anders aan te bieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "klant-act",
    "partij": "klant",
    "type": "act",
    "titel": "Boekingsovereenkomst Speciale act",
    "ondertitel": "Voor goochelaars, vuurspuwers, steltenlopers, Sint & Piet(en), entertainers en vergelijkbare acts",
    "intro": "BDZBookings boekt de Act voor Opdrachtgever en regelt de afspraken en de betaling. Opdrachtgever en BDZBookings spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Opdrachtgever:",
        "regels": [
          "Naam / contactpersoon: {{klant_contact}}",
          "Bedrijf (indien van toepassing): {{klant_bedrijf}}",
          "Adres: {{klant_adres}}",
          "Postcode en plaats: {{klant_plaats}}",
          "Telefoon: {{klant_telefoon}} E-mail: {{klant_email}}",
          "KvK (indien bedrijf): {{indien_bedrijf}}",
          "Hierna: “Opdrachtgever”;"
        ]
      },
      {
        "label": "Geboekte act:",
        "regels": [
          "Naam act: {{act_naam}}",
          "Soort act: {{act_soort}}",
          "Aantal personen dat meekomt: {{aantal_personen_dat_meekomt}}",
          "Hierna: “de Act”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Verwacht aantal gasten: {{bezoekers}}",
          "Leeftijd publiek: {{leeftijd_publiek}} (bijv. kinderfeest, gemengd, alleen volwassenen)",
          "Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}"
        ]
      },
      {
        "label": "Wat de Act doet:",
        "regels": [
          "Vorm: doorlopend rondlopend / vaste show op een podium of plek / combinatie (doorhalen wat niet van toepassing is)",
          "Aantal blokken: {{aantal_blokken}} blok(ken) van {{van}} minuten",
          "Aankomst: {{aankomst}}  Start eerste blok: {{start_eerste_blok}}  Einde: {{einde}}",
          "Korte omschrijving van de act: {{korte_omschrijving_van_de_act}}",
          "{{de_act_doet}}",
          "De Act bepaalt zelf de inhoud en de opbouw van de show;"
        ]
      },
      {
        "label": "Bedrag:",
        "regels": [
          "Totaalbedrag inclusief btw: € {{totaal}}",
          "Waarvan btw ({{btw_pct}}%): € {{btw}}",
          "Dit is het bedrag dat Opdrachtgever betaalt. De gage van de Act, de bemiddeling door BDZBookings en de eventuele reis- en onkosten zitten hierin;",
          "BDZBookings factureert dit bedrag; Opdrachtgever hoeft niets rechtstreeks met de act af te rekenen;"
        ]
      },
      {
        "label": "Betaling:",
        "regels": [
          "a. Opdrachtgever ontvangt van BDZBookings één factuur voor het totaalbedrag;",
          "b. Het volledige bedrag staat uiterlijk 14 dagen vóór de datum van het optreden op de rekening van BDZBookings. Wordt er binnen 14 dagen voor het optreden geboekt, dan geldt: direct na ontvangst van de factuur;",
          "c. Betaling gaat per bankoverschrijving of via de betaallink bij de factuur. Contant afrekenen op locatie is alleen mogelijk als dat vooraf schriftelijk is afgesproken;",
          "d. Bij te late betaling is Opdrachtgever de wettelijke (handels)rente en de incassokosten verschuldigd;"
        ]
      },
      {
        "label": "Wat Opdrachtgever regelt:",
        "regels": [
          "a. Een geschikte, vrije ruimte of speelvlak van minimaal {{ruimte_of_speelvlak_van_minimaal}} x {{of_speelvlak_van_minimaal_x}} meter, vlak, stabiel en droog;",
          "b. Vrije hoogte van minimaal {{b_vrije_hoogte_van_minimaal}} meter (belangrijk bij steltenlopers, jongleren en vuur);",
          "c. Een kleedruimte of afsluitbare ruimte waar de Act zich kan omkleden en spullen kan achterlaten;",
          "d. Stroom: {{d_stroom}} geaarde groep(en) van 230V / 16A binnen {{16a_binnen}} meter, indien de Act dat nodig heeft;",
          "e. Geluid: de Act gebruikt de installatie van Opdrachtgever / brengt eigen geluid mee (doorhalen wat niet van toepassing is);",
          "f. Parkeergelegenheid vlakbij en de mogelijkheid om te laden en te lossen;",
          "g. Frisdrank, koffie of water, en bij een aanwezigheid van meer dan 4 uur een maaltijd voor {{4_uur_een_maaltijd_voor}} personen;",
          "h. Een medewerker die de Act ontvangt en de weg wijst;"
        ]
      },
      {
        "label": "Veiligheid algemeen:",
        "regels": [
          "a. Opdrachtgever zorgt voor een veilige werkplek en houdt zich aan de regels rond veiligheid en brandveiligheid;",
          "b. Publiek houdt de afgesproken afstand tot de Act; Opdrachtgever zorgt zo nodig voor afzetting of begeleiding;",
          "c. De Act mag de show aanpassen, korter maken of stoppen als de situatie onveilig is (bijvoorbeeld door dringend publiek, agressie, gladde vloer, harde wind of regen). De gage blijft in dat geval volledig verschuldigd;",
          "d. De Act heeft een bedrijfsaansprakelijkheidsverzekering;",
          "e. Opdrachtgever is aansprakelijk voor schade aan personen of spullen van de Act, veroorzaakt door Opdrachtgever, zijn medewerkers of het publiek, en is daarvoor verzekerd;"
        ]
      },
      {
        "label": "Extra regels bij vuur en open vlam:",
        "regels": [
          "Dit artikel geldt alleen als de Act met vuur, vuurwerk of open vlam werkt.",
          "a. Opdrachtgever regelt vooraf schriftelijke toestemming van de eigenaar van de locatie én, als dat nodig is, van de gemeente en de brandweer, en meldt het bij zijn verzekeraar;",
          "b. De vuuract vindt in principe buiten plaats. Binnen alleen als de locatie en de brandweer daar uitdrukkelijk toestemming voor geven;",
          "c. Vrije, obstakelvrije zone van minimaal 5 meter rondom de Act en minimaal 5 meter vrije hoogte;",
          "d. Geen brandbare versiering, stro, doeken, tenten, luifels of parasols binnen die zone;",
          "e. Opdrachtgever zorgt voor minimaal {{e_opdrachtgever_zorgt_voor_minimaal}} goedgekeurde brandblusser(s) en een branddeken binnen handbereik;",
          "f. Er wordt niet gewerkt boven of vlakbij rieten kappen, tentzeilen of overkappingen;",
          "g. Bij windkracht 5 of hoger, of bij aanhoudende regen, kan de Act de vuuract laten vervallen. Er wordt dan zo mogelijk een alternatief onderdeel gedaan; de gage blijft volledig verschuldigd;",
          "h. Rookmelders die in de weg zitten worden niet afgeplakt of uitgeschakeld; is dat wel nodig, dan regelt Opdrachtgever dit via de locatie en op zijn eigen verantwoordelijkheid;",
          "i. Publiek en personeel komen tijdens de act niet binnen de veilige zone; kinderen staan onder toezicht van een volwassene;",
          "j. De Act werkt met eigen, goedgekeurde brandstof en materialen en gebruikt geen alcohol vóór of tijdens het optreden;",
          "k. Wordt niet aan deze voorwaarden voldaan, dan mag de Act de vuuract laten vervallen zonder de gage te verliezen;"
        ]
      },
      {
        "label": "Extra regels bij acts voor kinderen:",
        "regels": [
          "a. Er is altijd een volwassene van Opdrachtgever bij de kinderen aanwezig; de Act neemt geen toezicht over;",
          "b. Bij Sint & Piet of vergelijkbare acts levert Opdrachtgever vooraf de namen en bijzonderheden van de kinderen aan en zorgt hij zelf voor de cadeautjes;",
          "c. Foto's van kinderen door Opdrachtgever of het publiek zijn de verantwoordelijkheid van Opdrachtgever;"
        ]
      },
      {
        "label": "Extra regels bij acts voor volwassenen:",
        "regels": [
          "Dit artikel geldt alleen bij acts die uitsluitend voor volwassenen bedoeld zijn.",
          "a. De act vindt plaats in een besloten ruimte; er is geen publiek onder de 18 jaar aanwezig;",
          "b. Opdrachtgever zorgt dat het publiek de Act met respect behandelt; aanraken mag alleen als de Act dat zelf aangeeft;",
          "c. Filmen en fotograferen tijdens deze act is niet toegestaan;",
          "d. Bij ongewenst gedrag stopt de Act direct en blijft de gage volledig verschuldigd;"
        ]
      },
      {
        "label": "Aanspreekpunt:",
        "regels": [
          "a. Bryan de Zwart is het aanspreekpunt vóór, tijdens en na de boeking, ook op de avond zelf: 085 060 6460 / info@bdzbookings.nl;",
          "b. Opdrachtgever wijst één contactpersoon aan die op de dag zelf aanwezig en bereikbaar is;",
          "c. Vragen of wijzigingen lopen via BDZBookings en niet rechtstreeks met de act;"
        ]
      },
      {
        "label": "Wijzigingen:",
        "regels": [
          "a. Wijzigingen in datum, tijden, locatie of programma gelden alleen als BDZBookings ze schriftelijk of per e-mail heeft bevestigd;",
          "b. Wil Opdrachtgever op de dag zelf een extra blok, dan mag dat alleen als de Act akkoord is. Een extra blok wordt achteraf gefactureerd tegen € {{blok_wordt_achteraf_gefactureerd_tegen}} per {{wordt_achteraf_gefactureerd_tegen_per}} minuten;"
        ]
      },
      {
        "label": "Annulering door Opdrachtgever:",
        "regels": [
          "Zegt Opdrachtgever de boeking af, dan geldt:",
          "a. meer dan 60 dagen vóór het optreden: 25% van het totaalbedrag;",
          "b. 60 tot en met 31 dagen vóór het optreden: 50% van het totaalbedrag;",
          "c. 30 tot en met 15 dagen vóór het optreden: 75% van het totaalbedrag;",
          "d. 14 dagen of korter vóór het optreden: 100% van het totaalbedrag;",
          "e. Al gemaakte kosten (bijvoorbeeld huur van apparatuur of reeds geboekt vervoer) worden altijd volledig doorbelast;",
          "f. Afzeggen doet Opdrachtgever schriftelijk of per e-mail aan info@bdzbookings.nl. De datum van ontvangst telt;"
        ]
      },
      {
        "label": "Uitval van de Act:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan meldt BDZBookings dit direct;",
          "b. BDZBookings zorgt dan in overleg voor een vervanger van vergelijkbaar niveau, of partijen zoeken samen een nieuwe datum;",
          "c. Lukt geen van beide, dan wordt de overeenkomst ontbonden en betaalt BDZBookings het al betaalde bedrag binnen 14 dagen volledig terug;",
          "d. Verdere schadevergoeding is in dat geval niet verschuldigd;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (denk aan extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) treden partijen in overleg over een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten en betaalt Opdrachtgever de tot dan toe daadwerkelijk gemaakte kosten;",
          "c. Een tegenvallend aantal bezoekers, slechte kaartverkoop of een gewijzigd programma is geen overmacht;"
        ]
      },
      {
        "label": "Foto's, video en promotie:",
        "regels": [
          "a. Opdrachtgever mag naam, foto en logo van de act gebruiken om het optreden aan te kondigen;",
          "b. BDZBookings en de act mogen foto's en korte video's van het optreden gebruiken op hun eigen website en social media, tenzij Opdrachtgever hier vooraf schriftelijk bezwaar tegen maakt;",
          "c. Een volledige opname van het optreden uitzenden, streamen of verkopen mag alleen met schriftelijke toestemming vooraf;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Is een bepaling niet geldig, dan blijft de rest gewoon gelden en vervangen partijen die bepaling door een bepaling die er zo dicht mogelijk bij komt;",
          "c. Op deze overeenkomst is Nederlands recht van toepassing;",
          "d. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "e. Is deze overeenkomst niet binnen 14 dagen ondertekend retour, dan vervalt de optie op de datum en is BDZBookings vrij om de datum aan iemand anders aan te bieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "act-dj",
    "partij": "act",
    "type": "dj",
    "titel": "Optreedovereenkomst DJ",
    "ondertitel": "Tussen Bryan de Zwart Bookings en de DJ",
    "intro": "BDZBookings heeft een optreden geboekt bij een opdrachtgever en schakelt daarvoor de DJ in. BDZBookings en de DJ spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "DJ:",
        "regels": [
          "Artiestennaam: {{act_naam}}",
          "Eigen naam: {{act_eigennaam}}",
          "Adres: {{act_adres}}",
          "Postcode en plaats: {{act_plaats}}",
          "Telefoon: {{act_telefoon}} E-mail: {{act_email}}",
          "Hierna: “de DJ”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Opdrachtgever: {{opdrachtgever_naam}}",
          "Verwacht aantal gasten: {{bezoekers}}  Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}",
          "Adres: {{locatie_adres}}",
          "Postcode en plaats: {{locatie_plaats}}",
          "Reistijd vanaf huisadres van de act: {{reistijd}} minuten;"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aanwezig en opbouw vanaf: {{aankomst}} (minimaal 60 minuten voor aanvang)",
          "Aanvang: {{start_tijd}}  Einde: {{eind_tijd}}",
          "Speeltijd in totaal: {{speeltijd_in_totaal}} uur, in {{uur_in}} blok(ken)",
          "Afbouw direct na het laatste nummer;"
        ]
      },
      {
        "label": "Wat de DJ verzorgt:",
        "regels": [
          "Geluidsinstallatie: door de DJ / huisinstallatie van de locatie (doorhalen wat niet van toepassing is)",
          "Licht: door de DJ / door de locatie",
          "Draaigedeelte, laptop, koptelefoon en microfoon brengt de DJ altijd zelf mee;",
          "Extra's (rookmachine, sfeerverlichting, draadloze microfoon voor speeches): {{sfeerverlichting_draadloze_microfoon_voor_speeches}}",
          "De DJ heeft een back-up bij zich (tweede laptop, USB-stick of harde schijf met de muziek);"
        ]
      },
      {
        "label": "Muziek:",
        "regels": [
          "Gewenste stijl / sfeer: {{sfeer}}",
          "De DJ bepaalt de opbouw en de volgorde van de muziek, binnen die stijl;",
          "BDZBookings levert de wensenlijst en de niet-draaien-lijst uiterlijk 5 dagen vooraf aan;",
          "De DJ blijft binnen de geluidsnorm van de locatie of de gemeente;"
        ]
      },
      {
        "label": "Gage:",
        "regels": [
          "Gage van de DJ (excl. btw): € {{gage}}",
          "Reis- en onkostenvergoeding (excl. btw): € {{onkosten}}",
          "Btw ({{btw_pct}}%): € {{btw}}",
          "Totaal te ontvangen (incl. btw): € {{totaal}}",
          "De bemiddelingskosten van BDZBookings (15% over de gage) worden als opslag bij de Opdrachtgever in rekening gebracht. Ze worden dus niet op de gage ingehouden;",
          "Bij een boeking die BDZBookings inkoopt bij een ander bureau geldt het overeengekomen inkooptarief;"
        ]
      },
      {
        "label": "Uitbetaling:",
        "regels": [
          "a. BDZBookings factureert de Opdrachtgever en int het volledige bedrag;",
          "b. Uitbetaling vindt plaats in de eerste week van de maand ná het optreden, op rekening {{na_het_optreden_op_rekening}} t.n.v. {{op_rekening_t_n_v}};",
          "c. Voor de uitbetaling stuurt de act een factuur aan info@bdzbookings.nl, uiterlijk in de laatste week van de maand van het optreden. Heeft de act geen eigen facturatie, dan maakt BDZBookings de factuur namens de act op (self-billing) en stuurt die ter controle mee;",
          "d. Ontvangt BDZBookings het geld van de Opdrachtgever niet op tijd, dan meldt BDZBookings dat direct en spant BDZBookings zich in om te innen. De uitbetaling schuift dan op tot na ontvangst;"
        ]
      },
      {
        "label": "Zelfstandigheid en belastingen:",
        "regels": [
          "a. De act werkt als zelfstandige en niet in dienst van BDZBookings. Er is geen dienstverband en geen gezagsverhouding;",
          "b. De act regelt zelf zijn belastingaangifte, verzekeringen en pensioen;",
          "c. KvK-nummer: {{c_kvk_nummer}}  Btw-nummer: {{btw_nummer}}",
          "d. Heeft de act geen KvK-inschrijving, dan valt het optreden onder de artiestenregeling van de Belastingdienst. De act levert dan vooraf een ingevulde gageverklaring en een kopie van een geldig identiteitsbewijs aan (rijbewijs volstaat niet);",
          "e. De act neemt op de dag van het optreden een geldig identiteitsbewijs mee;"
        ]
      },
      {
        "label": "Niet-exclusief:",
        "regels": [
          "a. Deze overeenkomst geldt alleen voor het hierboven genoemde optreden;",
          "b. De act blijft vrij om zelf boekingen aan te nemen en om bij andere bureaus aangesloten te blijven. BDZBookings werkt niet exclusief;",
          "c. De act houdt zijn beschikbaarheid in het portaal actueel, zodat BDZBookings weet wanneer er wel of niet geboekt kan worden;"
        ]
      },
      {
        "label": "Rechtstreeks boeken:",
        "regels": [
          "a. Neemt de Opdrachtgever van dit optreden tijdens of na de avond rechtstreeks contact op voor een nieuwe boeking, dan verwijst de act door naar BDZBookings;",
          "b. Boekt diezelfde Opdrachtgever de act binnen 12 maanden na dit optreden toch rechtstreeks, dan meldt de act dat en is over die boeking alsnog de gebruikelijke bemiddelingsvergoeding van 15% aan BDZBookings verschuldigd;",
          "c. Dit geldt niet voor opdrachtgevers die de act al vóór deze boeking als klant had. Twijfel je? Meld het even, dan is het zo geregeld;"
        ]
      },
      {
        "label": "Afspraken op de avond:",
        "regels": [
          "a. Afspraken over extra speeltijd, extra kosten of een andere invulling lopen altijd via BDZBookings, ook op de avond zelf;",
          "b. De act maakt geen prijsafspraken met de Opdrachtgever en deelt geen eigen tarieven;",
          "c. Bryan de Zwart is de hele avond bereikbaar op 085 060 6460;"
        ]
      },
      {
        "label": "Afzeggen door de DJ:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan belt de act BDZBookings direct — niet appen en niet wachten;",
          "b. De act denkt mee over een geschikte vervanger van vergelijkbaar niveau. BDZBookings bepaalt in overleg met de Opdrachtgever of die vervanger doorgaat;",
          "c. Zegt de act af zonder geldige reden of komt de act niet opdagen, dan is de act aansprakelijk voor de schade van BDZBookings, waaronder de kosten van een vervangende act en de misgelopen bemiddelingsvergoeding;",
          "d. Een dubbele boeking of een beter betaald optreden is geen geldige reden;"
        ]
      },
      {
        "label": "Afzeggen door de Opdrachtgever:",
        "regels": [
          "a. Zegt de Opdrachtgever de boeking af, dan meldt BDZBookings dit zo snel mogelijk;",
          "b. BDZBookings brengt de Opdrachtgever een annuleringsvergoeding in rekening (25% tot 100%, afhankelijk van hoe laat er wordt afgezegd);",
          "c. Van wat BDZBookings daadwerkelijk ontvangt, gaat het deel dat op de gage van de act ziet naar de act. De verhouding is dezelfde als bij een normaal optreden;",
          "d. Al gemaakte, aantoonbare kosten van de act worden volledig vergoed;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) zoeken partijen samen naar een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten;"
        ]
      },
      {
        "label": "Veiligheid en gedrag:",
        "regels": [
          "a. De act is verzekerd voor zijn eigen apparatuur en beschikt over een bedrijfsaansprakelijkheidsverzekering;",
          "b. De act mag stoppen als de situatie onveilig is (agressie, gedrang, een onveilig podium of onveilige stroom) en meldt dat direct bij BDZBookings. De gage blijft in dat geval gewoon verschuldigd;",
          "c. De act komt nuchter en uitgerust aan, blijft tijdens het optreden nuchter en drinkt hooguit met mate na afloop;",
          "d. De act gaat netjes om met de locatie en het publiek en laat de opstelplek schoon achter;"
        ]
      },
      {
        "label": "Promotie en materialen:",
        "regels": [
          "a. De act levert BDZBookings foto's, logo, een korte biografie, promotievideo en de technische wensen aan en houdt die actueel;",
          "b. BDZBookings mag deze materialen, de naam en het portret van de act gebruiken op bdzbookings.nl, in offertes en op de social media van BDZBookings, zolang de samenwerking loopt;",
          "c. BDZBookings mag foto's en korte video's van het optreden gebruiken voor eigen promotie, tenzij de act daar vooraf bezwaar tegen maakt;"
        ]
      },
      {
        "label": "Het portaal:",
        "regels": [
          "a. De act krijgt toegang tot het BDZBookings-portaal via een persoonlijke inloglink;",
          "b. In het portaal staan de bevestigde boekingen, de tijden, de locatie en het overzicht van de uitbetalingen;",
          "c. De act houdt daar zijn eigen niet-beschikbare dagen bij (vakantie, andere boekingen);",
          "d. BDZBookings neemt altijd eerst persoonlijk contact op om de beschikbaarheid te checken voordat er iets wordt vastgelegd;",
          "e. De act gaat zorgvuldig om met de gegevens van opdrachtgevers en deelt die niet met anderen;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Wijzigingen gelden alleen als ze schriftelijk of per e-mail zijn bevestigd;",
          "c. Is een bepaling niet geldig, dan blijft de rest gewoon gelden;",
          "d. Op deze overeenkomst is Nederlands recht van toepassing;",
          "e. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "f. Is deze overeenkomst niet binnen 7 dagen ondertekend retour, dan mag BDZBookings de boeking aan een andere act aanbieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "act-artiest",
    "partij": "act",
    "type": "artiest",
    "titel": "Optreedovereenkomst Artiest",
    "ondertitel": "Tussen Bryan de Zwart Bookings en de artiest",
    "intro": "BDZBookings heeft een optreden geboekt bij een opdrachtgever en schakelt daarvoor de Artiest in. BDZBookings en de Artiest spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Artiest:",
        "regels": [
          "Artiestennaam: {{act_naam}}",
          "Eigen naam: {{act_eigennaam}}",
          "Adres: {{act_adres}}",
          "Postcode en plaats: {{act_plaats}}",
          "Telefoon: {{act_telefoon}} E-mail: {{act_email}}",
          "Aantal personen dat meekomt (artiest, technicus, begeleiding): {{artiest_technicus_begeleiding}}",
          "Hierna: “de Artiest”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Opdrachtgever: {{opdrachtgever_naam}}",
          "Verwacht aantal gasten: {{bezoekers}}  Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}",
          "Adres: {{locatie_adres}}",
          "Postcode en plaats: {{locatie_plaats}}",
          "Reistijd vanaf huisadres van de act: {{reistijd}} minuten;"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aanwezig vanaf: {{aankomst}} (minimaal 45 minuten voor aanvang)",
          "Geluidscheck: {{geluidscheck}}",
          "Optreden: {{optreden}} set(s) van {{van}} minuten",
          "Aanvang eerste set: {{start_tijd}}  Einde laatste set: {{eind_tijd}}"
        ]
      },
      {
        "label": "Wat de Artiest verzorgt:",
        "regels": [
          "Eigen geluidsinstallatie: ja / nee (doorhalen wat niet van toepassing is)",
          "Eigen technicus: ja / nee",
          "Eigen instrumenten, microfoon en muziekbestanden of backing tracks;",
          "De Artiest heeft de tracks in tweevoud bij zich (back-up);",
          "Overig: {{overig}}"
        ]
      },
      {
        "label": "Programma:",
        "regels": [
          "Repertoire en volgorde bepaalt de Artiest;",
          "Openingsdans / speciaal moment: {{speciaal_moment}}",
          "De Artiest treedt niet op dezelfde avond binnen {{niet_op_dezelfde_avond_binnen}} km nog ergens anders op, tenzij dit vooraf is gemeld en akkoord bevonden;",
          "De Artiest blijft binnen de geluidsnorm van de locatie of de gemeente;"
        ]
      },
      {
        "label": "Gage:",
        "regels": [
          "Gage van de Artiest (excl. btw): € {{gage}}",
          "Reis- en onkostenvergoeding (excl. btw): € {{onkosten}}",
          "Btw ({{btw_pct}}%): € {{btw}}",
          "Totaal te ontvangen (incl. btw): € {{totaal}}",
          "De bemiddelingskosten van BDZBookings (15% over de gage) worden als opslag bij de Opdrachtgever in rekening gebracht. Ze worden dus niet op de gage ingehouden;",
          "Bij een boeking die BDZBookings inkoopt bij een ander bureau geldt het overeengekomen inkooptarief;"
        ]
      },
      {
        "label": "Uitbetaling:",
        "regels": [
          "a. BDZBookings factureert de Opdrachtgever en int het volledige bedrag;",
          "b. Uitbetaling vindt plaats in de eerste week van de maand ná het optreden, op rekening {{na_het_optreden_op_rekening}} t.n.v. {{op_rekening_t_n_v}};",
          "c. Voor de uitbetaling stuurt de act een factuur aan info@bdzbookings.nl, uiterlijk in de laatste week van de maand van het optreden. Heeft de act geen eigen facturatie, dan maakt BDZBookings de factuur namens de act op (self-billing) en stuurt die ter controle mee;",
          "d. Ontvangt BDZBookings het geld van de Opdrachtgever niet op tijd, dan meldt BDZBookings dat direct en spant BDZBookings zich in om te innen. De uitbetaling schuift dan op tot na ontvangst;"
        ]
      },
      {
        "label": "Zelfstandigheid en belastingen:",
        "regels": [
          "a. De act werkt als zelfstandige en niet in dienst van BDZBookings. Er is geen dienstverband en geen gezagsverhouding;",
          "b. De act regelt zelf zijn belastingaangifte, verzekeringen en pensioen;",
          "c. KvK-nummer: {{c_kvk_nummer}}  Btw-nummer: {{btw_nummer}}",
          "d. Heeft de act geen KvK-inschrijving, dan valt het optreden onder de artiestenregeling van de Belastingdienst. De act levert dan vooraf een ingevulde gageverklaring en een kopie van een geldig identiteitsbewijs aan (rijbewijs volstaat niet);",
          "e. De act neemt op de dag van het optreden een geldig identiteitsbewijs mee;"
        ]
      },
      {
        "label": "Niet-exclusief:",
        "regels": [
          "a. Deze overeenkomst geldt alleen voor het hierboven genoemde optreden;",
          "b. De act blijft vrij om zelf boekingen aan te nemen en om bij andere bureaus aangesloten te blijven. BDZBookings werkt niet exclusief;",
          "c. De act houdt zijn beschikbaarheid in het portaal actueel, zodat BDZBookings weet wanneer er wel of niet geboekt kan worden;"
        ]
      },
      {
        "label": "Rechtstreeks boeken:",
        "regels": [
          "a. Neemt de Opdrachtgever van dit optreden tijdens of na de avond rechtstreeks contact op voor een nieuwe boeking, dan verwijst de act door naar BDZBookings;",
          "b. Boekt diezelfde Opdrachtgever de act binnen 12 maanden na dit optreden toch rechtstreeks, dan meldt de act dat en is over die boeking alsnog de gebruikelijke bemiddelingsvergoeding van 15% aan BDZBookings verschuldigd;",
          "c. Dit geldt niet voor opdrachtgevers die de act al vóór deze boeking als klant had. Twijfel je? Meld het even, dan is het zo geregeld;"
        ]
      },
      {
        "label": "Afspraken op de avond:",
        "regels": [
          "a. Afspraken over extra speeltijd, extra kosten of een andere invulling lopen altijd via BDZBookings, ook op de avond zelf;",
          "b. De act maakt geen prijsafspraken met de Opdrachtgever en deelt geen eigen tarieven;",
          "c. Bryan de Zwart is de hele avond bereikbaar op 085 060 6460;"
        ]
      },
      {
        "label": "Afzeggen door de Artiest:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan belt de act BDZBookings direct — niet appen en niet wachten;",
          "b. De act denkt mee over een geschikte vervanger van vergelijkbaar niveau. BDZBookings bepaalt in overleg met de Opdrachtgever of die vervanger doorgaat;",
          "c. Zegt de act af zonder geldige reden of komt de act niet opdagen, dan is de act aansprakelijk voor de schade van BDZBookings, waaronder de kosten van een vervangende act en de misgelopen bemiddelingsvergoeding;",
          "d. Een dubbele boeking of een beter betaald optreden is geen geldige reden;"
        ]
      },
      {
        "label": "Afzeggen door de Opdrachtgever:",
        "regels": [
          "a. Zegt de Opdrachtgever de boeking af, dan meldt BDZBookings dit zo snel mogelijk;",
          "b. BDZBookings brengt de Opdrachtgever een annuleringsvergoeding in rekening (25% tot 100%, afhankelijk van hoe laat er wordt afgezegd);",
          "c. Van wat BDZBookings daadwerkelijk ontvangt, gaat het deel dat op de gage van de act ziet naar de act. De verhouding is dezelfde als bij een normaal optreden;",
          "d. Al gemaakte, aantoonbare kosten van de act worden volledig vergoed;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) zoeken partijen samen naar een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten;"
        ]
      },
      {
        "label": "Veiligheid en gedrag:",
        "regels": [
          "a. De act is verzekerd voor zijn eigen apparatuur en beschikt over een bedrijfsaansprakelijkheidsverzekering;",
          "b. De act mag stoppen als de situatie onveilig is (agressie, gedrang, een onveilig podium of onveilige stroom) en meldt dat direct bij BDZBookings. De gage blijft in dat geval gewoon verschuldigd;",
          "c. De act komt nuchter en uitgerust aan, blijft tijdens het optreden nuchter en drinkt hooguit met mate na afloop;",
          "d. De act gaat netjes om met de locatie en het publiek en laat de opstelplek schoon achter;"
        ]
      },
      {
        "label": "Promotie en materialen:",
        "regels": [
          "a. De act levert BDZBookings foto's, logo, een korte biografie, promotievideo en de technische wensen aan en houdt die actueel;",
          "b. BDZBookings mag deze materialen, de naam en het portret van de act gebruiken op bdzbookings.nl, in offertes en op de social media van BDZBookings, zolang de samenwerking loopt;",
          "c. BDZBookings mag foto's en korte video's van het optreden gebruiken voor eigen promotie, tenzij de act daar vooraf bezwaar tegen maakt;"
        ]
      },
      {
        "label": "Het portaal:",
        "regels": [
          "a. De act krijgt toegang tot het BDZBookings-portaal via een persoonlijke inloglink;",
          "b. In het portaal staan de bevestigde boekingen, de tijden, de locatie en het overzicht van de uitbetalingen;",
          "c. De act houdt daar zijn eigen niet-beschikbare dagen bij (vakantie, andere boekingen);",
          "d. BDZBookings neemt altijd eerst persoonlijk contact op om de beschikbaarheid te checken voordat er iets wordt vastgelegd;",
          "e. De act gaat zorgvuldig om met de gegevens van opdrachtgevers en deelt die niet met anderen;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Wijzigingen gelden alleen als ze schriftelijk of per e-mail zijn bevestigd;",
          "c. Is een bepaling niet geldig, dan blijft de rest gewoon gelden;",
          "d. Op deze overeenkomst is Nederlands recht van toepassing;",
          "e. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "f. Is deze overeenkomst niet binnen 7 dagen ondertekend retour, dan mag BDZBookings de boeking aan een andere act aanbieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "act-band",
    "partij": "act",
    "type": "band",
    "titel": "Optreedovereenkomst Band",
    "ondertitel": "Tussen Bryan de Zwart Bookings en de band",
    "intro": "BDZBookings heeft een optreden geboekt bij een opdrachtgever en schakelt daarvoor de Band in. BDZBookings en de Band spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Band:",
        "regels": [
          "Naam band: {{act_naam}}",
          "Contactpersoon: {{act_contact}}",
          "Adres contactpersoon: {{adres_contactpersoon}}",
          "E-mail: {{e_mail}}",
          "Aantal bandleden: {{aantal_bandleden}}  Aantal crew: {{aantal_crew}}  Totaal aanwezig: {{totaal_aanwezig}}",
          "De contactpersoon tekent namens alle bandleden;",
          "Hierna: “de Band”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Opdrachtgever: {{opdrachtgever_naam}}",
          "Verwacht aantal gasten: {{bezoekers}}  Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}",
          "Adres: {{locatie_adres}}",
          "Postcode en plaats: {{locatie_plaats}}",
          "Reistijd vanaf huisadres van de act: {{reistijd}} minuten;"
        ]
      },
      {
        "label": "Tijden:",
        "regels": [
          "Aankomst en inladen: {{aankomst_en_inladen}}",
          "Opbouw geluid en licht: {{opbouw_geluid_en_licht}}",
          "Geluidscheck: {{geluidscheck}}",
          "Eten: {{eten}}",
          "Optreden: {{optreden}} set(s) van {{van}} minuten, van {{van_minuten_van}} tot {{van_minuten_van_tot}}",
          "Uitladen: direct na het optreden;"
        ]
      },
      {
        "label": "Wat de Band verzorgt:",
        "regels": [
          "Geluidsinstallatie: door de Band / door de Opdrachtgever (doorhalen wat niet van toepassing is)",
          "Licht: door de Band / door de Opdrachtgever",
          "Eigen geluidstechnicus: ja / nee",
          "Eigen backline en instrumenten;",
          "De Band levert de technische rider en de podiumtekening uiterlijk 21 dagen vóór het optreden bij BDZBookings aan, zodat BDZBookings dit met de Opdrachtgever kan afstemmen;",
          "Wensen voor kleedkamer en catering: {{wensen_voor_kleedkamer_en_catering}}"
        ]
      },
      {
        "label": "Bezetting:",
        "regels": [
          "a. De Band treedt op in de bezetting die de Opdrachtgever is voorgespiegeld;",
          "b. Valt een bandlid uit, dan zorgt de Band zelf voor een invaller van vergelijkbaar niveau en meldt dit vooraf bij BDZBookings;",
          "c. Optreden in een kleinere bezetting mag alleen na overleg met BDZBookings;",
          "d. Repertoire, volgorde en volume bepaalt de Band, binnen de afgesproken stijl en binnen de geluidsnorm van de locatie of de gemeente;"
        ]
      },
      {
        "label": "Merchandise:",
        "regels": [
          "De Band mag eigen merchandise verkopen. De opbrengst is volledig voor de Band. BDZBookings regelt vooraf met de Opdrachtgever dat daar een plek voor is;"
        ]
      },
      {
        "label": "Gage:",
        "regels": [
          "Gage van de Band (excl. btw): € {{gage}}",
          "Reis- en onkostenvergoeding (excl. btw): € {{onkosten}}",
          "Btw ({{btw_pct}}%): € {{btw}}",
          "Totaal te ontvangen (incl. btw): € {{totaal}}",
          "De bemiddelingskosten van BDZBookings (15% over de gage) worden als opslag bij de Opdrachtgever in rekening gebracht. Ze worden dus niet op de gage ingehouden;",
          "Bij een boeking die BDZBookings inkoopt bij een ander bureau geldt het overeengekomen inkooptarief;"
        ]
      },
      {
        "label": "Uitbetaling:",
        "regels": [
          "a. BDZBookings factureert de Opdrachtgever en int het volledige bedrag;",
          "b. Uitbetaling vindt plaats in de eerste week van de maand ná het optreden, op rekening {{na_het_optreden_op_rekening}} t.n.v. {{op_rekening_t_n_v}};",
          "c. Voor de uitbetaling stuurt de act een factuur aan info@bdzbookings.nl, uiterlijk in de laatste week van de maand van het optreden. Heeft de act geen eigen facturatie, dan maakt BDZBookings de factuur namens de act op (self-billing) en stuurt die ter controle mee;",
          "d. Ontvangt BDZBookings het geld van de Opdrachtgever niet op tijd, dan meldt BDZBookings dat direct en spant BDZBookings zich in om te innen. De uitbetaling schuift dan op tot na ontvangst;",
          "e. BDZBookings betaalt uit aan de Band als geheel, op één rekening. De verdeling onder de bandleden regelt de Band zelf;"
        ]
      },
      {
        "label": "Zelfstandigheid en belastingen:",
        "regels": [
          "a. De act werkt als zelfstandige en niet in dienst van BDZBookings. Er is geen dienstverband en geen gezagsverhouding;",
          "b. De act regelt zelf zijn belastingaangifte, verzekeringen en pensioen;",
          "c. KvK-nummer: {{c_kvk_nummer}}  Btw-nummer: {{btw_nummer}}",
          "d. Heeft de act geen KvK-inschrijving, dan valt het optreden onder de artiestenregeling van de Belastingdienst. De act levert dan vooraf een ingevulde gageverklaring en een kopie van een geldig identiteitsbewijs aan (rijbewijs volstaat niet);",
          "e. De act neemt op de dag van het optreden een geldig identiteitsbewijs mee;"
        ]
      },
      {
        "label": "Niet-exclusief:",
        "regels": [
          "a. Deze overeenkomst geldt alleen voor het hierboven genoemde optreden;",
          "b. De act blijft vrij om zelf boekingen aan te nemen en om bij andere bureaus aangesloten te blijven. BDZBookings werkt niet exclusief;",
          "c. De act houdt zijn beschikbaarheid in het portaal actueel, zodat BDZBookings weet wanneer er wel of niet geboekt kan worden;"
        ]
      },
      {
        "label": "Rechtstreeks boeken:",
        "regels": [
          "a. Neemt de Opdrachtgever van dit optreden tijdens of na de avond rechtstreeks contact op voor een nieuwe boeking, dan verwijst de act door naar BDZBookings;",
          "b. Boekt diezelfde Opdrachtgever de act binnen 12 maanden na dit optreden toch rechtstreeks, dan meldt de act dat en is over die boeking alsnog de gebruikelijke bemiddelingsvergoeding van 15% aan BDZBookings verschuldigd;",
          "c. Dit geldt niet voor opdrachtgevers die de act al vóór deze boeking als klant had. Twijfel je? Meld het even, dan is het zo geregeld;"
        ]
      },
      {
        "label": "Afspraken op de avond:",
        "regels": [
          "a. Afspraken over extra speeltijd, extra kosten of een andere invulling lopen altijd via BDZBookings, ook op de avond zelf;",
          "b. De act maakt geen prijsafspraken met de Opdrachtgever en deelt geen eigen tarieven;",
          "c. Bryan de Zwart is de hele avond bereikbaar op 085 060 6460;"
        ]
      },
      {
        "label": "Afzeggen door de Band:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan belt de act BDZBookings direct — niet appen en niet wachten;",
          "b. De act denkt mee over een geschikte vervanger van vergelijkbaar niveau. BDZBookings bepaalt in overleg met de Opdrachtgever of die vervanger doorgaat;",
          "c. Zegt de act af zonder geldige reden of komt de act niet opdagen, dan is de act aansprakelijk voor de schade van BDZBookings, waaronder de kosten van een vervangende act en de misgelopen bemiddelingsvergoeding;",
          "d. Een dubbele boeking of een beter betaald optreden is geen geldige reden;"
        ]
      },
      {
        "label": "Afzeggen door de Opdrachtgever:",
        "regels": [
          "a. Zegt de Opdrachtgever de boeking af, dan meldt BDZBookings dit zo snel mogelijk;",
          "b. BDZBookings brengt de Opdrachtgever een annuleringsvergoeding in rekening (25% tot 100%, afhankelijk van hoe laat er wordt afgezegd);",
          "c. Van wat BDZBookings daadwerkelijk ontvangt, gaat het deel dat op de gage van de act ziet naar de act. De verhouding is dezelfde als bij een normaal optreden;",
          "d. Al gemaakte, aantoonbare kosten van de act worden volledig vergoed;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) zoeken partijen samen naar een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten;"
        ]
      },
      {
        "label": "Veiligheid en gedrag:",
        "regels": [
          "a. De act is verzekerd voor zijn eigen apparatuur en beschikt over een bedrijfsaansprakelijkheidsverzekering;",
          "b. De act mag stoppen als de situatie onveilig is (agressie, gedrang, een onveilig podium of onveilige stroom) en meldt dat direct bij BDZBookings. De gage blijft in dat geval gewoon verschuldigd;",
          "c. De act komt nuchter en uitgerust aan, blijft tijdens het optreden nuchter en drinkt hooguit met mate na afloop;",
          "d. De act gaat netjes om met de locatie en het publiek en laat de opstelplek schoon achter;"
        ]
      },
      {
        "label": "Promotie en materialen:",
        "regels": [
          "a. De act levert BDZBookings foto's, logo, een korte biografie, promotievideo en de technische wensen aan en houdt die actueel;",
          "b. BDZBookings mag deze materialen, de naam en het portret van de act gebruiken op bdzbookings.nl, in offertes en op de social media van BDZBookings, zolang de samenwerking loopt;",
          "c. BDZBookings mag foto's en korte video's van het optreden gebruiken voor eigen promotie, tenzij de act daar vooraf bezwaar tegen maakt;"
        ]
      },
      {
        "label": "Het portaal:",
        "regels": [
          "a. De act krijgt toegang tot het BDZBookings-portaal via een persoonlijke inloglink;",
          "b. In het portaal staan de bevestigde boekingen, de tijden, de locatie en het overzicht van de uitbetalingen;",
          "c. De act houdt daar zijn eigen niet-beschikbare dagen bij (vakantie, andere boekingen);",
          "d. BDZBookings neemt altijd eerst persoonlijk contact op om de beschikbaarheid te checken voordat er iets wordt vastgelegd;",
          "e. De act gaat zorgvuldig om met de gegevens van opdrachtgevers en deelt die niet met anderen;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Wijzigingen gelden alleen als ze schriftelijk of per e-mail zijn bevestigd;",
          "c. Is een bepaling niet geldig, dan blijft de rest gewoon gelden;",
          "d. Op deze overeenkomst is Nederlands recht van toepassing;",
          "e. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "f. Is deze overeenkomst niet binnen 7 dagen ondertekend retour, dan mag BDZBookings de boeking aan een andere act aanbieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  },
  {
    "id": "act-act",
    "partij": "act",
    "type": "act",
    "titel": "Optreedovereenkomst Speciale act",
    "ondertitel": "Tussen Bryan de Zwart Bookings en de act — voor goochelaars, vuurspuwers, steltenlopers, Sint & Piet(en), entertainers en vergelijkbare acts",
    "intro": "BDZBookings heeft een optreden geboekt bij een opdrachtgever en schakelt daarvoor de Act in. BDZBookings en de Act spreken het volgende af:",
    "partijen": [
      {
        "label": "Boekingskantoor:",
        "regels": BOEKINGSKANTOOR
      },
      {
        "label": "Act:",
        "regels": [
          "Naam act: {{act_naam}}",
          "Soort act: {{act_soort}}",
          "Contactpersoon: {{act_contact}}",
          "Adres: {{act_adres}}",
          "E-mail: {{e_mail}}",
          "Aantal personen dat meekomt: {{aantal_personen_dat_meekomt}}",
          "Hierna: “de Act”;"
        ]
      }
    ],
    "artikelen": [
      {
        "label": "Optreden:",
        "regels": [
          "Datum: {{datum}}",
          "Soort gelegenheid: {{gelegenheid}}",
          "Opdrachtgever: {{opdrachtgever_naam}}",
          "Verwacht aantal gasten: {{bezoekers}}  Binnen / buiten: {{binnen_buiten}}"
        ]
      },
      {
        "label": "Locatie:",
        "regels": [
          "Naam locatie: {{locatie_naam}}",
          "Adres: {{locatie_adres}}",
          "Postcode en plaats: {{locatie_plaats}}",
          "Reistijd vanaf huisadres van de act: {{reistijd}} minuten;"
        ]
      },
      {
        "label": "Wat de Act doet:",
        "regels": [
          "Vorm: doorlopend rondlopend / vaste show / combinatie (doorhalen wat niet van toepassing is)",
          "Aantal blokken: {{aantal_blokken}} blok(ken) van {{van}} minuten",
          "Aanwezig vanaf: {{aanwezig_vanaf}}  Start eerste blok: {{start_eerste_blok}}  Einde: {{einde}}",
          "Korte omschrijving: {{korte_omschrijving}}",
          "De Act bepaalt zelf de inhoud en de opbouw van de show;",
          "Leeftijd publiek: {{leeftijd_publiek}} (bijv. kinderfeest, gemengd, alleen volwassenen)"
        ]
      },
      {
        "label": "Wat de Act meebrengt:",
        "regels": [
          "Eigen materiaal, kostuum en rekwisieten;",
          "Eigen geluid: ja / nee (doorhalen wat niet van toepassing is)",
          "Benodigde ruimte: {{benodigde_ruimte}} x {{de_act_meebrengt}} meter, vrije hoogte {{x_meter_vrije_hoogte}} meter;",
          "Benodigde stroom: {{benodigde_stroom}} geaarde groep(en) van 230V / 16A;",
          "De Act geeft deze eisen uiterlijk 14 dagen vooraf door aan BDZBookings, zodat BDZBookings ze met de Opdrachtgever kan afstemmen;"
        ]
      },
      {
        "label": "Vuur en open vlam:",
        "regels": [
          "Dit artikel geldt alleen als de Act met vuur, vuurwerk of open vlam werkt.",
          "a. De Act werkt met eigen, goedgekeurde brandstof en materialen en volgens de eigen veiligheidsprocedure;",
          "b. De Act heeft een aansprakelijkheidsverzekering die vuuracts uitdrukkelijk meeverzekert en stuurt op verzoek een kopie van het polisblad aan BDZBookings;",
          "c. De Act geeft vooraf schriftelijk door welke veiligheidszone nodig is (minimaal 5 meter rondom en 5 meter vrije hoogte) en wat de Opdrachtgever moet regelen, zodat BDZBookings dat kan doorgeven;",
          "d. De Act controleert bij aankomst de situatie en beslist zelf of de vuuract veilig kan doorgaan;",
          "e. Is het niet veilig (harde wind, regen, brandbare versiering, te weinig ruimte, geen toestemming van de locatie), dan vervalt het vuuronderdeel. De Act biedt dan zo mogelijk een alternatief; de gage blijft volledig verschuldigd;",
          "f. De Act gebruikt geen alcohol vóór of tijdens het optreden;"
        ]
      },
      {
        "label": "Acts met kinderen:",
        "regels": [
          "a. Werkt de Act met kinderen, dan is er altijd een volwassene van de Opdrachtgever bij; de Act neemt het toezicht niet over;",
          "b. BDZBookings kan om een geldige Verklaring Omtrent het Gedrag (VOG) vragen. De Act levert die dan aan;",
          "c. De Act gaat niet één op één alleen met een kind een afgesloten ruimte in;"
        ]
      },
      {
        "label": "Acts voor volwassenen:",
        "regels": [
          "Dit artikel geldt alleen bij acts die uitsluitend voor volwassenen bedoeld zijn.",
          "a. De Act treedt alleen op in een besloten ruimte zonder publiek onder de 18 jaar;",
          "b. De Act geeft vooraf duidelijk aan wat wel en niet mag; BDZBookings legt dit vast bij de Opdrachtgever;",
          "c. Bij ongewenst gedrag stopt de Act direct en blijft de gage volledig verschuldigd;"
        ]
      },
      {
        "label": "Gage:",
        "regels": [
          "Gage van de Act (excl. btw): € {{gage}}",
          "Reis- en onkostenvergoeding (excl. btw): € {{onkosten}}",
          "Btw ({{btw_pct}}%): € {{btw}}",
          "Totaal te ontvangen (incl. btw): € {{totaal}}",
          "De bemiddelingskosten van BDZBookings (15% over de gage) worden als opslag bij de Opdrachtgever in rekening gebracht. Ze worden dus niet op de gage ingehouden;",
          "Bij een boeking die BDZBookings inkoopt bij een ander bureau geldt het overeengekomen inkooptarief;"
        ]
      },
      {
        "label": "Uitbetaling:",
        "regels": [
          "a. BDZBookings factureert de Opdrachtgever en int het volledige bedrag;",
          "b. Uitbetaling vindt plaats in de eerste week van de maand ná het optreden, op rekening {{na_het_optreden_op_rekening}} t.n.v. {{op_rekening_t_n_v}};",
          "c. Voor de uitbetaling stuurt de act een factuur aan info@bdzbookings.nl, uiterlijk in de laatste week van de maand van het optreden. Heeft de act geen eigen facturatie, dan maakt BDZBookings de factuur namens de act op (self-billing) en stuurt die ter controle mee;",
          "d. Ontvangt BDZBookings het geld van de Opdrachtgever niet op tijd, dan meldt BDZBookings dat direct en spant BDZBookings zich in om te innen. De uitbetaling schuift dan op tot na ontvangst;"
        ]
      },
      {
        "label": "Zelfstandigheid en belastingen:",
        "regels": [
          "a. De act werkt als zelfstandige en niet in dienst van BDZBookings. Er is geen dienstverband en geen gezagsverhouding;",
          "b. De act regelt zelf zijn belastingaangifte, verzekeringen en pensioen;",
          "c. KvK-nummer: {{c_kvk_nummer}}  Btw-nummer: {{btw_nummer}}",
          "d. Heeft de act geen KvK-inschrijving, dan valt het optreden onder de artiestenregeling van de Belastingdienst. De act levert dan vooraf een ingevulde gageverklaring en een kopie van een geldig identiteitsbewijs aan (rijbewijs volstaat niet);",
          "e. De act neemt op de dag van het optreden een geldig identiteitsbewijs mee;"
        ]
      },
      {
        "label": "Niet-exclusief:",
        "regels": [
          "a. Deze overeenkomst geldt alleen voor het hierboven genoemde optreden;",
          "b. De act blijft vrij om zelf boekingen aan te nemen en om bij andere bureaus aangesloten te blijven. BDZBookings werkt niet exclusief;",
          "c. De act houdt zijn beschikbaarheid in het portaal actueel, zodat BDZBookings weet wanneer er wel of niet geboekt kan worden;"
        ]
      },
      {
        "label": "Rechtstreeks boeken:",
        "regels": [
          "a. Neemt de Opdrachtgever van dit optreden tijdens of na de avond rechtstreeks contact op voor een nieuwe boeking, dan verwijst de act door naar BDZBookings;",
          "b. Boekt diezelfde Opdrachtgever de act binnen 12 maanden na dit optreden toch rechtstreeks, dan meldt de act dat en is over die boeking alsnog de gebruikelijke bemiddelingsvergoeding van 15% aan BDZBookings verschuldigd;",
          "c. Dit geldt niet voor opdrachtgevers die de act al vóór deze boeking als klant had. Twijfel je? Meld het even, dan is het zo geregeld;"
        ]
      },
      {
        "label": "Afspraken op de avond:",
        "regels": [
          "a. Afspraken over extra speeltijd, extra kosten of een andere invulling lopen altijd via BDZBookings, ook op de avond zelf;",
          "b. De act maakt geen prijsafspraken met de Opdrachtgever en deelt geen eigen tarieven;",
          "c. Bryan de Zwart is de hele avond bereikbaar op 085 060 6460;"
        ]
      },
      {
        "label": "Afzeggen door de Act:",
        "regels": [
          "a. Kan de act door ziekte, ongeval of een andere onvoorziene reden niet komen, dan belt de act BDZBookings direct — niet appen en niet wachten;",
          "b. De act denkt mee over een geschikte vervanger van vergelijkbaar niveau. BDZBookings bepaalt in overleg met de Opdrachtgever of die vervanger doorgaat;",
          "c. Zegt de act af zonder geldige reden of komt de act niet opdagen, dan is de act aansprakelijk voor de schade van BDZBookings, waaronder de kosten van een vervangende act en de misgelopen bemiddelingsvergoeding;",
          "d. Een dubbele boeking of een beter betaald optreden is geen geldige reden;"
        ]
      },
      {
        "label": "Afzeggen door de Opdrachtgever:",
        "regels": [
          "a. Zegt de Opdrachtgever de boeking af, dan meldt BDZBookings dit zo snel mogelijk;",
          "b. BDZBookings brengt de Opdrachtgever een annuleringsvergoeding in rekening (25% tot 100%, afhankelijk van hoe laat er wordt afgezegd);",
          "c. Van wat BDZBookings daadwerkelijk ontvangt, gaat het deel dat op de gage van de act ziet naar de act. De verhouding is dezelfde als bij een normaal optreden;",
          "d. Al gemaakte, aantoonbare kosten van de act worden volledig vergoed;"
        ]
      },
      {
        "label": "Overmacht:",
        "regels": [
          "a. Bij overmacht (extreem weer, overheidsmaatregelen, een afgelast evenement, brand of stroomuitval op de locatie) zoeken partijen samen naar een nieuwe datum binnen 12 maanden, onder dezelfde voorwaarden;",
          "b. Komt er geen nieuwe datum, dan draagt ieder de eigen kosten;"
        ]
      },
      {
        "label": "Veiligheid en gedrag:",
        "regels": [
          "a. De act is verzekerd voor zijn eigen apparatuur en beschikt over een bedrijfsaansprakelijkheidsverzekering;",
          "b. De act mag stoppen als de situatie onveilig is (agressie, gedrang, een onveilig podium of onveilige stroom) en meldt dat direct bij BDZBookings. De gage blijft in dat geval gewoon verschuldigd;",
          "c. De act komt nuchter en uitgerust aan, blijft tijdens het optreden nuchter en drinkt hooguit met mate na afloop;",
          "d. De act gaat netjes om met de locatie en het publiek en laat de opstelplek schoon achter;"
        ]
      },
      {
        "label": "Promotie en materialen:",
        "regels": [
          "a. De act levert BDZBookings foto's, logo, een korte biografie, promotievideo en de technische wensen aan en houdt die actueel;",
          "b. BDZBookings mag deze materialen, de naam en het portret van de act gebruiken op bdzbookings.nl, in offertes en op de social media van BDZBookings, zolang de samenwerking loopt;",
          "c. BDZBookings mag foto's en korte video's van het optreden gebruiken voor eigen promotie, tenzij de act daar vooraf bezwaar tegen maakt;"
        ]
      },
      {
        "label": "Het portaal:",
        "regels": [
          "a. De act krijgt toegang tot het BDZBookings-portaal via een persoonlijke inloglink;",
          "b. In het portaal staan de bevestigde boekingen, de tijden, de locatie en het overzicht van de uitbetalingen;",
          "c. De act houdt daar zijn eigen niet-beschikbare dagen bij (vakantie, andere boekingen);",
          "d. BDZBookings neemt altijd eerst persoonlijk contact op om de beschikbaarheid te checken voordat er iets wordt vastgelegd;",
          "e. De act gaat zorgvuldig om met de gegevens van opdrachtgevers en deelt die niet met anderen;"
        ]
      },
      {
        "label": "Slotafspraken:",
        "regels": [
          "a. Deze overeenkomst vervangt alle eerdere afspraken over dit optreden;",
          "b. Wijzigingen gelden alleen als ze schriftelijk of per e-mail zijn bevestigd;",
          "c. Is een bepaling niet geldig, dan blijft de rest gewoon gelden;",
          "d. Op deze overeenkomst is Nederlands recht van toepassing;",
          "e. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar BDZBookings kantoor houdt;",
          "f. Is deze overeenkomst niet binnen 7 dagen ondertekend retour, dan mag BDZBookings de boeking aan een andere act aanbieden;"
        ]
      },
      {
        "label": "Aanvullende afspraken:",
        "regels": [
          "{{aanvullende_afspraken}}",
          "{{aanvullende_afspraken_2}}",
          "{{aanvullende_afspraken_3}}"
        ]
      }
    ]
  }
];

export function vindSjabloon(partij: Partij, type: ActType): Sjabloon {
  const s = SJABLONEN.find((x) => x.partij === partij && x.type === type);
  if (!s) throw new Error(`Geen sjabloon voor ${partij}/${type}`);
  return s;
}

/** Vervangt {{veld}} door de waarde, of door een stippellijn als die leeg is. */
export function vulIn(regel: string, waarden: Record<string, string | null | undefined>) {
  return regel.replace(/{{(\w+)}}/g, (_, veld) => {
    const w = waarden[veld];
    return w === undefined || w === null || w === "" ? "……………………" : String(w);
  });
}
