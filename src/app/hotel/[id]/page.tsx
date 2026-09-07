import Image from "next/image";
import { notFound } from "next/navigation";
import { dbGetHotel } from "@/lib/catalog";
import { BookButton } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = await dbGetHotel(id);
  return { title: hotel?.name ?? "Hotel" };
}

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = await dbGetHotel(id);
  if (!hotel) notFound();

  return (
    <div className="px-4 pb-8 pt-4 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="relative aspect-[16/10]">
          <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="space-y-3 p-5">
          <h1 className="font-display text-3xl">{hotel.name}</h1>
          <p className="text-sm text-white/55">
            {hotel.area}, {hotel.city} · ★ {hotel.rating}
          </p>
          <p className="text-base text-white/80">{hotel.description}</p>
          <ul className="flex flex-wrap gap-2">
            {hotel.amenities.map((a) => (
              <li key={a} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                {a}
              </li>
            ))}
          </ul>
          <p className="text-xl font-semibold text-neon-amber">
            From {hotel.currency} {hotel.priceFrom} / night
          </p>
          <BookButton label="Check availability" href={`/book/hotel/${hotel.id}`} />
        </div>
      </div>
    </div>
  );
}
