"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Flag, Heart, MessageCircle, MoreHorizontal, Send, MapPin, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FeedPost } from "@/data/mock";
import { FollowButton } from "@/components/FollowButton";
import { blockHandle } from "@/lib/socialPrefs";

export function FeedCard({
  post,
  onAuthorBlocked
}: {
  post: FeedPost;
  onAuthorBlocked?: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareNote, setShareNote] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const likes = post.likes + (liked ? 1 : 0);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
      /* cancelled */
    }
  }

  function report() {
    setReported(true);
    setMenuOpen(false);
  }

  function block() {
    blockHandle(post.author);
    setMenuOpen(false);
    onAuthorBlocked?.();
  }

  return (
    <article className="overflow-hidden border-b border-white/10 bg-ink-900/40 lg:rounded-2xl lg:border lg:shadow-feed">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/u/${post.author}`}>
          <Image
            src={post.avatar}
            alt={post.author}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/u/${post.author}`} className="truncate text-sm font-semibold hover:text-neon-cyan">
              {post.author}
            </Link>
            <FollowButton handle={post.author} compact />
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
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-paper"
            aria-label="Post menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-xl">
              <button
                type="button"
                onClick={report}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-white/80 hover:bg-white/5"
              >
                <Flag size={14} /> Report post
              </button>
              <button
                type="button"
                onClick={block}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-neon-pink hover:bg-white/5"
              >
                <UserX size={14} /> Block @{post.author}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {reported ? (
        <p className="border-b border-white/10 bg-neon-amber/10 px-4 py-2 text-xs text-neon-amber">
          Thanks — we hid this from your report queue (demo).
        </p>
      ) : null}

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
