/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Vercel laat de lettertypebestanden van pdfkit weg bij het uitrollen,
    // omdat ze niet als import herkend worden. Hier zeggen we dat ze mee moeten,
    // anders crasht het maken van een pdf op productie met MODULE_NOT_FOUND.
    outputFileTracingIncludes: {
      "/api/bookings/contracten/genereer": ["./node_modules/pdfkit/js/**/*"],
      "/api/bookings/contracten/tekenen": ["./node_modules/pdfkit/js/**/*"],
    },
  },
};
module.exports = nextConfig;
