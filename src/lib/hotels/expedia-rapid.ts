import type { HotelAvailabilityResult, HotelProvider, HotelSearchParams } from "./types";

/**
 * Expedia Rapid (EAN) adapter stub.
 *
 * Partner approval is required before live credentials are issued:
 * https://developers.expediagroup.com/rapid/setup
 *
 * Auth (once approved): Authorization header with API key + SHA-512 signature
 * of apiKey + sharedSecret + unixTimestamp. Sandbox host: https://test.ean.com
 * Production host: https://api.ean.com
 *
 * When EXPEDIA_API_KEY + EXPEDIA_SHARED_SECRET are set, replace the stub body
 * with Rapid shopping/availability calls (properties/availability, rooms).
 */
export class ExpediaRapidProvider implements HotelProvider {
  readonly id = "expedia-rapid";
  readonly displayName = "Expedia Rapid";

  isConfigured(): boolean {
    return Boolean(process.env.EXPEDIA_API_KEY?.trim() && process.env.EXPEDIA_SHARED_SECRET?.trim());
  }

  private baseUrl(): string {
    const env = (process.env.EXPEDIA_ENV ?? "test").toLowerCase();
    return env === "production" || env === "prod"
      ? "https://api.ean.com"
      : "https://test.ean.com";
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
            "Expedia Rapid credentials missing. Apply at Expedia Group Partner portal, then set EXPEDIA_API_KEY and EXPEDIA_SHARED_SECRET."
        }
      };
    }

    // Live path placeholder — partner keys unlock Rapid lodging shopping.
    // Keep returning stub meta so callers know not to treat empty offers as sold out.
    const endpoint = `${this.baseUrl()}/v3/properties/availability`;
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
          "Expedia Rapid keys detected but live shopping is not wired yet — complete Rapid lodging shopping integration against test.ean.com."
      }
    };
  }
}
