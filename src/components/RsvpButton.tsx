"use client";

import { useState } from "react";
import { Check, Users } from "lucide-react";
import { clsx } from "clsx";

export function RsvpButton({
  meetupId,
  spots,
  going: initialGoing
}: {
  meetupId: string;
  spots: number;
  going: number;
}) {
  const [going, setGoing] = useState(false);
  const [count, setCount] = useState(initialGoing);
  const [busy, setBusy] = useState(false);
  const full = !going && count >= spots;

  async function toggle() {
    if (busy || full) return;
    setBusy(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetupId })
      });
      const data = await res.json();
      if (res.ok) {
        setGoing(!!data.going);
        setCount(data.count ?? count);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={full || busy}
      onClick={toggle}
      className={clsx(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60",
        going
          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
          : full
            ? "cursor-not-allowed bg-white/5 text-white/35"
            : "bg-neon-pink text-white shadow-lg shadow-neon-pink/20 hover:brightness-110"
      )}
    >
      {going ? <Check size={16} /> : <Users size={16} />}
      {going ? `You're going · ${count}/${spots}` : full ? "Full" : `RSVP · ${count}/${spots} spots`}
    </button>
  );
}
