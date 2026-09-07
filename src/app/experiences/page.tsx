import { dbListExperiences } from "@/lib/catalog";
import { isExperiencesEnabled } from "@/lib/feature-flags";
import { CardLink, SectionHero } from "@/components/ui";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Experiences" };

export default async function ExperiencesPage() {
  if (!isExperiencesEnabled()) {
    return (
      <ComingSoon
        title="Experiences — tickets soon"
        subtitle="Klook / Viator / GetYourGuide booking needs partner approval. Catalog booking stays Coming soon — no fake checkout."
        enableHint="Staff: set EXPERIENCE_PROVIDER=klook|viator|getyourguide with partner keys, or NEXT_PUBLIC_ENABLE_EXPERIENCES=true for a staging override. See /admin/reports."
      />
    );
  }

  const experiences = await dbListExperiences();

  return (
    <div>
      <SectionHero
        eyebrow="Experiences"
        title="Book experiences"
        subtitle="Day trips, palace photo walks, passes, and food tours — live slots from the configured provider."
      />
      <div className="grid gap-4 px-4 pb-8 sm:grid-cols-2 lg:px-0">
        {experiences.map((e) => (
          <CardLink
            key={e.id}
            href={`/experience/${e.id}`}
            image={e.image}
            title={e.title}
            meta={`${e.city} · ${e.duration} · ★ ${e.rating} (${e.reviews.toLocaleString()})`}
            price={`From ${e.currency} ${e.price}`}
          />
        ))}
      </div>
    </div>
  );
}
