import Link from "next/link";
import { forumThreads } from "@/data/mock";
import { SectionHero } from "@/components/ui";

export default function ForumPage() {
  return (
    <div>
      <SectionHero
        eyebrow="Forum · Q&A"
        title="Ask Korea anything"
        subtitle="Housing, visas, food heat levels, nightlife routes — locals can mark best answers."
      />
      <div className="overflow-hidden rounded-2xl border border-white/10 mx-4 mb-8 lg:mx-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800/80 text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-4 py-3 font-medium">Thread</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Replies</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Views</th>
            </tr>
          </thead>
          <tbody>
            {forumThreads.map((t) => (
              <tr key={t.id} className="border-t border-white/10 bg-ink-900/40">
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {t.pinned ? (
                      <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                        pinned
                      </span>
                    ) : null}
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-white/50">
                      {t.board}
                    </span>
                  </div>
                  <Link href={`/forum/${t.id}`} className="mt-1 block font-medium hover:text-neon-cyan">
                    {t.title}
                  </Link>
                  <p className="text-xs text-white/40">
                    by {t.author} · {t.createdAt}
                  </p>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">{t.replies}</td>
                <td className="hidden px-4 py-3 md:table-cell">{t.views.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
