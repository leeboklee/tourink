import { NextResponse } from "next/server";
import { z } from "zod";
import { getHotelProvider } from "@/lib/hotels";
import { isHotelsEnabled } from "@/lib/feature-flags";

const schema = z.object({
  hotelId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(8).default(2),
  children: z.coerce.number().int().min(0).max(6).optional()
});

export async function GET(req: Request) {
  if (!isHotelsEnabled()) {
    return NextResponse.json(
      { error: "Hotels booking is Coming soon — set partner keys or NEXT_PUBLIC_ENABLE_HOTELS=true" },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const parsed = schema.safeParse({
    hotelId: url.searchParams.get("hotelId"),
    checkIn: url.searchParams.get("checkIn"),
    checkOut: url.searchParams.get("checkOut"),
    adults: url.searchParams.get("adults") ?? 2,
    children: url.searchParams.get("children") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { checkIn, checkOut } = parsed.data;
  if (new Date(checkOut) <= new Date(checkIn)) {
    return NextResponse.json({ error: "checkOut must be after checkIn" }, { status: 400 });
  }

  const provider = getHotelProvider();
  const result = await provider.getAvailability({
    hotelId: parsed.data.hotelId,
    checkIn,
    checkOut,
    adults: parsed.data.adults,
    children: parsed.data.children
  });

  return NextResponse.json({
    ...result,
    providerDisplayName: provider.displayName,
    providerConfigured: provider.isConfigured()
  });
}
