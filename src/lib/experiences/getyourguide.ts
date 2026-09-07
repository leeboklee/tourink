import type { ExperienceAvailabilityResult, ExperienceProvider, ExperienceSearchParams } from "./types";

/**
 * GetYourGuide Partner API adapter stub.
 *
 * GYG publishes a Partner API with a dedicated testing host (api.gygtest.net) mirroring
 * production (api.getyourguide.com). Access tokens are issued through partner onboarding
 * (X-ACCESS-TOKEN header) — not fully self-serve for booking.
 *
 * Env placeholders:
 *   GYG_ACCESS_TOKEN, GYG_ENV=test|production
 */
export class GetYourGuideExperienceProvider implements ExperienceProvider {
  readonly id = "getyourguide";
  readonly displayName = "GetYourGuide";

  isConfigured(): boolean {
    return Boolean(process.env.GYG_ACCESS_TOKEN?.trim());
  }

  private baseUrl(): string {
    const env = (process.env.GYG_ENV ?? "test").toLowerCase();
    return env === "production" || env === "prod"
      ? "https://api.getyourguide.com"
      : "https://api.gygtest.net";
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
            "GetYourGuide token missing. Partner onboarding issues X-ACCESS-TOKEN for api.gygtest.net / api.getyourguide.com — set GYG_ACCESS_TOKEN when issued."
        }
      };
    }

    const endpoint = `${this.baseUrl()}/1/tours`;
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
          "GYG token detected but live tour search/booking is not wired yet — map Partner API tours into ExperienceAvailabilityResult."
      }
    };
  }
}
