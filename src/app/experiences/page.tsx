import { redirect } from "next/navigation";
import { dbListExperiences } from "@/lib/catalog";
import { isExperiencesEnabled } from "@/lib/feature-flags";
import { CardLink, SectionHero } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Experiences" };

export default async function ExperiencesPage() {
  if (!(await isExperiencesEnabled())) {
    redirect("/");
  }

  const experiences = await dbListExperiences();

  return (
    <div>
      <SectionHero
        eyebrow="Experiences"
        title="Book experiences"
        subtitle="Day trips, palace photo walks, passes, and food tours from the Tourink catalog."
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
