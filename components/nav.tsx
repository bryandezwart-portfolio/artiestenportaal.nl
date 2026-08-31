"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/dashboard/releases", label: "Releases" },
  { href: "/dashboard/income", label: "Inkomsten" },
  { href: "/dashboard/artists", label: "Artiesten" },
  { href: "/dashboard/afrekening", label: "Afrekening" },
  { href: "/dashboard/activiteit", label: "Activiteit" },
];

export default function Nav({
  email,
  isAdmin,
}: {
  email: string;
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
    <nav className="no-print sticky top-0 z-40 backdrop-blur-xl bg-white/75 border-b border-line">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Artiestenportaal.nl" className="h-8 w-auto shrink-0" />
          {isAdmin && (
            <div className="hidden md:flex items-center gap-0.5 ml-2">
              {ADMIN_LINKS.map((link) => {
                const active =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] px-3 py-1.5 rounded-md transition ${
                      active
                        ? "bg-surfaceHover text-ink font-medium"
                        : "text-muted hover:text-ink hover:bg-surfaceHover/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              
              
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/account/password"
            className="hidden xl:inline text-[13px] text-muted hover:text-ink transition"
          >
            Wachtwoord
          </Link>
          <button
            onClick={handleSignOut}
            className="text-[13px] font-medium text-ink bg-surface border border-line hover:bg-surfaceHover px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            Uitloggen
          </button>
        </div>
      </div>
      {isAdmin && (
        <div className="md:hidden flex items-center gap-1 px-4 pb-2.5 overflow-x-auto">
          {ADMIN_LINKS.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12.5px] px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  active ? "bg-surfaceHover text-ink font-medium" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          
          <Link
            href="/bookings"
            className="whitespace-nowrap rounded-md border border-line bg-surface px-2.5 py-1 text-[12.5px] font-medium text-ink"
          >
            BDZBookings →
          </Link>
        </div>
      )}
      {isAdmin && (
        <div className="border-t border-line bg-surface/40">
          <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between gap-3">
            <span className="text-[12px] text-muted">Boekingskantoor</span>
            <Link
              href="/bookings"
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
            >
              Naar BDZBookings
              <span aria-hidden="true" className="text-white/60">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
