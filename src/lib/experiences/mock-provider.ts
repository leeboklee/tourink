import { dbGetExperience } from "@/lib/catalog";
import type {
  ExperienceAvailabilityResult,
  ExperienceOffer,
  ExperienceProvider,
  ExperienceSearchParams
} from "./types";

/**
 * Deterministic mock inventory that mirrors the ExperienceProvider contract.
 * Used until Klook / Viator / GetYourGuide partner keys are approved.
 */
export class MockExperienceProvider implements ExperienceProvider {
  readonly id = "mock";
  readonly displayName = "Tourink Mock Experiences";

  isConfigured(): boolean {
    return true;
  }

  async getAvailability(params: ExperienceSearchParams): Promise<ExperienceAvailabilityResult> {
    const exp = await dbGetExperience(params.experienceId);
    if (!exp) {
      return {
        experienceId: params.experienceId,
        provider: this.id,
        date: params.date,
        participants: params.participants,
        offers: [],
        meta: { mode: "mock", message: "Experience not found in catalog." }
      };
    }

    const participants = Math.max(1, params.participants);
    const base = exp.price;
    const day = new Date(params.date).getUTCDay();
    const weekendBump = day === 0 || day === 6 ? 1.1 : 1;

    const slots: Omit<
      ExperienceOffer,
      "offerId" | "unitPrice" | "totalPrice" | "currency" | "participants"
    >[] = [
      {
        optionName: "Standard ticket",
        startTime: "09:00",
        cancellation: "Free cancellation until 24h before start",
        refundable: true,
        includes: exp.duration
      },
      {
        optionName: "Skip-the-line + guide",
        startTime: "10:30",
        cancellation: "Free cancellation until 48h before start",
        refundable: true,
        includes: `${exp.duration} · English guide`
      },
      {
        optionName: day === 0 || day === 6 ? "Weekend sunset slot" : "Afternoon slot",
        startTime: "14:00",
        cancellation: "Non-refundable",
        refundable: false,
        includes: exp.duration
      }
    ];

    const multipliers = [1, 1.35, 1.12];
    const offers: ExperienceOffer[] = slots.map((slot, i) => {
      const unit = Math.round(base * multipliers[i]! * weekendBump);
      return {
        offerId: `${this.id}:${exp.id}:${params.date}:${i}`,
        ...slot,
        currency: exp.currency,
        unitPrice: unit,
        participants,
        totalPrice: unit * participants
      };
    });

    return {
      experienceId: exp.id,
      provider: this.id,
      date: params.date,
      participants,
      offers,
      meta: {
        mode: "mock",
        message:
          "Mock slots via ExperienceProvider. Drop in KLOOK_* or VIATOR_* keys and set EXPERIENCE_PROVIDER to go live."
      }
    };
  }
}
