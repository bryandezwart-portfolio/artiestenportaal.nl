"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "link">("password");
  const [linkSent, setLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Inloggen mislukt. Controleer je e-mail en wachtwoord.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setLoading(false);
    if (error) {
      setError("Versturen mislukt. Controleer je e-mailadres.");
      return;
    }
    setLinkSent(true);
  }

  return (
    <main className="animate-blur-in min-h-screen flex items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-ink mx-auto mb-4 shadow-sm" />
          <h1 className="text-[24px] font-semibold text-ink tracking-tight">
            Artiesten Portaal
          </h1>
          <p className="text-muted text-[13px] mt-1">Log in om je overzicht te zien</p>
        </div>

        <div className="bg-surface rounded-xl2 shadow-card p-8">
          <div className="flex gap-1 bg-canvas rounded-lg p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setLinkSent(false);
                setError("");
              }}
              className={`flex-1 text-[12.5px] font-medium py-1.5 rounded-md transition ${
                mode === "password" ? "bg-surfaceHover text-ink" : "text-muted"
              }`}
            >
              Wachtwoord
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("link");
                setLinkSent(false);
                setError("");
              }}
              className={`flex-1 text-[12.5px] font-medium py-1.5 rounded-md transition ${
                mode === "link" ? "bg-surfaceHover text-ink" : "text-muted"
              }`}
            >
              E-maillink
            </button>
          </div>

          {mode === "password" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  placeholder="jij@label.nl"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-danger text-[12.5px]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "Bezig…" : "Inloggen"}
              </button>
            </form>
          ) : linkSent ? (
            <p className="text-[13.5px] text-ink text-center py-4">
              <span className="text-accent">✓</span> Check je inbox — we hebben een inloglink
              gestuurd naar <strong>{email}</strong>.
            </p>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  placeholder="jij@label.nl"
                />
              </div>
              {error && <p className="text-danger text-[12.5px]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "Bezig…" : "Stuur inloglink"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[12px] text-muted mt-6">
          Nieuwe artiest? Vraag het label om een uitnodiging te sturen.
        </p>
      </div>
    </main>
  );
}
