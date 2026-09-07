/** Shared experiences / activities inventory contract for provider adapters. */

export type ExperienceSearchParams = {
  experienceId: string;
  /** Activity date YYYY-MM-DD */
  date: string;
  participants: number;
};

export type ExperienceOffer = {
  offerId: string;
  optionName: string;
  startTime: string; // HH:mm or "Flexible"
  currency: string;
  unitPrice: number;
  totalPrice: number;
  participants: number;
  cancellation: string;
  refundable: boolean;
  includes?: string;
};

export type ExperienceAvailabilityResult = {
  experienceId: string;
  provider: string;
  date: string;
  participants: number;
  offers: ExperienceOffer[];
  meta: {
    mode: "live" | "mock" | "stub";
    message?: string;
  };
};

export interface ExperienceProvider {
  readonly id: string;
  readonly displayName: string;
  /** True when partner credentials are present and live calls can be attempted. */
  isConfigured(): boolean;
  getAvailability(params: ExperienceSearchParams): Promise<ExperienceAvailabilityResult>;
}
