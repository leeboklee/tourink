import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Play } from "lucide-react";
import { reelPosts } from "@/data/mock";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reel = reelPosts.find((r) => r.id === id);
  return { title: reel ? `Reel · ${reel.caption}` : "Reel" };
}

export default async function ReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reel = reelPosts.find((r) => r.id === id);
  if (!reel) notFound();

  return (
    <div className="px-4 pb-10 pt-4 lg:px-0">
      <div className="relative mx-auto aspect-[9/16] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <Image src={reel.cover} alt={reel.caption} fill className="object-cover" sizes="400px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-white/15 p-4 backdrop-blur">
            <Play size={28} className="fill-white text-white" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
          <Link href={`/u/${reel.author}`} className="text-sm font-semibold hover:text-neon-cyan">
            @{reel.author}
          </Link>
          <p className="text-sm">{reel.caption}</p>
          {reel.location ? <p className="text-xs text-white/50">{reel.location}</p> : null}
          <p className="flex items-center gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-1">
              <Heart size={14} /> {reel.likes.toLocaleString()}
            </span>
            <span>{reel.views.toLocaleString()} views</span>
            <span>{reel.createdAt}</span>
          </p>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-sm text-center text-xs text-white/40">
        Mock TikTok-style reel viewer — playback not wired.
      </p>
      <div className="mx-auto mt-4 max-w-sm text-center">
        <Link href={`/u/${reel.author}?tab=reels`} className="text-sm text-neon-cyan hover:underline">
          Back to reels
        </Link>
      </div>
    </div>
  );
}
