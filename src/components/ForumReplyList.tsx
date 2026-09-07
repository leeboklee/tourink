"use client";

import { useState } from "react";
import Link from "next/link";
import type { ForumReply } from "@/data/mock";

export function ForumReplyList({
  threadId,
  initial
}: {
  threadId: string;
  initial: ForumReply[];
}) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link href={`/u/${r.author}`} className="font-medium text-white/80 hover:text-neon-cyan">
                @{r.author}
              </Link>
              {r.isLocal ? (
                <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                  local
                </span>
              ) : null}
              {r.accepted ? (
                <span className="rounded bg-neon-cyan/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-cyan">
                  best answer
                </span>
              ) : null}
              <span className="ml-auto">{r.createdAt}</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{r.body}</p>
            <p className="mt-2 text-xs text-white/40">{r.likes} helpful</p>
          </li>
        ))}
      </ul>
      <form
        className="space-y-2 rounded-2xl border border-white/10 bg-ink-900/40 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          setItems((prev) => [
            ...prev,
            {
              id: `fr-local-${Date.now()}`,
              threadId,
              author: "you.traveler",
              body: draft.trim(),
              likes: 0,
              createdAt: "now"
            }
          ]);
          setDraft("");
        }}
      >
        <label className="text-xs uppercase tracking-wider text-white/45">Your answer</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Share what worked for you…"
          className="w-full rounded-xl border border-white/10 bg-ink-950/80 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-neon-cyan/40"
        />
        <button
          type="submit"
          className="rounded-xl bg-neon-pink px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          Post answer
        </button>
      </form>
    </div>
  );
}
