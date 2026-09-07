import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({
  itemType: z.enum(["hotel", "experience"]),
  itemId: z.string().min(1),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().min(1).max(12).default(1),
  notes: z.string().max(500).optional(),
  /** Optional nightly rate from HotelProvider offer — falls back to catalog priceFrom. */
  nightlyRate: z.number().positive().optional(),
  /** Optional per-guest rate from ExperienceProvider offer — falls back to catalog price. */
  unitRate: z.number().positive().optional()
});

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ booking });
  }

  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ bookings: [] });
  const bookings = await prisma.booking.findMany({
    where: { userId: viewer.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: Request) {
  const viewer = await getViewer();
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  let itemTitle = "";
  let totalAmount = 0;
  let currency = "KRW";

  if (data.itemType === "hotel") {
    const hotel = await prisma.hotel.findUnique({ where: { id: data.itemId } });
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    itemTitle = hotel.name;
    currency = hotel.currency;
    const nights = estimateNights(data.checkIn, data.checkOut);
    const nightly = data.nightlyRate ?? hotel.priceFrom;
    // Hotel rates are per room-night; guests select occupancy but do not multiply room rate.
    totalAmount = nightly * nights;
  } else {
    const exp = await prisma.experience.findUnique({ where: { id: data.itemId } });
    if (!exp) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    itemTitle = exp.title;
    currency = exp.currency;
    const unit = data.unitRate ?? exp.price;
    totalAmount = unit * data.guests;
  }

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const paymentMode = stripeConfigured ? "stripe" : "test";
  // Without Stripe keys: persist order and mark test_paid (clearly labeled in UI).
  const status = stripeConfigured ? "pending" : "test_paid";

  const booking = await prisma.booking.create({
    data: {
      userId: viewer?.id,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      itemType: data.itemType,
      itemId: data.itemId,
      itemTitle,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      totalAmount,
      currency,
      status,
      paymentMode,
      notes: data.notes
    }
  });

  if (viewer) {
    await prisma.notification.create({
      data: {
        userId: viewer.id,
        type: "booking",
        title: "Booking confirmed",
        body: `${itemTitle} · ${currency} ${totalAmount.toLocaleString()} (${paymentMode === "test" ? "test payment" : "Stripe"})`,
        href: `/book/confirm/${booking.id}`
      }
    });
  }

  return NextResponse.json({
    booking,
    payment: {
      mode: paymentMode,
      stripeReady: stripeConfigured,
      message: stripeConfigured
        ? "Stripe keys detected — wire Checkout Session in a follow-up."
        : "Test payment path (no Stripe keys). Order persisted."
    }
  });
}

function estimateNights(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 1;
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 1;
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}
