import { notFound } from "next/navigation";
import { hotels } from "@/data/mock";
import { CatalogDetail } from "@/components/CatalogDetail";

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  return (
    <CatalogDetail
      image={hotel.image}
      title={hotel.name}
      meta={`${hotel.area}, ${hotel.city} · ★ ${hotel.rating}`}
      description={hotel.description}
      chips={hotel.amenities}
      price={`From ${hotel.currency} ${hotel.priceFrom} / night`}
      ctaLabel="Partner booking soon"
      secondaryLinks={[{ href: "/routes", label: "Browse routes" }]}
    />
  );
}
