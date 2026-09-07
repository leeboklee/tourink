import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nightlife, getReviewsForPlace } from "@/data/mock";
import { ReviewComposer, ReviewList } from "@/components/Reviews";

export default async function NightlifeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spot = nightlife.find((n) => n.id === id);
  if (!spot) notFound();
  const reviews = getReviewsForPlace(spot.id);

  return (
    <div className="px-4 pb-8 pt-4 lg:px-0">
      <Link href="/nightlife" className="text-xs text-neon-cyan hover:underline">
        ← Nightlife
      </Link>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="relative aspect-[16/10]">
          <Image src={spot.image} alt={spot.name} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="space-y-2 p-4">
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase text-neon-cyan">
            {spot.type}
          </span>
          <h1 className="font-display text-3xl">{spot.name}</h1>
          <p className="text-sm text-white/55">
            {spot.area}, {spot.city} · open until {spot.openUntil}
          </p>
          <p className="text-sm text-white/75">{spot.vibe}</p>
          <p className="text-sm text-neon-amber">
            ★ {spot.rating.toFixed(1)} · {spot.reviewCount} traveler reviews
          </p>
          {spot.cover != null ? (
            <p className="text-sm text-white/60">Cover from ₩{spot.cover.toLocaleString()}</p>
          ) : null}
        </div>
      </div>
      <h2 className="mb-3 mt-8 text-lg font-semibold">Reviews</h2>
      <div className="space-y-4">
        <ReviewComposer placeName={spot.name} />
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
