"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/bookings", label: "Overzicht" },
  { href: "/bookings/aanvragen", label: "Aanvragen" },
  { href: "/bookings/contacten", label: "Contacten" },
  { href: "/bookings/zoeken", label: "Wie is vrij?" },
  { href: "/bookings/rapportage", label: "Rapportage" },
  { href: "/bookings/acts/nieuw", label: "Nieuwe act" },
  { href: "/bookings/nieuw", label: "Nieuwe boeking" },
];

export default function BookingsNav({ nieuweAanvragen = 0 }: { nieuweAanvragen?: number }) {
  const pathname = usePathname();

  return (
    <div
      className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur print:hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5 sm:px-10">
        <Link href="/bookings" className="flex items-center">
          <img src="/bdzbookings-logo.png" alt="BDZBookings" className="h-14 w-auto opacity-90" />
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/bookings" ? pathname === "/bookings" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                  active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {link.label}
                {link.href === "/bookings/aanvragen" && nieuweAanvragen > 0 && (
                  <span
                    className={`ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-semibold ${
                      active ? "bg-white text-neutral-900" : "bg-amber-500 text-white"
                    }`}
                  >
                    {nieuweAanvragen}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50/60">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-6 py-2 sm:px-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-800"
          >
            <span aria-hidden="true" className="text-white/60">&larr;</span>
            Naar Artiestenportaal
          </Link>
        </div>
      </div>
    </div>
  );
}
