"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav({
  email,
  label,
  isAdmin,
}: {
  email: string;
  label: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-line">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[7px] bg-ink" />
          <span className="text-[15px] font-semibold text-ink tracking-tight">
            Artiesten Portaal
          </span>
          <span className="text-[11px] font-medium text-muted bg-surface px-2 py-0.5 rounded-full ml-1">
            {label}
          </span>
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1 ml-3">
              <Link
                href="/dashboard"
                className={`text-[12.5px] px-2.5 py-1 rounded-md transition ${
                  pathname === "/dashboard"
                    ? "bg-surfaceHover text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Overzicht
              </Link>
              <Link
                href="/dashboard/artists"
                className={`text-[12.5px] px-2.5 py-1 rounded-md transition ${
                  pathname.startsWith("/dashboard/artists")
                    ? "bg-surfaceHover text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Artiesten
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-muted hidden sm:inline">{email}</span>
          <button
            onClick={handleSignOut}
            className="text-[13px] font-medium text-ink bg-surface hover:bg-surfaceHover px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </nav>
  );
}
