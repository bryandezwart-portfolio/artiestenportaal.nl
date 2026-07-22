"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const isInvite = searchParams.get("type") === "invite";

  useEffect(() => {
    const code = searchParams.get("code");

    async function establishSession() {
      // Eerst checken of er al een geldige sessie is: de Supabase-client kan de
      // code namelijk al automatisch verwerkt hebben bij het laden van de pagina
      // (bijvoorbeeld doordat een e-mailscanner zoals Outlook Safe Links de link
      // alvast heeft geopend). Zonder deze check zou de handmatige
      // exchangeCodeForSession hieronder altijd falen (de code is dan al
      // gebruikt) terwijl er stiekem al een geldige sessie klaarstond — dat gaf
      // eerder een verwarrende, onterechte foutmelding.
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        setReady(true);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // Ook hier: nogmaals checken voordat we de foutmelding tonen, voor
          // het geval de sessie tussendoor alsnog tot stand kwam.
          const { data: retrySession } = await supabase.auth.getSession();
          if (!retrySession.session) {
            setError("Deze link is verlopen of ongeldig. Vraag een nieuwe link aan.");
          }
        }
      }
      setReady(true);
    }

    establishSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }
    if (password !== confirm) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError("Instellen mislukt: " + error.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Artiestenportaal.nl"
        className="animate-logo-in w-[85vw] max-w-[567px] h-auto mb-2"
      />

      {isInvite ? (
        <div className="text-center mb-8 max-w-sm">
          <p className="text-ink text-[15px] font-medium">Beste Artiest!</p>
          <p className="text-muted text-[13px] mt-1 leading-relaxed">
            Welkom bij Artiestenportaal.nl. Dit is een uitnodiging — maak nu jouw wachtwoord aan
            om toegang te krijgen tot je persoonlijke overzicht.
          </p>
        </div>
      ) : (
        <p className="text-muted text-[13px] mb-8">Stel je nieuwe wachtwoord in</p>
      )}

      <div className="w-full max-w-sm">
        <div className="bg-surface rounded-xl2 shadow-card p-8">
          {done ? (
            <p className="text-[13.5px] text-ink text-center py-4">
              <span className="text-accent">✓</span> Wachtwoord ingesteld. Je wordt doorgestuurd…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  {isInvite ? "Kies een wachtwoord" : "Nieuw wachtwoord"}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  placeholder="Minimaal 8 tekens"
                  disabled={!ready}
                />
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  Herhaal wachtwoord
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  placeholder="••••••••"
                  disabled={!ready}
                />
              </div>
              {error && <p className="text-danger text-[12.5px]">{error}</p>}
              <button
                type="submit"
                disabled={saving || !ready}
                className="mt-1 w-full bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.98] transition disabled:opacity-50"
              >
                {saving ? "Bezig…" : isInvite ? "Account activeren" : "Wachtwoord instellen"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-[11.5px] text-muted mt-6">
          Onderdeel van Bryan de Zwart Music
        </p>
      </div>
    </main>
  );
}
