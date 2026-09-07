"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Offer = {
  offerId: string;
  optionName: string;
  startTime: string;
  currency: string;
  unitPrice: number;
  totalPrice: number;
  participants: number;
  cancellation: string;
  refundable: boolean;
  includes?: string;
};

type AvailabilityResponse = {
  experienceId: string;
  provider: string;
  providerDisplayName?: string;
  date: string;
  participants: number;
  offers: Offer[];
  meta?: { mode: string; message?: string };
  error?: unknown;
};

function defaultDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

export function ExperienceAvailabilityPanel({
  experienceId,
  currency,
  priceFrom
}: {
  experienceId: string;
  currency: string;
  priceFrom: number;
}) {
  const [date, setDate] = useState(defaultDate);
  const [participants, setParticipants] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AvailabilityResponse | null>(null);
  const [autoChecked, setAutoChecked] = useState(false);

  async function loadAvailability() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        experienceId,
        date,
        participants: String(participants)
      });
      const res = await fetch(`/api/experiences/availability?${qs}`);
      const data = (await res.json()) as AvailabilityResponse;
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Availability check failed");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Availability check failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoChecked) return;
    setAutoChecked(true);
    void loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial availability only
  }, [autoChecked]);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-ink-950/40 p-4">
      <div>
        <h2 className="font-display text-lg text-paper">Check availability</h2>
        <p className="mt-1 text-xs text-white/50">
          From {currency} {priceFrom.toLocaleString()} / guest · slots via ExperienceProvider
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Guests</span>
          <input
            type="number"
            min={1}
            max={12}
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value) || 1)}
            className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void loadAvailability()}
        disabled={loading}
        className="w-full rounded-xl bg-neon-pink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Checking slots…" : "Check availability"}
      </button>

      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}

      {result?.meta?.message ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">
          {result.providerDisplayName ?? result.provider}
          {result.meta.mode === "mock" ? " (mock)" : ""} · {result.meta.message}
        </p>
      ) : null}

      {result && result.offers.length === 0 && !loading ? (
        <p className="text-sm text-white/60">No slots for this date. Try another day.</p>
      ) : null}

      {result && result.offers.length > 0 ? (
        <ul className="space-y-3">
          {result.offers.map((offer) => {
            const bookHref = `/book/experience/${experienceId}?${new URLSearchParams({
              date: result.date,
              guests: String(result.participants),
              offerId: offer.offerId,
              unitPrice: String(offer.unitPrice),
              totalPrice: String(offer.totalPrice),
              optionName: offer.optionName,
              startTime: offer.startTime
            }).toString()}`;

            return (
              <li
                key={offer.offerId}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-ink-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium text-paper">{offer.optionName}</p>
                  <p className="text-xs text-white/55">
                    Starts {offer.startTime}
                    {offer.includes ? ` · ${offer.includes}` : ""}
                  </p>
                  <p className="text-xs text-white/45">{offer.cancellation}</p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-neon-amber">
                      {offer.currency} {offer.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/45">
                      {offer.currency} {offer.unitPrice.toLocaleString()} / guest
                    </p>
                  </div>
                  <Link
                    href={bookHref}
                    className="rounded-xl bg-neon-cyan/90 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:brightness-110"
                  >
                    Book
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
