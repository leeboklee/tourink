import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dbGetExperience, dbGetHotel } from "@/lib/catalog";
import { BookingCheckoutForm } from "@/components/BookingCheckoutForm";

export async function generateMetadata({
  params
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (type === "hotel") {
    const hotel = await dbGetHotel(id);
    return { title: hotel ? `Book ${hotel.name}` : "Book hotel" };
  }
  const exp = await dbGetExperience(id);
  return { title: exp ? `Book ${exp.title}` : "Book experience" };
}

export default async function BookPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (type !== "hotel" && type !== "experience") notFound();

  if (type === "hotel") {
    const hotel = await dbGetHotel(id);
    if (!hotel) notFound();
    return (
      <div className="px-4 pb-10 pt-4 lg:px-0">
        <Link href={`/hotel/${id}`} className="text-sm text-neon-cyan hover:underline">
          ← Back to hotel
        </Link>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="relative aspect-[21/9]">
            <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="100vw" />
          </div>
        </div>
        <BookingCheckoutForm
          itemType="hotel"
          itemId={hotel.id}
          itemTitle={hotel.name}
          unitPrice={hotel.priceFrom}
          currency={hotel.currency}
          mode="hotel"
        />
      </div>
    );
  }

  const exp = await dbGetExperience(id);
  if (!exp) notFound();
  return (
    <div className="px-4 pb-10 pt-4 lg:px-0">
      <Link href={`/experience/${id}`} className="text-sm text-neon-cyan hover:underline">
        ← Back to experience
      </Link>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <div className="relative aspect-[21/9]">
          <Image src={exp.image} alt={exp.title} fill className="object-cover" sizes="100vw" />
        </div>
      </div>
      <BookingCheckoutForm
        itemType="experience"
        itemId={exp.id}
        itemTitle={exp.title}
        unitPrice={exp.price}
        currency={exp.currency}
        mode="experience"
      />
    </div>
  );
}
