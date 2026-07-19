"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-ink mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Ledger</h1>
          <p className="text-muted text-sm mt-1">Log in om je overzicht te zien</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-xl2 shadow-card p-8 flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              placeholder="jij@label.nl"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Wachtwoord</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-accent text-white text-sm font-medium rounded-lg py-2.5 hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? "Bezig…" : "Inloggen"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Nieuwe artiest? Vraag het label om een account aan te maken.
        </p>
      </div>
    </main>
  );
}
