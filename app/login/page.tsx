"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/site-url";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "link" | "forgot">("password");
  const [sent, setSent] = useState(false);
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
      options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError("Versturen mislukt. Controleer je e-mailadres.");
      return;
    }
    setSent(true);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError("Code onjuist of verlopen. Vraag eventueel een nieuwe code aan.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth/reset`,
    });
    setLoading(false);
    if (error) {
      setError("Versturen mislukt. Controleer je e-mailadres.");
      return;
    }
    setSent(true);
  }

  function switchMode(next: "password" | "link" | "forgot") {
    setMode(next);
    setSent(false);
    setOtp("");
    setError("");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Artiestenportaal.nl"
        className="animate-logo-in w-[85vw] max-w-[567px] h-auto mb-2"
      />
      <p
        className="animate-fade-in text-muted text-[13px] mb-8"
        style={{ animationDelay: "1.1s", animationFillMode: "both" }}
      >
        Log in om je overzicht te zien
      </p>

      <div
        className="animate-blur-in w-full max-w-sm"
        style={{ animationDelay: "1.3s", animationFillMode: "both" }}
      >
        <div className="bg-surface rounded-xl2 shadow-card p-8">
          {mode !== "forgot" && (
            <div className="flex gap-1 bg-canvas rounded-lg p-1 mb-5">
              <button
                type="button"
                onClick={() => switchMode("password")}
                className={`flex-1 text-[12.5px] font-medium py-1.5 rounded-md transition ${
                  mode === "password" ? "bg-surfaceHover text-ink" : "text-muted"
                }`}
              >
                Wachtwoord
              </button>
              <button
                type="button"
                onClick={() => switchMode("link")}
                className={`flex-1 text-[12.5px] font-medium py-1.5 rounded-md transition ${
                  mode === "link" ? "bg-surfaceHover text-ink" : "text-muted"
                }`}
              >
                E-mailcode
              </button>
            </div>
          )}

          {mode === "password" && (
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-medium text-muted block">
                    Wachtwoord
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[11.5px] text-accent hover:underline"
                  >
                    Vergeten?
                  </button>
                </div>
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
          )}

          {mode === "link" &&
            (sent ? (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <p className="text-[13.5px] text-ink text-center">
                  <span className="text-accent">✓</span> Check je inbox — we hebben een code
                  gestuurd naar <strong>{email}</strong>.
                </p>
                <div>
                  <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                    Voer de 6-cijferige code in
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={6}
                    className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[15px] tracking-[0.3em] text-center text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                    placeholder="000000"
                  />
                </div>
                {error && <p className="text-danger text-[12.5px]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="mt-1 w-full bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? "Bezig…" : "Bevestigen"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setOtp("");
                    setError("");
                  }}
                  className="text-[12px] text-muted hover:text-ink transition"
                >
                  ← Andere code aanvragen
                </button>
              </form>
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
                  {loading ? "Bezig…" : "Stuur inlogcode"}
                </button>
              </form>
            ))}

          {mode === "forgot" &&
            (sent ? (
              <p className="text-[13.5px] text-ink text-center py-4">
                <span className="text-accent">✓</span> Check je inbox — we hebben een link
                gestuurd naar <strong>{email}</strong> om een nieuw wachtwoord in te stellen.
              </p>
            ) : (
              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <p className="text-[12.5px] text-muted -mt-1">
                  Vul je e-mailadres in, dan sturen we een link om een nieuw wachtwoord in te
                  stellen.
                </p>
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
                  {loading ? "Bezig…" : "Stuur resetlink"}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("password")}
                  className="text-[12px] text-muted hover:text-ink transition"
                >
                  ← Terug naar inloggen
                </button>
              </form>
            ))}
        </div>

        <p className="text-center text-[12px] text-muted mt-6">
          Nieuwe artiest? Vraag het label om een uitnodiging te sturen.
        </p>
      </div>
    </main>
  );
}
