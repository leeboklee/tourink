import Link from "next/link";
import { getPostsByTag } from "@/data/mock";
import { FeedCard } from "@/components/FeedCard";
import { SectionHero } from "@/components/ui";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div>
      <SectionHero
        eyebrow="Hashtag"
        title={`#${tag}`}
        subtitle={`${posts.length} feed posts tagged for Korea inbound travelers.`}
      />
      <div className="px-4 pb-4 lg:px-0">
        <Link href="/" className="text-xs text-neon-cyan hover:underline">
          ← Feed
        </Link>
      </div>
      <div className="space-y-0 pb-8 lg:space-y-6">
        {posts.length ? (
          posts.map((post) => <FeedCard key={post.id} post={post} />)
        ) : (
          <p className="px-4 text-sm text-white/50 lg:px-0">No posts for #{tag} yet.</p>
        )}
      </div>
    </div>
  );
}
