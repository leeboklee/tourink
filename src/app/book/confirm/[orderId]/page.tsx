import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = { title: "Booking confirmed" };

export default async function BookingConfirmPage({
  params
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: orderId } });
  if (!booking) notFound();

  const isTest = booking.paymentMode === "test" || booking.status === "test_paid";
  const href =
    booking.itemType === "hotel" ? `/hotel/${booking.itemId}` : `/experience/${booking.itemId}`;

  return (
    <div className="px-4 pb-10 pt-8 lg:px-0">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 text-neon-cyan" size={28} />
          <div>
            <h1 className="font-display text-3xl text-paper">Reservation saved</h1>
            <p className="mt-2 text-sm text-white/60">
              Order <span className="font-mono text-white/80">{booking.id}</span> is stored in Tourink.
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-white/45">Item</dt>
            <dd className="text-paper">{booking.itemTitle}</dd>
          </div>
          <div>
            <dt className="text-white/45">Guest</dt>
            <dd className="text-paper">
              {booking.guestName} · {booking.guestEmail}
            </dd>
          </div>
          {booking.checkIn ? (
            <div>
              <dt className="text-white/45">Stay</dt>
              <dd className="text-paper">
                {booking.checkIn} → {booking.checkOut}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-white/45">Guests</dt>
            <dd className="text-paper">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-white/45">Total</dt>
            <dd className="text-neon-amber">
              {booking.currency} {booking.totalAmount.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-white/45">Payment</dt>
            <dd className="text-paper">
              {isTest ? (
                <span className="rounded-md border border-neon-amber/40 bg-neon-amber/10 px-2 py-0.5 text-xs text-neon-amber">
                  Test payment · no Stripe charge
                </span>
              ) : (
                <span>{booking.status}</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={href}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
          >
            View listing
          </Link>
          <Link
            href="/profile?tab=about"
            className="rounded-xl bg-neon-cyan/15 px-4 py-2.5 text-sm font-semibold text-neon-cyan"
          >
            My Page
          </Link>
        </div>
      </div>
    </div>
  );
}
