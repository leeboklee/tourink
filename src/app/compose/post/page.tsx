"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { moderateTextClient } from "@/lib/moderation/client";

export default function ComposePostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const clientCheck = moderateTextClient(caption);
    if (!clientCheck.ok) {
      setError(clientCheck.error ?? "Content blocked");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/compose/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          location: location || "Seoul, Korea"
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      setNote(true);
      setTimeout(() => router.push("/profile?tab=posts"), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl">New post</h1>
        <Link href="/profile" className="text-sm text-white/50 hover:text-neon-cyan">
          Cancel
        </Link>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Shares into your Instagram-style Posts grid and persists to the database. Spam, abuse, and
        personal data are filtered before publish.
      </p>
      <form onSubmit={publish} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-white/20 bg-ink-800/60 text-sm text-white/40">
          Cover image uses a Korea travel placeholder until media upload is wired
        </div>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">Caption</span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Where are you wandering?"
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
            required
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Hongdae, Seoul"
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-neon-pink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110 disabled:opacity-60"
        >
          {note ? "Posted · opening My Page…" : "Share post"}
        </button>
      </form>
    </div>
  );
}
