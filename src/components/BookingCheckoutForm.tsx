"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingCheckoutForm({
  itemType,
  itemId,
  itemTitle,
  unitPrice,
  currency,
  mode
}: {
  itemType: "hotel" | "experience";
  itemId: string;
  itemTitle: string;
  unitPrice: number;
  currency: string;
  mode: "hotel" | "experience";
}) {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          itemId,
          guestName,
          guestEmail,
          checkIn: mode === "hotel" ? checkIn : undefined,
          checkOut: mode === "hotel" ? checkOut : undefined,
          guests,
          notes: notes || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Booking failed");
      router.push(`/book/confirm/${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-ink-900/60 p-5">
      <div>
        <h2 className="font-display text-xl text-paper">Checkout</h2>
        <p className="mt-1 text-sm text-white/55">
          {itemTitle} · from {currency} {unitPrice.toLocaleString()}
          {mode === "hotel" ? " / night" : " / guest"}
        </p>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">Full name</span>
        <input
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">Email</span>
        <input
          required
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
        />
      </label>

      {mode === "hotel" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Check-in</span>
            <input
              required
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Check-out</span>
            <input
              required
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
            />
          </label>
        </div>
      ) : null}

      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">Guests</span>
        <input
          type="number"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value) || 1)}
          className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
        />
      </label>

      <p className="rounded-xl border border-neon-amber/30 bg-neon-amber/10 px-3 py-2 text-xs text-neon-amber">
        Payment: test mode when Stripe keys are absent. Orders still persist to the database.
      </p>

      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neon-pink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Saving reservation…" : "Confirm reservation"}
      </button>
    </form>
  );
}
