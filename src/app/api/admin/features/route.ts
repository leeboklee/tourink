import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/staff";
import {
  canBookExperiences,
  canBookHotels,
  getAdminExposureSettings,
  getPublicFeatureFlags,
  hasLiveExperienceProvider,
  hasLiveHotelProvider,
  setAdminExposureSetting
} from "@/lib/feature-flags";

const patchSchema = z.object({
  surface: z.enum(["hotels", "experiences"]),
  enabled: z.boolean()
});

/** Staff: read admin DB toggles + effective public/booking status. */
export async function GET() {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [admin, publicFlags] = await Promise.all([
    getAdminExposureSettings(),
    getPublicFeatureFlags()
  ]);

  return NextResponse.json({
    admin,
    public: publicFlags,
    booking: {
      hotels: canBookHotels(),
      experiences: canBookExperiences()
    },
    liveProviders: {
      hotels: hasLiveHotelProvider(),
      experiences: hasLiveExperienceProvider()
    }
  });
}

/** Staff: flip public exposure for Hotels / Experiences (persisted in SiteSetting). */
export async function PATCH(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { surface, enabled } = parsed.data;
  await setAdminExposureSetting(surface, enabled);

  const [admin, publicFlags] = await Promise.all([
    getAdminExposureSettings(),
    getPublicFeatureFlags()
  ]);

  return NextResponse.json({
    ok: true,
    admin,
    public: publicFlags
  });
}
