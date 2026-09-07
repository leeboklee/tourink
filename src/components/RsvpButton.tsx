"use client";

import { useState } from "react";
import { Check, Users } from "lucide-react";
import { clsx } from "clsx";

export function RsvpButton({
  spots,
  going: initialGoing
}: {
  spots: number;
  going: number;
}) {
  const [going, setGoing] = useState(false);
  const [count, setCount] = useState(initialGoing);
  const full = !going && count >= spots;

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => {
        setGoing((v) => {
          const next = !v;
          setCount((c) => c + (next ? 1 : -1));
          return next;
        });
      }}
      className={clsx(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
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
