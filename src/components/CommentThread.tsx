"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Comment } from "@/data/mock";
import { isOfficialAiHandle } from "@/data/mock";
import { OfficialAiBadge } from "@/components/OfficialAiBadge";

export function CommentThread({
  postId,
  initial
}: {
  postId: string;
  initial: Comment[];
}) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: draft.trim() })
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setItems((prev) => [...prev, data.comment]);
        setDraft("");
        setError(null);
      } else {
        setError(typeof data.error === "string" ? data.error : "Could not post comment");
      }
    } catch {
      setError("Could not post comment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="comments" className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
        Comments · {items.length}
      </h2>
      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <Image
              src={c.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
              alt={c.author}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                <Link href={`/u/${c.author}`} className="font-medium text-white/80 hover:text-neon-cyan">
                  @{c.author}
                </Link>
                {isOfficialAiHandle(c.author) ? <OfficialAiBadge compact /> : null}
                {c.isLocal && !isOfficialAiHandle(c.author) ? (
                  <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                    local
                  </span>
                ) : null}
                <span className="ml-auto">{c.createdAt}</span>
              </div>
              <p className="mt-1 text-sm text-white/85">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
      <form className="flex gap-2" onSubmit={onSubmit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question or tip a spot…"
          className="flex-1 rounded-xl border border-white/10 bg-ink-950/80 px-3 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-neon-cyan/40"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-neon-pink px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          Post
        </button>
      </form>
    </div>
  );
}
