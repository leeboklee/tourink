/**
 * Public product surface flags.
 *
 * Hotels / Experiences stay hidden from tourists until staff enables public
 * exposure in Admin → Features (DB), or a live partner provider / staging env
 * override is configured. Booking/checkout still requires partner keys (or
 * NEXT_PUBLIC_ENABLE_* staging override) — catalog can be public without fake checkout.
 */

import { prisma } from "@/lib/db";

export const SITE_SETTING_KEYS = {
  hotelsPublic: "public.hotels",
  experiencesPublic: "public.experiences"
} as const;

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

/** Staff DB toggles for public catalog exposure (not booking). */
export async function getAdminExposureSettings(): Promise<{
  hotels: boolean;
  experiences: boolean;
}> {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [SITE_SETTING_KEYS.hotelsPublic, SITE_SETTING_KEYS.experiencesPublic]
      }
    }
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    hotels: map[SITE_SETTING_KEYS.hotelsPublic] === "true",
    experiences: map[SITE_SETTING_KEYS.experiencesPublic] === "true"
  };
}

export async function setAdminExposureSetting(
  surface: "hotels" | "experiences",
  enabled: boolean
): Promise<void> {
  const key =
    surface === "hotels" ? SITE_SETTING_KEYS.hotelsPublic : SITE_SETTING_KEYS.experiencesPublic;
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: enabled ? "true" : "false" },
    update: { value: enabled ? "true" : "false" }
  });
}

/**
 * Public nav + catalog pages. Default off.
 * On when: admin DB toggle, NEXT_PUBLIC_ENABLE_* staging override, or live provider keys.
 */
export async function isHotelsEnabled(): Promise<boolean> {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_HOTELS)) return true;
  if (hasLiveHotelProvider()) return true;
  const admin = await getAdminExposureSettings();
  return admin.hotels;
}

export async function isExperiencesEnabled(): Promise<boolean> {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_EXPERIENCES)) return true;
  if (hasLiveExperienceProvider()) return true;
  const admin = await getAdminExposureSettings();
  return admin.experiences;
}

/**
 * Booking / availability / checkout. Requires live partner keys or staging override.
 * Admin public exposure alone does not enable mock checkout.
 */
export function canBookHotels(): boolean {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_HOTELS)) return true;
  return hasLiveHotelProvider();
}

export function canBookExperiences(): boolean {
  if (envTrue(process.env.NEXT_PUBLIC_ENABLE_EXPERIENCES)) return true;
  return hasLiveExperienceProvider();
}

export type PublicFeatureFlags = {
  hotels: boolean;
  experiences: boolean;
};

/** Server → client serializable flags (DB + secret env on the server). */
export async function getPublicFeatureFlags(): Promise<PublicFeatureFlags> {
  const [hotels, experiences] = await Promise.all([isHotelsEnabled(), isExperiencesEnabled()]);
  return { hotels, experiences };
}
