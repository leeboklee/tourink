"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ComposeThreadPage() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [note, setNote] = useState(false);

  function publish(e: React.FormEvent) {
    e.preventDefault();
    setNote(true);
    setTimeout(() => router.push("/profile?tab=threads"), 900);
  }

  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl">New thread</h1>
        <Link href="/profile?tab=threads" className="text-sm text-white/50 hover:text-neon-cyan">
          Cancel
        </Link>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Threads-style text timeline — tips, takes, and local notes (mock).
      </p>
      <form onSubmit={publish} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">What&apos;s happening in Korea?</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Start a thread…"
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-neon-cyan/90 px-4 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
        >
          {note ? "Posted · opening Threads…" : "Post thread"}
        </button>
      </form>
    </div>
  );
}
