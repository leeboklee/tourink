import { dbListHotels } from "@/lib/catalog";
import { isHotelsEnabled } from "@/lib/feature-flags";
import { CardLink, SectionHero } from "@/components/ui";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Hotels" };

export default async function HotelsPage() {
  if (!isHotelsEnabled()) {
    return (
      <ComingSoon
        title="Hotels — partner booking soon"
        subtitle="Live hotel rates need an Expedia Rapid or Amadeus partner key. Until then, stays stay Coming soon — no mock checkout."
        enableHint="Staff: set HOTEL_PROVIDER=expedia (or amadeus) with partner keys, or NEXT_PUBLIC_ENABLE_HOTELS=true for a staging override. See /admin/reports."
      />
    );
  }

  const hotels = await dbListHotels();

  return (
    <div>
      <SectionHero
        eyebrow="Stay"
        title="Hotels across Korea"
        subtitle="Landmark towers to nightlife bases — live rates via the configured hotel provider."
      />
      <div className="grid gap-4 px-4 pb-8 sm:grid-cols-2 lg:px-0">
        {hotels.map((h) => (
          <CardLink
            key={h.id}
            href={`/hotel/${h.id}`}
            image={h.image}
            title={h.name}
            meta={`${h.area}, ${h.city} · ★ ${h.rating}`}
            price={`From ${h.currency} ${h.priceFrom}/night`}
          />
        ))}
      </div>
    </div>
  );
}
