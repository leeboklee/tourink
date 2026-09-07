import type { HotelAvailabilityResult, HotelProvider, HotelSearchParams } from "./types";

/**
 * Amadeus Hotel Search / Booking adapter stub.
 *
 * Amadeus for Developers self-service portal was decommissioned (July 2025);
 * new access is via Enterprise APIs (commercial agreement).
 * Legacy self-service used OAuth2 against test.travel.api.amadeus.com.
 *
 * When AMADEUS_CLIENT_ID + AMADEUS_CLIENT_SECRET are set, exchange for a token
 * and call hotel offers search, then map into HotelAvailabilityResult.
 */
export class AmadeusHotelProvider implements HotelProvider {
  readonly id = "amadeus";
  readonly displayName = "Amadeus Hotels";

  isConfigured(): boolean {
    return Boolean(process.env.AMADEUS_CLIENT_ID?.trim() && process.env.AMADEUS_CLIENT_SECRET?.trim());
  }

  private baseUrl(): string {
    const env = (process.env.AMADEUS_ENV ?? "test").toLowerCase();
    return env === "production" || env === "prod"
      ? "https://api.amadeus.com"
      : "https://test.travel.api.amadeus.com";
  }

  async getAvailability(params: HotelSearchParams): Promise<HotelAvailabilityResult> {
    if (!this.isConfigured()) {
      return {
        hotelId: params.hotelId,
        provider: this.id,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        offers: [],
        meta: {
          mode: "stub",
          message:
            "Amadeus credentials missing. Enterprise access required after self-service portal shutdown — set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET when issued."
        }
      };
    }

    const endpoint = `${this.baseUrl()}/v3/shopping/hotel-offers`;
    void endpoint;
    void params;

    return {
      hotelId: params.hotelId,
      provider: this.id,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: params.adults,
      offers: [],
      meta: {
        mode: "stub",
        message:
          "Amadeus keys detected but live hotel-offers search is not wired yet — map Enterprise hotel offers into HotelAvailabilityResult."
      }
    };
  }
}
