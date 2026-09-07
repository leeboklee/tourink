import type { ExperienceAvailabilityResult, ExperienceProvider, ExperienceSearchParams } from "./types";

/**
 * Viator Partner API adapter stub.
 *
 * Access tiers (partnerresources.viator.com):
 * - Basic Access: self-serve affiliate key on account creation (catalog / summaries;
 *   booking happens on viator.com).
 * - Full Access / Full + Booking: approval + two-part front-end & back-end certification
 *   before transactional endpoints. No public open sandbox for booking; onboarding via
 *   affiliateapi@tripadvisor.com.
 *
 * Env placeholders:
 *   VIATOR_API_KEY, VIATOR_ENV=test|production
 * Docs: https://docs.viator.com
 */
export class ViatorExperienceProvider implements ExperienceProvider {
  readonly id = "viator";
  readonly displayName = "Viator";

  isConfigured(): boolean {
    return Boolean(process.env.VIATOR_API_KEY?.trim());
  }

  private baseUrl(): string {
    const env = (process.env.VIATOR_ENV ?? "test").toLowerCase();
    // Viator Partner API v2 — confirm sandbox host with onboarding; production is api.viator.com
    return env === "production" || env === "prod"
      ? "https://api.viator.com"
      : "https://api.viator.com";
  }

  async getAvailability(params: ExperienceSearchParams): Promise<ExperienceAvailabilityResult> {
    if (!this.isConfigured()) {
      return {
        experienceId: params.experienceId,
        provider: this.id,
        date: params.date,
        participants: params.participants,
        offers: [],
        meta: {
          mode: "stub",
          message:
            "Viator credentials missing. Create an affiliate account for Basic Access, then request Full + Booking and pass certification — set VIATOR_API_KEY when issued."
        }
      };
    }

    const endpoint = `${this.baseUrl()}/partner-api/v2/availability/check`;
    void endpoint;
    void params;

    return {
      experienceId: params.experienceId,
      provider: this.id,
      date: params.date,
      participants: params.participants,
      offers: [],
      meta: {
        mode: "stub",
        message:
          "Viator keys detected but live availability/booking is not wired yet — complete Partner API certification before enabling transactional calls."
      }
    };
  }
}
