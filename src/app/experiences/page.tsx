import { experiences } from "@/data/mock";
import { CardLink, SectionHero } from "@/components/ui";

export const metadata = { title: "Experiences" };

export default function ExperiencesPage() {
  return (
    <div>
      <SectionHero
        eyebrow="Klook-style"
        title="Book experiences"
        subtitle="Day trips, palace photo walks, passes, and food tours — tap to reserve (demo)."
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
