"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export type AiContentKind = "feed" | "thread" | "reel";

export type AiContentItem = {
  kind: AiContentKind;
  id: string;
  preview: string;
  createdAt: string;
  active: boolean;
  meta?: string;
};

export type AiCreatorBundle = {
  id: string;
  handle: string;
  name: string;
  persona: string | null;
  image: string | null;
  city: string;
  items: AiContentItem[];
};

export function AiAnswersPanel({ creators }: { creators: AiCreatorBundle[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(item: AiContentItem) {
    const key = `${item.kind}:${item.id}`;
    setPending(key);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: item.kind,
          id: item.id,
          active: !item.active
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Toggle failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setPending(null);
    }
  }

  if (creators.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-6 text-sm text-white/55">
        No Official AI creators found. Run <code className="text-neon-cyan">npm run db:seed</code>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
      {creators.map((c) => (
        <section
          key={c.id}
          className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-paper">
                @{c.handle}{" "}
                <span className="font-normal text-white/45">· {c.name}</span>
              </p>
              <p className="mt-0.5 text-xs text-white/45">
                {c.persona || "Official AI"} · {c.city}
              </p>
            </div>
            <Link
              href={`/u/${c.handle}`}
              className="text-xs text-neon-cyan hover:underline"
            >
              Public profile →
            </Link>
          </div>

          {c.items.length === 0 ? (
            <p className="mt-3 text-xs text-white/40">No recent posts / threads / reels.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/5">
              {c.items.map((item) => {
                const key = `${item.kind}:${item.id}`;
                const busy = pending === key;
                return (
                  <li key={key} className="flex flex-wrap items-start justify-between gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-white/40">
                        {item.kind}
                        {item.meta ? ` · ${item.meta}` : ""}
                        {!item.active ? (
                          <span className="ml-2 text-neon-amber">hidden</span>
                        ) : null}
                      </p>
                      <p
                        className={`mt-0.5 text-sm ${item.active ? "text-white/80" : "text-white/35 line-through"}`}
                      >
                        {item.preview}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/35">{item.createdAt}</p>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => toggle(item)}
                      className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/70 hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-50"
                    >
                      {busy ? "…" : item.active ? "Hide" : "Approve"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
