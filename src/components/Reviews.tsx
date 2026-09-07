"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import type { PlaceReview } from "@/data/mock";

export function ReviewList({ reviews }: { reviews: PlaceReview[] }) {
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <article key={r.id} className="rounded-xl border border-white/10 bg-ink-900/40 p-3">
          <div className="flex items-center justify-between gap-2 text-xs text-white/45">
            <Link href={`/u/${r.author}`} className="hover:text-neon-cyan">
              @{r.author}
            </Link>
            <span>{r.createdAt}</span>
          </div>
          <div className="mt-1 flex items-center gap-0.5 text-neon-amber">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < r.rating ? "fill-neon-amber" : "text-white/20"}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-white/80">{r.body}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {r.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-neon-cyan">
                #{t}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ReviewComposer({ placeName }: { placeName: string }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState(false);

  if (posted) {
    return (
      <p className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-3 text-sm text-neon-cyan">
        Thanks — your review of {placeName} is live (demo).
      </p>
    );
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-white/10 bg-ink-900/50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!body.trim()) return;
        setPosted(true);
      }}
    >
      <p className="text-xs uppercase tracking-wider text-white/45">Write a review</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            className={clsx(i < rating ? "text-neon-amber" : "text-white/25")}
            aria-label={`${i + 1} stars`}
          >
            <Star size={18} className={i < rating ? "fill-neon-amber" : ""} />
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Crowd, door policy, English-friendly?"
        className="w-full rounded-lg border border-white/10 bg-ink-950/80 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-neon-cyan/40"
      />
      <button
        type="submit"
        className="rounded-lg bg-neon-pink px-3 py-2 text-sm font-semibold text-white hover:brightness-110"
      >
        Post review
      </button>
    </form>
  );
}
