"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FOLLOWING_HANDLES,
  feedPosts,
  meetups,
  profiles,
  type FeedPost
} from "@/data/mock";
import { FeedCard } from "@/components/FeedCard";
import { getBlockedHandles, getFollowingHandles } from "@/lib/socialPrefs";

export function HomeFeed() {
  const [tab, setTab] = useState<"foryou" | "following">("foryou");
  const [blocked, setBlocked] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(DEFAULT_FOLLOWING_HANDLES);

  useEffect(() => {
    function sync() {
      setBlocked(getBlockedHandles());
      setFollowing(getFollowingHandles(DEFAULT_FOLLOWING_HANDLES));
    }
    sync();
    window.addEventListener("tourink-social-change", sync);
    return () => window.removeEventListener("tourink-social-change", sync);
  }, []);

  const posts = useMemo(() => {
    const visible = feedPosts.filter((p) => !blocked.includes(p.author));
    if (tab === "following") {
      return visible.filter((p) => following.includes(p.author));
    }
    return visible;
  }, [tab, blocked, following]);

  function onBlocked() {
    setBlocked(getBlockedHandles());
  }

  return (
    <div>
      <div className="hidden px-4 pb-2 pt-2 lg:block lg:px-0">
        <h1 className="font-display text-3xl text-paper">Korea travel feed</h1>
        <p className="mt-1 text-sm text-white/55">
          Stories from Seoul, Busan, Jeju — like, save, follow, and meet up.
        </p>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-3 pt-2 lg:px-0">
        {profiles.slice(0, 5).map((p) => (
          <Link key={p.handle} href={`/u/${p.handle}`} className="flex w-16 shrink-0 flex-col items-center gap-1">
            <span className="rounded-full bg-gradient-to-tr from-neon-pink to-neon-cyan p-[2px]">
              <Image
                src={p.avatar}
                alt={p.handle}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border-2 border-ink-950 object-cover"
              />
            </span>
            <span className="w-full truncate text-center text-[10px] text-white/60">{p.handle}</span>
          </Link>
        ))}
      </div>

      <div className="mx-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar lg:mx-0">
        {meetups.slice(0, 2).map((m) => (
          <Link
            key={m.id}
            href="/hangouts"
            className="shrink-0 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1.5 text-xs text-neon-pink"
          >
            RSVP · {m.title}
          </Link>
        ))}
        <Link
          href="/community"
          className="shrink-0 rounded-full border border-neon-amber/30 bg-neon-amber/10 px-3 py-1.5 text-xs text-neon-amber"
        >
          Ask locals
        </Link>
        <Link
          href="/forum"
          className="shrink-0 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1.5 text-xs text-neon-cyan"
        >
          Forum Q&A
        </Link>
      </div>

      <div className="mx-4 mb-2 flex gap-1 rounded-xl border border-white/10 bg-ink-900/40 p-1 lg:mx-0">
        {(
          [
            { id: "foryou", label: "For You" },
            { id: "following", label: "Following" }
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "flex-1 rounded-lg bg-white/10 py-2 text-sm font-semibold text-neon-cyan"
                : "flex-1 rounded-lg py-2 text-sm text-white/55 hover:text-paper"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-0 lg:space-y-6">
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-white/50 lg:px-0">
            {tab === "following"
              ? "Follow guides to fill this tab — try Mina, Jun, or Yuna."
              : "No posts right now."}
          </p>
        ) : (
          posts.map((post: FeedPost) => (
            <FeedCard key={post.id} post={post} onAuthorBlocked={onBlocked} />
          ))
        )}
      </div>
    </div>
  );
}
