import { createAdminClient } from "@/lib/supabase/admin";
const supabaseAdmin = createAdminClient();
import TekenFormulier from "@/components/bookings/TekenFormulier";
import type { ActType, Partij } from "@/lib/bookings/contract-sjablonen";

// Deze pagina staat bewust buiten app/bookings, zodat klanten en acts
// er zonder inloggen bij kunnen. Hetzelfde patroon als app/bevestig/[id].
export const dynamic = "force-dynamic";

function Kader({ titel, tekst }: { titel: string; tekst: string }) {
  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-lg font-semibold text-neutral-900">{titel}</h1>
        <p className="mt-2 text-sm text-neutral-600">{tekst}</p>
        <p className="mt-6 text-xs text-neutral-400">
          Bryan de Zwart Bookings · 085 060 6460 · info@bdzbookings.nl
        </p>
      </div>
    </main>
  );
}

export default async function TekenPagina({ params }: { params: { token: string } }) {
  const { data: contract } = await supabaseAdmin
    .from("bdzbookings_contracten")
    .select("id, partij, act_type, waarden, status, pdf_pad, getekend_op")
    .eq("token", params.token)
    .maybeSingle();

  if (!contract) {
    return (
      <Kader
        titel="Deze link werkt niet meer"
        tekst="Mogelijk is er inmiddels een nieuwe versie van de overeenkomst verstuurd. Neem even contact op, dan stuur ik je een nieuwe link."
      />
    );
  }

  if (contract.status === "vervallen") {
    return (
      <Kader
        titel="Deze versie is vervallen"
        tekst="Er is een nieuwere versie van deze overeenkomst. Je hebt daarvan een aparte link ontvangen."
      />
    );
  }

  if (contract.status === "getekend") {
    const { data: link } = await supabaseAdmin.storage
      .from("contracten")
      .createSignedUrl(contract.pdf_pad!, 60 * 60 * 24 * 7);
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-lg font-semibold text-neutral-900">Al ondertekend</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Deze overeenkomst is getekend op{" "}
            {new Date(contract.getekend_op!).toLocaleDateString("nl-NL")}. Bedankt.
          </p>
          {link?.signedUrl ? (
            <a
              href={link.signedUrl}
              className="mt-6 inline-block rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white"
            >
              Download de ondertekende pdf
            </a>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <TekenFormulier
      token={params.token}
      partij={contract.partij as Partij}
      actType={contract.act_type as ActType}
      waarden={(contract.waarden ?? {}) as Record<string, string>}
    />
  );
}
