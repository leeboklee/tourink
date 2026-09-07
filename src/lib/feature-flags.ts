/**
 * Public product surface flags.
 *
 * Hotels / Experiences stay soft-hidden (Coming soon) until a live partner
 * provider is configured, or an explicit NEXT_PUBLIC_ENABLE_* = true override.
 */

function envTrue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function envSet(...keys: string[]): boolean {
  return keys.every((k) => Boolean(process.env[k]?.trim()));
}

export function hasLiveHotelProvider(): boolean {
  const choice = (process.env.HOTEL_PROVIDER ?? "mock").toLowerCase().trim();
  if (
    (choice === "expedia" || choice === "expedia-rapid" || choice === "ean") &&
    envSet("EXPEDIA_API_KEY", "EXPEDIA_SHARED_SECRET")
  ) {
    return true;
  }
  if (choice === "amadeus" && envSet("AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET")) {
    return true;
  }
  return false;
}

export function hasLiveExperienceProvider(): boolean {
  const choice = (process.env.EXPERIENCE_PROVIDER ?? "mock").toLowerCase().trim();
  if (choice === "klook" && envSet("KLOOK_API_KEY")) return true;
  if (choice === "viator" && envSet("VIATOR_API_KEY")) return true;
  if ((choice === "getyourguide" || choice === "gyg") && envSet("GYG_ACCESS_TOKEN")) return true;
  return false;
}

/** Hotels booking / inventory UX. Default false; auto-on when live provider + keys. */
export function isHotelsEnabled(): boolean {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_HOTELS)) return true;
  return hasLiveHotelProvider();
}

/** Experiences booking / inventory UX. Default false; auto-on when live provider + keys. */
export function isExperiencesEnabled(): boolean {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_EXPERIENCES)) return true;
  return hasLiveExperienceProvider();
}

export type PublicFeatureFlags = {
  hotels: boolean;
  experiences: boolean;
};

/** Server → client serializable flags (computed with secret env on the server). */
export function getPublicFeatureFlags(): PublicFeatureFlags {
  return {
    hotels: isHotelsEnabled(),
    experiences: isExperiencesEnabled()
  };
}
