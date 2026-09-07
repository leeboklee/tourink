import Link from "next/link";
import { prisma } from "@/lib/db";
import { ModerationQueue } from "@/components/admin/ModerationQueue";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Content moderation · Admin"
};

export default async function AdminModerationPage() {
  const reports = await prisma.contentReport.findMany({
    where: { status: "open" },
    include: {
      reporter: { select: { handle: true, name: true } },
      targetUser: { select: { handle: true, name: true, id: true } },
      post: { select: { id: true, caption: true, active: true, shadowHidden: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const serialized = reports.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString()
  }));

  const shadowCount = await prisma.feedPost.count({ where: { shadowHidden: true, active: true } });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wide text-neon-cyan/80">safety · staff</p>
        <h1 className="mt-1 font-display text-3xl text-paper md:text-4xl">
          Content moderation
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          Instagram-style report queue. Hide or remove reported posts; shadow-filtered spam stays
          out of the main feed. See <code className="text-white/70">docs/MODERATION.md</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
          <span>{serialized.length} open reports</span>
          <span>·</span>
          <span>{shadowCount} shadow-hidden posts</span>
          <Link href="/admin" className="text-neon-cyan hover:underline">
            ← Dashboard
          </Link>
        </div>
      </header>

      <ModerationQueue initial={serialized} />
    </div>
  );
}
