// Centraal ingesteld hoofdadres van de site, gebruikt in e-maillinks
// (uitnodigingen, magic links, wachtwoord-reset). Zet dit in Vercel en
// lokaal in .env.local als NEXT_PUBLIC_SITE_URL, zodat je nooit meer een
// verkeerd (preview-)domein in een e-mail krijgt.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://artiestenportaal-nl.vercel.app";
