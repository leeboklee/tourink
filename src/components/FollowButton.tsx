"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { clsx } from "clsx";

export function FollowButton({
  handle,
  compact = false
}: {
  handle: string;
  compact?: boolean;
}) {
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/follows?handle=${encodeURIComponent(handle)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setFollowing(!!d.following);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [handle]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle })
      });
      const data = await res.json();
      if (res.ok) setFollowing(!!data.following);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold transition disabled:opacity-60",
        compact ? "px-2.5 py-1" : "px-3 py-1.5",
        following
          ? "border-white/20 bg-white/10 text-white/80"
          : "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20"
      )}
      aria-label={following ? `Unfollow ${handle}` : `Follow ${handle}`}
    >
      {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
      {following ? "Following" : "Follow"}
    </button>
  );
}
