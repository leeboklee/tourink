import {
  canBookExperiences,
  canBookHotels,
  getAdminExposureSettings,
  getPublicFeatureFlags,
  hasLiveExperienceProvider,
  hasLiveHotelProvider
} from "@/lib/feature-flags";
import { FeatureFlagsPanel } from "@/components/admin/FeatureFlagsPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Feature flags · Admin"
};

export default async function AdminFeaturesPage() {
  const [admin, publicFlags] = await Promise.all([
    getAdminExposureSettings(),
    getPublicFeatureFlags()
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-paper md:text-4xl">Public features</h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">
        Control tourist exposure for Hotels and Experiences. When off, nav links are hidden and
        direct URLs redirect to the feed — no Coming soon marketing page.
      </p>

      <div className="mt-8">
        <FeatureFlagsPanel
          initial={{
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
          }}
        />
      </div>
    </div>
  );
}
