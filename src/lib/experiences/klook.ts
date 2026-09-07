import type { ExperienceAvailabilityResult, ExperienceProvider, ExperienceSearchParams } from "./types";

/**
 * Klook adapter stub (demand / affiliate path).
 *
 * Research notes (2026):
 * - Public Klook OpenAPI docs (klook.gitbook.io/openapi) describe **supplier OCTO** —
 *   inverted integration where *you* host endpoints and Klook consumes them. That path
 *   is for operators selling *into* Klook, not for Tourink shopping Klook inventory.
 * - Demand-side / reseller booking of Klook activities requires a commercial partner
 *   agreement (BD onboarding); there is no self-serve public sandbox API key for
 *   product search + booking on Tourink's side.
 * - Affiliate deep-links remain available via partner.klook.com without transactional API.
 *
 * Env placeholders (when partner keys are issued):
 *   KLOOK_API_KEY, KLOOK_AFFILIATE_ID, KLOOK_ENV=test|production
 */
export class KlookExperienceProvider implements ExperienceProvider {
  readonly id = "klook";
  readonly displayName = "Klook";

  isConfigured(): boolean {
    return Boolean(process.env.KLOOK_API_KEY?.trim());
  }

  private baseUrl(): string {
    const env = (process.env.KLOOK_ENV ?? "test").toLowerCase();
    return env === "production" || env === "prod"
      ? "https://api.klook.com"
      : "https://api.klook.com"; // production host placeholder — confirm with Klook BD
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
            "Klook credentials missing. Demand-side booking needs partner BD approval — set KLOOK_API_KEY (and KLOOK_AFFILIATE_ID) when issued."
        }
      };
    }

    const endpoint = `${this.baseUrl()}/v1/experiences/availability`;
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
          "Klook keys detected but live shopping is not wired yet — map partner availability into ExperienceAvailabilityResult after BD onboarding."
      }
    };
  }
}
