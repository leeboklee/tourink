import Link from "next/link";
import { notFound } from "next/navigation";
import { forumThreads, getForumReplies } from "@/data/mock";
import { ForumReplyList } from "@/components/ForumReplyList";

export default async function ForumThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = forumThreads.find((t) => t.id === id);
  if (!thread) notFound();
  const replies = getForumReplies(thread.id);

  return (
    <div className="px-4 pb-8 pt-6 lg:px-0">
      <Link href="/forum" className="text-xs text-neon-cyan hover:underline">
        ← Back to forum
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {thread.pinned ? (
          <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
            pinned
          </span>
        ) : null}
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-white/50">
          {thread.board}
        </span>
      </div>
      <h1 className="mt-2 font-display text-3xl leading-tight">{thread.title}</h1>
      <p className="mt-2 text-xs text-white/45">
        by @{thread.author} · {thread.createdAt} · {thread.views.toLocaleString()} views
      </p>
      <p className="mt-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4 text-sm text-white/80">
        {thread.body}
      </p>
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-white/50">
        Answers · {Math.max(replies.length, thread.replies)}
      </h2>
      <ForumReplyList threadId={thread.id} initial={replies} />
    </div>
  );
}
