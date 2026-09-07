import Image from "next/image";
import Link from "next/link";
import { nightlife, getReviewsForPlace } from "@/data/mock";
import { SectionHero } from "@/components/ui";
import { ReviewComposer, ReviewList } from "@/components/Reviews";

export const metadata = { title: "Nightlife" };

export default function NightlifePage() {
  return (
    <div>
      <SectionHero
        eyebrow="After dark · Reviews"
        title="Famous bars & clubs"
        subtitle="Itaewon floors, Seongsu cocktails, Busan rooftops — read traveler reviews before you go."
      />
      <div className="grid gap-4 px-4 pb-8 sm:grid-cols-2 lg:px-0">
        {nightlife.map((spot) => {
          const reviews = getReviewsForPlace(spot.id);
          return (
            <article
              key={spot.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50"
            >
              <Link href={`/nightlife/${spot.id}`} className="relative block aspect-[16/10]">
                <Image
                  src={spot.image}
                  alt={spot.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 400px"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] uppercase tracking-wide text-neon-cyan">
                  {spot.type}
                </span>
              </Link>
              <div className="space-y-2 p-4">
                <Link href={`/nightlife/${spot.id}`} className="block text-lg font-semibold hover:text-neon-cyan">
                  {spot.name}
                </Link>
                <p className="text-xs text-white/50">
                  {spot.area}, {spot.city} · until {spot.openUntil}
                </p>
                <p className="text-sm text-white/75">{spot.vibe}</p>
                <p className="text-sm text-neon-amber">
                  ★ {spot.rating.toFixed(1)} · {spot.reviewCount} reviews
                </p>
                {spot.cover != null ? (
                  <p className="text-sm text-white/60">Cover from ₩{spot.cover.toLocaleString()}</p>
                ) : null}
                {reviews[0] ? (
                  <p className="line-clamp-2 text-xs text-white/45">
                    “{reviews[0].body}” — @{reviews[0].author}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <div className="px-4 pb-8 lg:px-0">
        <h2 className="mb-3 text-lg font-semibold">Quick review (demo)</h2>
        <ReviewComposer placeName="a nightlife spot" />
      </div>
    </div>
  );
}
