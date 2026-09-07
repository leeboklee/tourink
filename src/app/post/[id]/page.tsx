import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { feedPosts, getCommentsForPost } from "@/data/mock";
import { CommentThread } from "@/components/CommentThread";
import { FollowButton } from "@/components/FollowButton";
import { FeedCard } from "@/components/FeedCard";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = feedPosts.find((p) => p.id === id);
  if (!post) notFound();
  const postComments = getCommentsForPost(post.id);

  return (
    <div className="space-y-6 pb-8 lg:px-0">
      <FeedCard post={post} />
      <div className="space-y-4 px-4 lg:px-0">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/40 p-4">
          <Image
            src={post.avatar}
            alt={post.author}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <Link href={`/u/${post.author}`} className="font-semibold hover:text-neon-cyan">
              @{post.author}
            </Link>
            <Link
              href={`/place/${encodeURIComponent(post.location)}`}
              className="mt-0.5 flex items-center gap-1 text-xs text-white/50 hover:text-neon-cyan"
            >
              <MapPin size={12} />
              {post.location}
            </Link>
          </div>
          <FollowButton handle={post.author} />
        </div>
        <CommentThread postId={post.id} initial={postComments} />
      </div>
    </div>
  );
}
