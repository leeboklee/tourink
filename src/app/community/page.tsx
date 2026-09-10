import Link from "next/link";
import { communityPosts, meetups } from "@/data/mock";
import { SectionHero } from "@/components/ui";
import { MeetupCard } from "@/components/MeetupCard";

export const metadata = { title: "Community" };

export default function CommunityPage() {
  const askLocals = communityPosts.filter((p) => p.kind === "ask-local");
  const boards = communityPosts.filter((p) => p.kind !== "ask-local");

  return (
    <div>
      <SectionHero
        eyebrow="Ask locals"
        title="Community board"
        subtitle="Ask-a-local Q&A and traveler tips — hangouts live under Hangouts."
      />

      <section className="space-y-3 px-4 pb-6 lg:px-0">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Tonight&apos;s hangouts</h2>
          <Link href="/hangouts" className="text-xs text-neon-cyan hover:underline">
            See all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {meetups.slice(0, 4).map((m) => (
            <MeetupCard key={m.id} meetup={m} compact />
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4 pb-6 lg:px-0">
        <h2 className="text-lg font-semibold">Ask locals</h2>
        {askLocals.map((post) => (
          <article key={post.id} className="rounded-2xl border border-neon-amber/20 bg-ink-900/50 p-4">
            <div className="flex items-center justify-between gap-3 text-xs text-white/45">
              <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                ask local
              </span>
              <span>{post.createdAt}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold">{post.title}</h3>
            <p className="mt-1 text-sm text-white/70">{post.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <Link href={`/u/${post.author}`} className="text-white/45 hover:text-neon-cyan">
                @{post.author}
              </Link>
              {post.tags.map((t) => (
                <Link key={t} href={`/tag/${t}`} className="rounded-full bg-white/5 px-2 py-1 text-neon-cyan">
                  #{t}
                </Link>
              ))}
              <span className="ml-auto text-white/45">{post.replies} replies</span>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-3 px-4 pb-8 lg:px-0">
        <h2 className="text-lg font-semibold">Traveler posts</h2>
        {boards.map((post) => (
          <article key={post.id} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="flex items-center justify-between gap-3 text-xs text-white/45">
              <Link href={`/u/${post.author}`} className="hover:text-neon-cyan">
                @{post.author}
              </Link>
              <span>{post.createdAt}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold">{post.title}</h3>
            <p className="mt-1 text-sm text-white/70">{post.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {post.tags.map((t) => (
                <Link key={t} href={`/tag/${t}`} className="rounded-full bg-white/5 px-2 py-1 text-neon-cyan">
                  #{t}
                </Link>
              ))}
              <span className="ml-auto text-white/45">{post.replies} replies</span>
            </div>
          </article>
        ))}
        <Link
          href="/forum"
          className="block rounded-xl border border-dashed border-white/20 px-4 py-3 text-center text-sm text-white/60 hover:border-neon-cyan/40 hover:text-neon-cyan"
        >
          Prefer threaded Q&A? Open the forum →
        </Link>
      </section>
    </div>
  );
}
