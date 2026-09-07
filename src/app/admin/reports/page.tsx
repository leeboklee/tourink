import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  getDeliverableReports,
  getExperienceIntegrationReport,
  getFreeApisReport,
  getHotelIntegrationReport,
  type IntegrationReport
} from "@/lib/admin-reports";
import { AiAnswersPanel, type AiCreatorBundle } from "@/components/admin/AiAnswersPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Result reports · Admin"
};

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-md border border-neon-cyan/30 bg-neon-cyan/10 px-2 py-0.5 text-[11px] font-medium text-neon-cyan">
      {label}
    </span>
  );
}

function IntegrationCard({ report }: { report: IntegrationReport }) {
  return (
    <article className="rounded-xl border border-white/10 bg-ink-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-xl text-paper">{report.titleKo}</h2>
          <p className="mt-0.5 text-sm text-white/50">{report.titleEn}</p>
        </div>
        <StatusPill label={report.statusLabel} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{report.summary}</p>

      <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
        Active provider · <span className="text-neon-cyan">{report.activeProvider}</span>
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {report.providers.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-white/8 bg-ink-950/50 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-paper">{p.displayName}</p>
              <span
                className={`text-[10px] uppercase ${
                  p.mode === "mock"
                    ? "text-neon-amber"
                    : p.configured
                      ? "text-neon-cyan"
                      : "text-white/35"
                }`}
              >
                {p.mode === "mock" ? "mock" : p.configured ? "keys set" : "stub"}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/45">{p.notes}</p>
            <p className="mt-1 font-mono text-[10px] text-white/30">{p.envKeys.join(" · ")}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-white/40">
        How it works
      </h3>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-white/65">
        {report.howItWorks.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-white/40">
        Code paths
      </h3>
      <ul className="mt-2 space-y-1">
        {report.codePaths.map((c) => (
          <li key={c.path} className="flex flex-wrap gap-x-2 text-xs">
            <span className="text-white/50">{c.label}</span>
            <code className="text-neon-cyan/80">{c.path}</code>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-white/40">
        Env: {report.envHints.join(", ")} — see <code className="text-white/55">.env.example</code>
      </p>
    </article>
  );
}

async function loadAiCreators(): Promise<AiCreatorBundle[]> {
  const users = await prisma.user.findMany({
    where: { isOfficialAi: true },
    orderBy: { handle: "asc" },
    include: {
      feedPosts: { orderBy: { createdAt: "desc" }, take: 4 },
      threads: { orderBy: { createdAt: "desc" }, take: 3 },
      reels: { orderBy: { createdAt: "desc" }, take: 3 }
    }
  });

  return users.map((u) => {
    const feedItems = u.feedPosts.map((p) => ({
      kind: "feed" as const,
      id: p.id,
      preview: p.caption.slice(0, 160) || "(empty caption)",
      createdAt: p.createdAt,
      active: p.active,
      meta: p.location
    }));
    const threadItems = u.threads.map((t) => ({
      kind: "thread" as const,
      id: t.id,
      preview: t.body.slice(0, 160) || "(empty)",
      createdAt: t.createdAt,
      active: t.active
    }));
    const reelItems = u.reels.map((r) => ({
      kind: "reel" as const,
      id: r.id,
      preview: r.caption.slice(0, 160) || "(empty caption)",
      createdAt: r.createdAt,
      active: r.active,
      meta: r.location ?? undefined
    }));

    const items = [...feedItems, ...threadItems, ...reelItems].slice(0, 8);

    return {
      id: u.id,
      handle: u.handle,
      name: u.name,
      persona: u.persona,
      image: u.image,
      city: u.city,
      items
    };
  });
}

export default async function AdminReportsPage() {
  const hotel = getHotelIntegrationReport();
  const experiences = getExperienceIntegrationReport();
  const freeApis = getFreeApisReport();
  const deliverables = getDeliverableReports();
  const creators = await loadAiCreators();

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-wide text-neon-cyan/80">monday.org · staff</p>
        <h1 className="mt-1 font-display text-3xl text-paper md:text-4xl">
          결과 리포트 · Result reports
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          In-product answers for hotel / ticket API integrations, hidden feature flags, free public
          APIs, agent deliverables, and Official AI publishing review. Primary UI English; Korean
          titles for staff scan.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <a href="#integrations" className="text-neon-cyan hover:underline">
            API integrations
          </a>
          <a href="#deliverables" className="text-neon-cyan hover:underline">
            Deliverables
          </a>
          <a href="#ai-answers" className="text-neon-cyan hover:underline">
            AI Answers
          </a>
          <Link href="/admin" className="text-white/45 hover:text-paper">
            ← Dashboard
          </Link>
        </div>
      </header>

      <section id="integrations" className="space-y-4 scroll-mt-6">
        <h2 className="font-display text-2xl text-paper">API 연동 · Integrations</h2>
        <IntegrationCard report={hotel} />
        <IntegrationCard report={experiences} />
        <IntegrationCard report={freeApis} />
      </section>

      <section id="deliverables" className="space-y-4 scroll-mt-6">
        <h2 className="font-display text-2xl text-paper">에이전트 산출물 · Deliverables</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {deliverables.map((d) => (
            <article
              key={d.id}
              className="rounded-xl border border-white/10 bg-ink-900/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-paper">{d.titleKo}</h3>
                  <p className="text-xs text-white/45">{d.titleEn}</p>
                </div>
                <StatusPill label={d.statusLabel} />
              </div>
              <p className="mt-2 text-sm text-white/65">{d.summary}</p>
              <ul className="mt-3 space-y-1 text-xs text-white/50">
                {d.bullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {d.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-neon-cyan hover:border-neon-cyan/40"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="ai-answers" className="space-y-4 scroll-mt-6">
        <div>
          <h2 className="font-display text-2xl text-paper">AI 답변 · AI Answers</h2>
          <p className="mt-1 text-sm text-white/55">
            Official AI creator handles and recent posts / threads / reels from seed + DB. Use{" "}
            <span className="text-white/80">Hide</span> to unpublish or{" "}
            <span className="text-white/80">Approve</span> to restore.
          </p>
        </div>
        <AiAnswersPanel creators={creators} />
      </section>
    </div>
  );
}
