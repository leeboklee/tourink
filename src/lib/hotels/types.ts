/** Shared hotel inventory / availability contract for provider adapters. */

export type HotelSearchParams = {
  hotelId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string;
  adults: number;
  children?: number;
};

export type HotelRateOffer = {
  offerId: string;
  roomName: string;
  board: string;
  currency: string;
  totalPrice: number;
  nightlyPrice: number;
  nights: number;
  cancellation: string;
  refundable: boolean;
  beds?: string;
};

export type HotelAvailabilityResult = {
  hotelId: string;
  provider: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  offers: HotelRateOffer[];
  meta: {
    mode: "live" | "mock" | "stub";
    message?: string;
  };
};

export interface HotelProvider {
  readonly id: string;
  readonly displayName: string;
  /** True when partner credentials are present and live calls can be attempted. */
  isConfigured(): boolean;
  getAvailability(params: HotelSearchParams): Promise<HotelAvailabilityResult>;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 1;
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}
