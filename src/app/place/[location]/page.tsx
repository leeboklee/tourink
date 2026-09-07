import Link from "next/link";
import { dbGetPostsByLocation } from "@/lib/catalog";
import { FeedCard } from "@/components/FeedCard";
import { SectionHero } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  return { title: decodeURIComponent(location) };
}

export default async function PlacePage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const label = decodeURIComponent(location);
  const posts = await dbGetPostsByLocation(label);

  return (
    <div>
      <SectionHero
        eyebrow="Location tag"
        title={label}
        subtitle="Posts pinned to this spot — Instagram-style place discovery for Korea."
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
          <p className="px-4 text-sm text-white/50 lg:px-0">No posts at {label} yet.</p>
        )}
      </div>
    </div>
  );
}
