import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { dbGetExperience } from "@/lib/catalog";
import { canBookExperiences, isExperiencesEnabled } from "@/lib/feature-flags";
import { ExperienceAvailabilityPanel } from "@/components/ExperienceAvailabilityPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await dbGetExperience(id);
  return { title: item?.title ?? "Experience" };
}

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isExperiencesEnabled())) {
    redirect("/");
  }

  const { id } = await params;
  const item = await dbGetExperience(id);
  if (!item) notFound();

  const bookingOn = canBookExperiences();

  return (
    <div className="px-4 pb-8 pt-4 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="relative aspect-[16/10]">
          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-wider text-neon-amber">{item.category}</p>
          <h1 className="font-display text-3xl">{item.title}</h1>
          <p className="text-sm text-white/55">
            {item.city} · {item.duration} · ★ {item.rating} ({item.reviews.toLocaleString()} reviews)
          </p>
          <p className="text-base text-white/80">{item.description}</p>
          <p className="text-xl font-semibold text-neon-amber">
            From {item.currency} {item.price}
          </p>
          {bookingOn ? (
            <ExperienceAvailabilityPanel
              experienceId={item.id}
              currency={item.currency}
              priceFrom={item.price}
            />
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
              Live tickets and checkout need a partner experience provider. Browse the details for now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
