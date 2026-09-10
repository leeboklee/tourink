import { notFound } from "next/navigation";
import { experiences } from "@/data/mock";
import { CatalogDetail } from "@/components/CatalogDetail";

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = experiences.find((e) => e.id === id);
  if (!item) notFound();

  return (
    <CatalogDetail
      image={item.image}
      title={item.title}
      eyebrow={item.category}
      meta={`${item.city} · ${item.duration} · ★ ${item.rating} (${item.reviews.toLocaleString()} reviews)`}
      description={item.description}
      price={`From ${item.currency} ${item.price}`}
      ctaLabel="Partner booking soon"
      secondaryLinks={[{ href: "/hangouts", label: "Find hangouts" }]}
    />
  );
}
