import Link from "next/link";
import { prisma } from "@/lib/db";
import { ADMIN_NAV } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    experiences,
    hotels,
    routes,
    nightlife,
    hangouts,
    feed,
    forum,
    community,
    aiProfiles
  ] = await Promise.all([
    prisma.experience.count(),
    prisma.hotel.count(),
    prisma.routePlan.count(),
    prisma.nightlifeSpot.count(),
    prisma.meetup.count(),
    prisma.feedPost.count(),
    prisma.forumThread.count(),
    prisma.communityPost.count(),
    prisma.user.count({ where: { isOfficialAi: true } })
  ]);

  const counts: Record<string, number> = {
    experiences,
    hotels,
    routes,
    nightlife,
    hangouts,
    feed,
    forum,
    community,
    profiles: aiProfiles
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-paper md:text-4xl">Staff CMS</h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">
        Edit catalog content shown on the public Tourink site. Unpublished rows stay in the DB but are
        hidden from tourist pages.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-4 transition hover:border-neon-cyan/40"
          >
            <p className="text-sm font-semibold text-paper">{item.label}</p>
            <p className="mt-1 text-2xl font-display text-neon-cyan">{counts[item.key] ?? 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
