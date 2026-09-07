"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, MessageCircle, Send, MapPin } from "lucide-react";
import { useState } from "react";
import { CURRENT_USER_HANDLE, isOfficialAiHandle, type FeedPost } from "@/data/mock";
import { FollowButton } from "@/components/FollowButton";
import { OfficialAiBadge } from "@/components/OfficialAiBadge";

export function FeedCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareNote, setShareNote] = useState(false);
  const likes = post.likes + (liked ? 1 : 0);
  const isAi = isOfficialAiHandle(post.author);
  const isOwn = post.author === CURRENT_USER_HANDLE;

  async function share() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Tourink · ${post.author}`, text: post.caption, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareNote(true);
        setTimeout(() => setShareNote(false), 1600);
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <article className="overflow-hidden border-b border-white/10 bg-ink-900/40 lg:rounded-2xl lg:border lg:shadow-feed">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/u/${post.author}`} className="relative shrink-0">
          <span
            className={
              isAi
                ? "block rounded-full bg-gradient-to-tr from-neon-cyan to-neon-cyan/40 p-[2px]"
                : "block"
            }
          >
            <Image
              src={post.avatar}
              alt={post.author}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/u/${post.author}`} className="truncate text-sm font-semibold hover:text-neon-cyan">
              {post.author}
            </Link>
            {isAi ? <OfficialAiBadge compact /> : null}
            {!isOwn ? <FollowButton handle={post.author} compact /> : null}
          </div>
          <Link
            href={`/place/${encodeURIComponent(post.location)}`}
            className="flex items-center gap-1 truncate text-xs text-white/50 hover:text-neon-cyan"
          >
            <MapPin size={12} />
            {post.location}
          </Link>
        </div>
        <span className="text-xs text-white/40">{post.createdAt}</span>
      </div>

      <Link href={`/post/${post.id}`} className="relative block aspect-[4/5] bg-ink-800">
        <Image src={post.image} alt={post.caption} fill className="object-cover" sizes="(max-width:768px) 100vw, 640px" />
      </Link>

      <div className="space-y-2 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="flex items-center gap-1.5 text-sm"
            aria-label="Like"
          >
            <Heart size={22} className={liked ? "fill-neon-pink text-neon-pink" : ""} />
            {likes.toLocaleString()}
          </button>
          <Link href={`/post/${post.id}#comments`} className="flex items-center gap-1.5 text-sm text-white/70">
            <MessageCircle size={22} />
            {post.comments}
          </Link>
          <button type="button" onClick={share} className="relative text-white/70" aria-label="Share">
            <Send size={22} />
            {shareNote ? (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white/10 px-2 py-0.5 text-[10px]">
                Link copied
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            className="ml-auto text-white/70"
            aria-label="Save"
          >
            <Bookmark size={22} className={saved ? "fill-neon-amber text-neon-amber" : ""} />
          </button>
        </div>
        <p className="text-sm leading-relaxed">
          <Link href={`/u/${post.author}`} className="font-semibold hover:text-neon-cyan">
            {post.author}
          </Link>{" "}
          {post.caption}
        </p>
        <p className="text-sm text-neon-cyan/90">
          {post.tags.map((t) => (
            <Link key={t} href={`/tag/${t}`} className="mr-2 hover:underline">
              #{t}
            </Link>
          ))}
        </p>
      </div>
    </article>
  );
}
