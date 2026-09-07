import { AmadeusHotelProvider } from "./amadeus";
import { ExpediaRapidProvider } from "./expedia-rapid";
import { MockHotelProvider } from "./mock-provider";
import type { HotelProvider } from "./types";

export type { HotelAvailabilityResult, HotelProvider, HotelRateOffer, HotelSearchParams } from "./types";
export { nightsBetween } from "./types";
export { MockHotelProvider } from "./mock-provider";
export { ExpediaRapidProvider } from "./expedia-rapid";
export { AmadeusHotelProvider } from "./amadeus";

/**
 * Resolve the active hotel inventory provider.
 *
 * HOTEL_PROVIDER=mock|expedia|amadeus (default: mock)
 * If a live provider is selected but not configured, fall back to mock so the
 * hotel detail availability UI keeps working in local / preview deploys.
 */
export function getHotelProvider(): HotelProvider {
  const choice = (process.env.HOTEL_PROVIDER ?? "mock").toLowerCase().trim();
  const mock = new MockHotelProvider();
  const expedia = new ExpediaRapidProvider();
  const amadeus = new AmadeusHotelProvider();

  if (choice === "expedia" || choice === "expedia-rapid" || choice === "ean") {
    return expedia.isConfigured() ? expedia : mock;
  }
  if (choice === "amadeus") {
    return amadeus.isConfigured() ? amadeus : mock;
  }
  return mock;
}

export function listHotelProviders(): HotelProvider[] {
  return [new MockHotelProvider(), new ExpediaRapidProvider(), new AmadeusHotelProvider()];
}
