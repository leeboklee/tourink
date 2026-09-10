import Link from "next/link";
import type { Meetup } from "@/data/mock";
import { RsvpButton } from "@/components/RsvpButton";

export function MeetupCard({
  meetup,
  compact = false,
  showSafety = false
}: {
  meetup: Meetup;
  compact?: boolean;
  showSafety?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
        <span>
          {meetup.area}, {meetup.city}
        </span>
        <span className={compact ? undefined : "rounded-full border border-white/15 px-2 py-0.5"}>
          {meetup.when}
        </span>
      </div>
      <h2 className={compact ? "mt-2 text-base font-semibold" : "mt-2 text-lg font-semibold"}>
        {meetup.title}
      </h2>
      <p className="mt-1 text-sm text-white/70">{meetup.description}</p>
      <p className="mt-2 text-xs text-white/40">
        Host{" "}
        <Link href={`/u/${meetup.host}`} className="text-neon-cyan hover:underline">
          @{meetup.host}
        </Link>
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {meetup.tags.map((t) => (
          <Link
            key={t}
            href={`/tag/${t}`}
            className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-neon-cyan hover:bg-white/10"
          >
            #{t}
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <RsvpButton spots={meetup.spots} going={meetup.going} />
      </div>
      {showSafety ? (
        <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/45">
          Meet in public places. Never share passport/ID photos in chat. No lodging offers on Tourink hangouts —
          report hosts who ask for private stays.
        </p>
      ) : null}
    </article>
  );
}
