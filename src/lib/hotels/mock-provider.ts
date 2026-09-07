import { dbGetHotel } from "@/lib/catalog";
import type {
  HotelAvailabilityResult,
  HotelProvider,
  HotelRateOffer,
  HotelSearchParams
} from "./types";
import { nightsBetween } from "./types";

/**
 * Deterministic mock inventory that mirrors the HotelProvider contract.
 * Used until Expedia Rapid / Amadeus partner keys are approved.
 */
export class MockHotelProvider implements HotelProvider {
  readonly id = "mock";
  readonly displayName = "Tourink Mock Inventory";

  isConfigured(): boolean {
    return true;
  }

  async getAvailability(params: HotelSearchParams): Promise<HotelAvailabilityResult> {
    const hotel = await dbGetHotel(params.hotelId);
    if (!hotel) {
      return {
        hotelId: params.hotelId,
        provider: this.id,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        offers: [],
        meta: { mode: "mock", message: "Hotel not found in catalog." }
      };
    }

    const nights = nightsBetween(params.checkIn, params.checkOut);
    const adults = Math.max(1, params.adults);
    const base = hotel.priceFrom;

    // Light weekend uplift so the UI shows rate variance without a live API.
    const checkInDay = new Date(params.checkIn).getUTCDay();
    const weekendBump = checkInDay === 5 || checkInDay === 6 ? 1.12 : 1;

    const rooms: Omit<HotelRateOffer, "offerId" | "totalPrice" | "nightlyPrice" | "nights" | "currency">[] = [
      {
        roomName: "Deluxe City View",
        board: "Room only",
        cancellation: "Free cancellation until 48h before check-in",
        refundable: true,
        beds: "1 king"
      },
      {
        roomName: "Premier Suite",
        board: "Breakfast included",
        cancellation: "Non-refundable",
        refundable: false,
        beds: "1 king + sofa"
      },
      {
        roomName: adults >= 3 ? "Family Twin" : "Twin Deluxe",
        board: "Room only",
        cancellation: "Free cancellation until 24h before check-in",
        refundable: true,
        beds: "2 twins"
      }
    ];

    const multipliers = [1, 1.55, 1.18];
    const offers: HotelRateOffer[] = rooms.map((room, i) => {
      const nightly = Math.round(base * multipliers[i]! * weekendBump);
      return {
        offerId: `${this.id}:${hotel.id}:${params.checkIn}:${i}`,
        ...room,
        currency: hotel.currency,
        nightlyPrice: nightly,
        nights,
        totalPrice: nightly * nights
      };
    });

    return {
      hotelId: hotel.id,
      provider: this.id,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults,
      offers,
      meta: {
        mode: "mock",
        message:
          "Mock rates via HotelProvider. Drop in EXPEDIA_* or AMADEUS_* keys and set HOTEL_PROVIDER to go live."
      }
    };
  }
}
