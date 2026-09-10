import Link from "next/link";
import Image from "next/image";
import { Bell, Heart, MessageCircle, UserPlus, Users } from "lucide-react";
import { getProfile, notifications } from "@/data/mock";
import { SectionHero } from "@/components/ui";

export const metadata = { title: "Notifications" };

function iconFor(kind: (typeof notifications)[number]["kind"]) {
  switch (kind) {
    case "like":
      return Heart;
    case "reply":
    case "mention":
      return MessageCircle;
    case "follow":
      return UserPlus;
    case "rsvp":
      return Users;
    default:
      return Bell;
  }
}

export default function NotificationsPage() {
  return (
    <div>
      <SectionHero
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Likes, RSVPs, replies, and new followers — demo list for the feed-first flow."
      />
      <div className="space-y-2 px-4 pb-8 lg:px-0">
        {notifications.map((n) => {
          const Icon = iconFor(n.kind);
          const actor = getProfile(n.actor);
          return (
            <Link
              key={n.id}
              href={n.href}
              className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition hover:border-neon-cyan/40 ${
                n.unread ? "border-neon-cyan/25 bg-neon-cyan/5" : "border-white/10 bg-ink-900/40"
              }`}
            >
              {actor ? (
                <Image
                  src={actor.avatar}
                  alt={n.actor}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Icon size={18} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">@{n.actor}</span>{" "}
                  <span className="text-white/70">{n.text}</span>
                </p>
                <p className="mt-1 text-xs text-white/40">{n.createdAt}</p>
              </div>
              <Icon size={16} className="mt-1 shrink-0 text-white/35" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
