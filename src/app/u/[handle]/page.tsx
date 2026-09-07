import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feedPosts, getProfile } from "@/data/mock";
import { FollowButton } from "@/components/FollowButton";
import { FeedCard } from "@/components/FeedCard";

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = getProfile(handle);
  const posts = feedPosts.filter((p) => p.author === handle);

  if (!profile && posts.length === 0) notFound();

  const p = profile ?? {
    handle,
    name: handle,
    avatar: posts[0]?.avatar ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
    bio: "Tourink traveler",
    city: posts[0]?.location.split(",").pop()?.trim() ?? "Korea",
    followers: 120,
    following: 80,
    posts: posts.length
  };

  return (
    <div className="pb-8">
      <div className="flex items-start gap-4 px-4 pt-6 lg:px-0">
        <Image
          src={p.avatar}
          alt={p.handle}
          width={88}
          height={88}
          className="h-20 w-20 rounded-full object-cover ring-2 ring-neon-cyan/30"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl">@{p.handle}</h1>
            {"isLocal" in p && p.isLocal ? (
              <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                local
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-white/60">{p.bio}</p>
          <p className="mt-1 text-xs text-white/40">{p.city}</p>
          <div className="mt-3 flex gap-4 text-sm">
            <span>
              <strong>{p.posts}</strong> <span className="text-white/45">posts</span>
            </span>
            <span>
              <strong>{p.followers.toLocaleString()}</strong>{" "}
              <span className="text-white/45">followers</span>
            </span>
            <span>
              <strong>{p.following}</strong> <span className="text-white/45">following</span>
            </span>
          </div>
          <div className="mt-3">
            <FollowButton handle={p.handle} />
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-0 lg:space-y-6">
        {posts.length ? (
          posts.map((post) => <FeedCard key={post.id} post={post} />)
        ) : (
          <p className="px-4 text-sm text-white/50 lg:px-0">
            No posts yet.{" "}
            <Link href="/" className="text-neon-cyan hover:underline">
              Back to feed
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
