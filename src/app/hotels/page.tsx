import { hotels } from "@/data/mock";
import { CardLink, SectionHero } from "@/components/ui";

export default function HotelsPage() {
  return (
    <div>
      <SectionHero
        eyebrow="Catalog"
        title="Hotels across Korea"
        subtitle="Browse landmark stays — live booking waits on partner APIs (Expedia). No fake checkout."
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
