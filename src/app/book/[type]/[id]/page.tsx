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

export default async function BookPage({
  params,
  searchParams
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type, id } = await params;
  const sp = await searchParams;
  if (type !== "hotel" && type !== "experience") notFound();

  const pick = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  if (type === "hotel") {
    const hotel = await dbGetHotel(id);
    if (!hotel) notFound();
    const nightly = Number(pick("nightlyPrice"));
    const unitPrice = Number.isFinite(nightly) && nightly > 0 ? nightly : hotel.priceFrom;
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
          itemTitle={pick("roomName") ? `${hotel.name} · ${pick("roomName")}` : hotel.name}
          unitPrice={unitPrice}
          currency={hotel.currency}
          mode="hotel"
          initialCheckIn={pick("checkIn")}
          initialCheckOut={pick("checkOut")}
          initialGuests={Number(pick("guests")) || 2}
          offerId={pick("offerId")}
        />
      </div>
    );
  }

  const exp = await dbGetExperience(id);
  if (!exp) notFound();
  const unitFromOffer = Number(pick("unitPrice"));
  const unitPrice = Number.isFinite(unitFromOffer) && unitFromOffer > 0 ? unitFromOffer : exp.price;
  const optionName = pick("optionName");
  const startTime = pick("startTime");
  const titleBits = [exp.title, optionName, startTime ? `starts ${startTime}` : null]
    .filter(Boolean)
    .join(" · ");

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
        itemTitle={titleBits}
        unitPrice={unitPrice}
        currency={exp.currency}
        mode="experience"
        initialGuests={Number(pick("guests")) || 2}
        offerId={pick("offerId")}
        activityDate={pick("date")}
      />
    </div>
  );
}
