import Image from "next/image";
import Link from "next/link";
import { feedPosts, meetups, profiles } from "@/data/mock";
import { FeedCard } from "@/components/FeedCard";

export default function HomePage() {
  return (
    <div>
      <div className="hidden px-4 pb-2 pt-2 lg:block lg:px-0">
        <h1 className="font-display text-3xl text-paper">Korea travel feed</h1>
        <p className="mt-1 text-sm text-white/55">
          Stories from Seoul, Busan, Jeju — like, save, follow, and meet up.
        </p>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-3 pt-2 lg:px-0">
        {profiles.slice(0, 5).map((p) => (
          <Link key={p.handle} href={`/u/${p.handle}`} className="flex w-16 shrink-0 flex-col items-center gap-1">
            <span className="rounded-full bg-gradient-to-tr from-neon-pink to-neon-cyan p-[2px]">
              <Image
                src={p.avatar}
                alt={p.handle}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border-2 border-ink-950 object-cover"
              />
            </span>
            <span className="w-full truncate text-center text-[10px] text-white/60">{p.handle}</span>
          </Link>
        ))}
      </div>

      <div className="mx-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar lg:mx-0">
        {meetups.slice(0, 2).map((m) => (
          <Link
            key={m.id}
            href="/hangouts"
            className="shrink-0 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1.5 text-xs text-neon-pink"
          >
            RSVP · {m.title}
          </Link>
        ))}
        <Link
          href="/community"
          className="shrink-0 rounded-full border border-neon-amber/30 bg-neon-amber/10 px-3 py-1.5 text-xs text-neon-amber"
        >
          Ask locals
        </Link>
        <Link
          href="/forum"
          className="shrink-0 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1.5 text-xs text-neon-cyan"
        >
          Forum Q&A
        </Link>
      </div>

      <div className="space-y-0 lg:space-y-6">
        {feedPosts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
