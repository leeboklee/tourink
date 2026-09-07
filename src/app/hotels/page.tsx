import { dbListHotels } from "@/lib/catalog";
import { CardLink, SectionHero } from "@/components/ui";

export const metadata = { title: "Hotels" };

export default async function HotelsPage() {
  const hotels = await dbListHotels();

  return (
    <div>
      <SectionHero
        eyebrow="Stay"
        title="Hotels across Korea"
        subtitle="Landmark towers to nightlife bases — reserve stays with persistent checkout."
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
