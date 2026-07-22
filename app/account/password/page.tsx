"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Huidig e-mailadres ophalen om het huidige wachtwoord opnieuw te kunnen
  // verifiëren voordat we een nieuw wachtwoord instellen.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Nieuw wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }
    if (password !== confirm) {
      setError("Nieuwe wachtwoorden komen niet overeen.");
      return;
    }

    setSaving(true);

    // Verifieer het huidige wachtwoord door er opnieuw mee in te loggen,
    // zodat iemand die je scherm overneemt niet zomaar het wachtwoord kan
    // wijzigen zonder het huidige wachtwoord te kennen.
    if (email) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (verifyError) {
        setSaving(false);
        setError("Huidig wachtwoord klopt niet.");
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError("Wijzigen mislukt: " + updateError.message);
      return;
    }

    setDone(true);
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <div className="max-w-sm mx-auto">
        <Link href="/" className="text-[12.5px] text-muted hover:text-ink transition">
          ← Terug
        </Link>
        <h1 className="text-[22px] font-semibold text-ink tracking-tight mt-3 mb-6">
          Wachtwoord wijzigen
        </h1>

        <div className="bg-surface rounded-xl2 shadow-card p-6">
          {done ? (
            <p className="text-[13.5px] text-ink text-center py-4">
              <span className="text-accent">✓</span> Wachtwoord gewijzigd.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  Huidig wachtwoord
                </label>
                <input
                  type="password"
                  required
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  Nieuw wachtwoord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-muted mb-1.5 block">
                  Herhaal nieuw wachtwoord
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              {error && <p className="text-danger text-[12.5px]">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="mt-1 w-full bg-accent text-white text-[13.5px] font-medium rounded-lg py-2.5 shadow-sm hover:bg-accent/90 hover:shadow active:scale-[0.98] transition disabled:opacity-50"
              >
                {saving ? "Bezig…" : "Wachtwoord wijzigen"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
