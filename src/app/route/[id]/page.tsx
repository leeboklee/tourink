import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dbListRoutes } from "@/lib/catalog";
import { isExperiencesEnabled, isHotelsEnabled } from "@/lib/feature-flags";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const routes = await dbListRoutes();
  const route = routes.find((r) => r.id === id);
  return { title: route?.title ?? "Route" };
}

export default async function RoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const routes = await dbListRoutes();
  const route = routes.find((r) => r.id === id);
  if (!route) notFound();

  const hotelsOn = isHotelsEnabled();
  const experiencesOn = isExperiencesEnabled();

  return (
    <div className="px-4 pb-8 pt-4 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="relative aspect-[16/10]">
          <Image src={route.image} alt={route.title} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="space-y-3 p-5">
          <h1 className="font-display text-3xl">{route.title}</h1>
          <p className="text-sm text-white/55">
            {route.days} days · {route.cities.join(" → ")}
          </p>
          <p className="text-base text-white/80">{route.summary}</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-white/75">
            {route.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
          {hotelsOn || experiencesOn ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              {hotelsOn ? (
                <Link
                  href="/hotels"
                  className="flex-1 rounded-xl bg-neon-pink px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 hover:brightness-110"
                >
                  Book hotels on this route
                </Link>
              ) : null}
              {experiencesOn ? (
                <Link
                  href="/experiences"
                  className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm text-white/80 hover:border-neon-cyan/50"
                >
                  Add experiences
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
              Hotel & experience booking coming soon — browse nightlife and hangouts while partner APIs
              connect.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
