import { meetups } from "@/data/mock";
import { SectionHero } from "@/components/ui";
import { MeetupCard } from "@/components/MeetupCard";

export const metadata = { title: "Hangouts" };

export default function HangoutsPage() {
  return (
    <div>
      <SectionHero
        eyebrow="Meet in public"
        title="Hangouts & RSVP"
        subtitle="Meet travelers and locals for food crawls, hikes, and cafe tips — hangouts only, no lodging offers."
      />
      <div className="space-y-3 px-4 pb-8 lg:px-0">
        {meetups.map((m) => (
          <MeetupCard key={m.id} meetup={m} showSafety />
        ))}
      </div>
    </div>
  );
}
