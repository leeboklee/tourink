"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ReportRow = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  reporter: { handle: string; name: string };
  targetUser: { handle: string; name: string; id: string } | null;
  post: { id: string; caption: string; active: boolean; shadowHidden: boolean } | null;
};

export function ModerationQueue({ initial }: { initial: ReportRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(reportId: string, action: string) {
    setBusyId(reportId);
    setError(null);
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (!initial.length) {
    return (
      <p className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-6 text-sm text-white/55">
        No open reports. Queue is clear.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
      {initial.map((r) => (
        <article
          key={r.id}
          className="rounded-xl border border-white/10 bg-ink-900/40 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-paper">
                {r.reason} · {r.targetType}/{r.targetId}
              </p>
              <p className="mt-1 text-xs text-white/45">
                by @{r.reporter.handle}
                {r.targetUser ? ` → @${r.targetUser.handle}` : ""} ·{" "}
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="rounded-md border border-neon-amber/30 bg-neon-amber/10 px-2 py-0.5 text-[11px] text-neon-amber">
              {r.status}
            </span>
          </div>
          {r.post ? (
            <p className="mt-3 text-sm text-white/70">
              Post: {r.post.caption.slice(0, 180)}
              {r.post.shadowHidden ? " · already shadow-hidden" : ""}
              {!r.post.active ? " · removed" : ""}
            </p>
          ) : null}
          {r.details ? <p className="mt-2 text-xs text-white/45">{r.details}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => act(r.id, "shadow_hide")}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-neon-cyan/40 disabled:opacity-50"
            >
              Shadow hide
            </button>
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => act(r.id, "remove_post")}
              className="rounded-lg border border-neon-pink/30 px-3 py-1.5 text-xs text-neon-pink hover:bg-neon-pink/10 disabled:opacity-50"
            >
              Remove post
            </button>
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => act(r.id, "dismiss")}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-paper disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
