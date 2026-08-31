"use client";

import React, { useState } from "react";

interface BookingDetails {
  actName: string;
  date: string;
  start: string;
  end: string;
  locatie: string;
  gage: string;
}

const MOCK_BOOKING: BookingDetails = {
  actName: "DJ Lumo",
  date: "Vrijdag 28 augustus 2026",
  start: "22:00",
  end: "02:00",
  locatie: "Club Vault, Arnhem",
  gage: "€ 450",
};

export default function BookingConfirmation() {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [showIssue, setShowIssue] = useState(false);
  const [issueSent, setIssueSent] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    setConfirmedAt(
      new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date())
    );
  }

  return (
    <div
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}
    >
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-[13px] font-medium text-neutral-400">BDZBookings</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
          Bevestiging voor {MOCK_BOOKING.actName}
        </h1>

        <div className="mt-5 space-y-2 rounded-xl bg-neutral-50 p-4">
          <div className="flex justify-between text-[13px]">
            <span className="text-neutral-500">Datum</span>
            <span className="font-medium text-neutral-900">{MOCK_BOOKING.date}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-neutral-500">Tijd</span>
            <span className="font-medium text-neutral-900">
              {MOCK_BOOKING.start} – {MOCK_BOOKING.end}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-neutral-500">Locatie</span>
            <span className="font-medium text-neutral-900">{MOCK_BOOKING.locatie}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-neutral-500">Gage</span>
            <span className="font-medium text-neutral-900">{MOCK_BOOKING.gage}</span>
          </div>
        </div>

        {!confirmed ? (
          <>
            <p className="mt-5 text-[13px] text-neutral-500">
              Zoals telefonisch afgestemd — bevestig hieronder voor de administratie.
            </p>
            <button
              onClick={handleConfirm}
              className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-800"
            >
              Bevestigen
            </button>

            {!showIssue ? (
              <button
                onClick={() => setShowIssue(true)}
                className="mt-3 w-full text-center text-[13px] text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
              >
                Klopt dit niet?
              </button>
            ) : !issueSent ? (
              <div className="mt-3 rounded-xl border border-neutral-200 p-3">
                <p className="text-[13px] text-neutral-600">
                  Neem even contact op met Bryan om dit recht te zetten — dit scherm stuurt geen automatische
                  afwijzing.
                </p>
                <button
                  onClick={() => setIssueSent(true)}
                  className="mt-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Laat weten dat er iets niet klopt
                </button>
              </div>
            ) : (
              <p className="mt-3 text-center text-[13px] text-neutral-500">Bryan is op de hoogte gebracht.</p>
            )}
          </>
        ) : (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center">
            <p className="text-[14px] font-medium text-emerald-800">Bevestigd</p>
            <p className="mt-0.5 text-[12px] text-emerald-700">Bevestigd op {confirmedAt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
