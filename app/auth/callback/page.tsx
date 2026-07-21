"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Vangt links op vanuit e-mails (uitnodiging, magic link, wachtwoord-reset).
//
// Belangrijk: server-verstuurde links (uitnodigen, wachtwoord vergeten) geven
// de inloggegevens mee als #access_token=...&refresh_token=...&type=invite
// in het hash-gedeelte van de URL. Dat gedeelte wordt NOOIT naar de server
// gestuurd — alleen JavaScript in de browser kan het lezen. Vandaar dat dit
// een client-pagina is en geen server-route.
export default function AuthCallback() {
  return (
    <Suspense fallback={<CallbackShell />}>
      <AuthCallbackInner />
    </Suspense>
  );
}

function AuthCallbackInner() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    async function handle() {
      // Variant 1: ?code=... (bv. bij inloggen met magic link vanuit de browser zelf)
      const code = searchParams.get("code");
      let type = searchParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
          return;
        }
      } else {
        // Variant 2: #access_token=...&refresh_token=...&type=invite
        // (uitnodigingen en wachtwoord-reset, server-verstuurd)
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        type = type || params.get("type");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setError(error.message);
            return;
          }
        } else {
          setError("Deze link is ongeldig of verlopen. Vraag een nieuwe link aan.");
          return;
        }
      }

      if (type === "invite" || type === "recovery") {
        router.replace("/auth/reset");
      } else {
        router.replace("/");
      }
    }

    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CallbackShell error={error} />;
}

function CallbackShell({ error }: { error?: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Artiestenportaal.nl" className="w-[70vw] max-w-[420px] h-auto mb-6" />
      {error ? (
        <div className="bg-surface rounded-xl2 shadow-card p-6 max-w-sm text-center">
          <p className="text-danger text-[13.5px] mb-3">{error}</p>
          <a href="/login" className="text-accent text-[13px] font-medium hover:underline">
            Terug naar inloggen
          </a>
        </div>
      ) : (
        <p className="text-muted text-[13px]">Bezig met inloggen…</p>
      )}
    </main>
  );
}
