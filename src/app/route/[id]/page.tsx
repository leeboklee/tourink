import { notFound } from "next/navigation";
import { routes } from "@/data/mock";
import { CatalogDetail } from "@/components/CatalogDetail";

export default async function RoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = routes.find((r) => r.id === id);
  if (!route) notFound();

  return (
    <CatalogDetail
      image={route.image}
      title={route.title}
      meta={`${route.days} days · ${route.cities.join(" → ")}`}
      description={route.summary}
      listItems={route.highlights}
      listOrdered
      ctaLabel="Save route soon"
      secondaryLinks={[
        { href: "/nightlife", label: "Nightlife" },
        { href: "/hangouts", label: "Hangouts" }
      ]}
    />
  );
}
