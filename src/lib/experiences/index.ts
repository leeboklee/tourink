import { GetYourGuideExperienceProvider } from "./getyourguide";
import { KlookExperienceProvider } from "./klook";
import { MockExperienceProvider } from "./mock-provider";
import { ViatorExperienceProvider } from "./viator";
import type { ExperienceProvider } from "./types";

export type {
  ExperienceAvailabilityResult,
  ExperienceOffer,
  ExperienceProvider,
  ExperienceSearchParams
} from "./types";
export { MockExperienceProvider } from "./mock-provider";
export { KlookExperienceProvider } from "./klook";
export { ViatorExperienceProvider } from "./viator";
export { GetYourGuideExperienceProvider } from "./getyourguide";

/**
 * Resolve the active experience inventory provider.
 *
 * EXPERIENCE_PROVIDER=mock|klook|viator|getyourguide|gyg (default: mock)
 * If a live provider is selected but not configured, fall back to mock so the
 * experience detail availability UI keeps working in local / preview deploys.
 */
export function getExperienceProvider(): ExperienceProvider {
  const choice = (process.env.EXPERIENCE_PROVIDER ?? "mock").toLowerCase().trim();
  const mock = new MockExperienceProvider();
  const klook = new KlookExperienceProvider();
  const viator = new ViatorExperienceProvider();
  const gyg = new GetYourGuideExperienceProvider();

  if (choice === "klook") {
    return klook.isConfigured() ? klook : mock;
  }
  if (choice === "viator") {
    return viator.isConfigured() ? viator : mock;
  }
  if (choice === "getyourguide" || choice === "gyg") {
    return gyg.isConfigured() ? gyg : mock;
  }
  return mock;
}

export function listExperienceProviders(): ExperienceProvider[] {
  return [
    new MockExperienceProvider(),
    new KlookExperienceProvider(),
    new ViatorExperienceProvider(),
    new GetYourGuideExperienceProvider()
  ];
}
