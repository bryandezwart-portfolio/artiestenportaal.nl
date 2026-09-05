import AanvraagFormulier from "@/components/bookings/AanvraagFormulier";

export const metadata = {
  title: "Aanvraag — Bryan de Zwart Bookings",
  description: "Vraag vrijblijvend een artiest, dj of band aan.",
};

export default function AanvraagPage({
  searchParams,
}: {
  searchParams: { act?: string };
}) {
  return <AanvraagFormulier actSlug={searchParams.act ?? ""} />;
}
