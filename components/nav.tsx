"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav({
  email,
  label,
}: {
  email: string;
  label: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-line">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[7px] bg-ink" />
          <span className="text-[15px] font-semibold text-ink tracking-tight">Ledger</span>
          <span className="text-[11px] font-medium text-muted bg-canvas px-2 py-0.5 rounded-full ml-1">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-muted hidden sm:inline">{email}</span>
          <button
            onClick={handleSignOut}
            className="text-[13px] font-medium text-ink bg-canvas hover:bg-line/60 px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </nav>
  );
}
