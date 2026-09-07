import { dbListMeetups } from "@/lib/catalog";
import { SectionHero } from "@/components/ui";
import { RsvpButton } from "@/components/RsvpButton";
import Link from "next/link";

export const metadata = { title: "Hangouts" };

export default async function HangoutsPage() {
  const meetups = await dbListMeetups();

  return (
    <div>
      <SectionHero
        eyebrow="Couchsurfing-lite"
        title="Hangouts & RSVP"
        subtitle="Meet travelers and locals for food crawls, hikes, and cafe tips — hangouts only, no lodging offers."
      />
      <div className="space-y-3 px-4 pb-8 lg:px-0">
        {meetups.map((m) => (
          <article key={m.id} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
              <span>
                {m.area}, {m.city}
              </span>
              <span className="rounded-full border border-white/15 px-2 py-0.5">{m.when}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold">{m.title}</h2>
            <p className="mt-1 text-sm text-white/70">{m.description}</p>
            <p className="mt-2 text-xs text-white/40">
              Host{" "}
              <Link href={`/u/${m.host}`} className="text-neon-cyan hover:underline">
                @{m.host}
              </Link>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.tags.map((t) => (
                <Link key={t} href={`/tag/${t}`} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-neon-cyan">
                  #{t}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <RsvpButton meetupId={m.id} spots={m.spots} going={m.going} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
