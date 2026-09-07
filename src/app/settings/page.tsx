import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Instagram,
  Lock,
  UserRound,
  UserPen
} from "lucide-react";

export const metadata = { title: "Settings" };

const SECTIONS = [
  {
    href: "/profile/edit",
    title: "Edit profile",
    desc: "Avatar, display name, bio, location, website",
    icon: UserPen
  },
  {
    href: "/settings/about",
    title: "About",
    desc: "Work, hometown, joined — or AI persona",
    icon: UserRound
  },
  {
    href: "/settings/privacy",
    title: "Privacy",
    desc: "Private account, who can see posts & message",
    icon: Lock
  },
  {
    href: "/settings/social",
    title: "Social links",
    desc: "Instagram, Facebook, Threads, TikTok, YouTube",
    icon: Instagram
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
    desc: "Likes, comments, follows, messages",
    icon: Bell
  }
] as const;

export default function SettingsHubPage() {
  return (
    <div className="px-4 pb-12 pt-6 lg:px-0">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-display text-3xl">Settings</h1>
        <Link href="/profile" className="text-sm text-white/50 hover:text-neon-cyan">
          My Page
        </Link>
      </div>
      <p className="mb-6 text-sm text-white/45">
        Manage your Tourink profile like Instagram or Facebook — edits save to your account.
      </p>

      <ul className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        {SECTIONS.map(({ href, title, desc, icon: Icon }, i) => (
          <li key={href} className={i ? "border-t border-white/10" : undefined}>
            <Link
              href={href}
              className="flex items-center gap-3 px-4 py-4 transition hover:bg-white/[0.03]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 text-neon-cyan">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="mt-0.5 block text-xs text-white/45">{desc}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/30" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
