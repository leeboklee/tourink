"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { clsx } from "clsx";
import { DEFAULT_FOLLOWING_HANDLES } from "@/data/mock";
import { getFollowingHandles, setFollowingHandle } from "@/lib/socialPrefs";

export function FollowButton({
  handle,
  compact = false,
  onChange
}: {
  handle: string;
  compact?: boolean;
  onChange?: (following: boolean) => void;
}) {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const list = getFollowingHandles(DEFAULT_FOLLOWING_HANDLES);
    setFollowing(list.includes(handle));
  }, [handle]);

  return (
    <button
      type="button"
      onClick={() => {
        setFollowing((v) => {
          const next = !v;
          setFollowingHandle(handle, next, DEFAULT_FOLLOWING_HANDLES);
          onChange?.(next);
          return next;
        });
      }}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold transition",
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
