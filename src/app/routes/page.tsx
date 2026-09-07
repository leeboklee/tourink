import { dbListRoutes } from "@/lib/catalog";
import { CardLink, SectionHero } from "@/components/ui";

export const metadata = { title: "Routes" };

export default async function RoutesPage() {
  const routes = await dbListRoutes();

  return (
    <div>
      <SectionHero
        eyebrow="Visit routes"
        title="Ready-made Korea itineraries"
        subtitle="First-timer loops and coast combos — follow the path, then book stays and tickets."
      />
      <div className="grid gap-4 px-4 pb-8 sm:grid-cols-2 lg:px-0">
        {routes.map((r) => (
          <CardLink
            key={r.id}
            href={`/route/${r.id}`}
            image={r.image}
            title={r.title}
            meta={`${r.days} days · ${r.cities.join(" → ")}`}
          />
        ))}
      </div>
    </div>
  );
}
