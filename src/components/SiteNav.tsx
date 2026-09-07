"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  Hotel,
  Map,
  MessageSquare,
  MoonStar,
  Newspaper,
  Search,
  Ticket,
  UserRound,
  Users
} from "lucide-react";
import { clsx } from "clsx";
import type { PublicFeatureFlags } from "@/lib/feature-flags";

type NavLink = {
  href: string;
  label: string;
  icon: typeof Newspaper;
};

function buildLinks(flags: PublicFeatureFlags): NavLink[] {
  const links: NavLink[] = [
    { href: "/", label: "Feed", icon: Newspaper },
    { href: "/profile", label: "My Page", icon: UserRound },
    { href: "/search", label: "Search", icon: Search },
    { href: "/notifications", label: "Alerts", icon: Bell }
  ];
  if (flags.experiences) {
    links.push({ href: "/experiences", label: "Experiences", icon: Ticket });
  }
  links.push({ href: "/routes", label: "Routes", icon: Map });
  if (flags.hotels) {
    links.push({ href: "/hotels", label: "Hotels", icon: Hotel });
  }
  links.push(
    { href: "/nightlife", label: "Nightlife", icon: MoonStar },
    { href: "/hangouts", label: "Hangouts", icon: Users },
    { href: "/community", label: "Community", icon: Compass },
    { href: "/forum", label: "Forum", icon: MessageSquare }
  );
  return links;
}

export function SiteNav({ flags }: { flags: PublicFeatureFlags }) {
  const pathname = usePathname();
  const links = buildLinks(flags);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-56 lg:flex-col lg:justify-between lg:py-8">
        <div>
          <Link href="/" className="font-display text-3xl tracking-tight text-paper">
            Tourink
          </Link>
          <p className="mt-2 text-sm text-white/55">Korea travel, feed-first.</p>
          <nav className="mt-10 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href)) ||
                (href === "/profile" &&
                  (pathname.startsWith("/compose") || pathname.startsWith("/reel")));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-white/10 text-neon-cyan"
                      : "text-white/70 hover:bg-white/5 hover:text-paper"
                  )}
                >
                  <Icon size={18} />
                  <span className="flex-1">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="space-y-2 text-xs text-white/45">
          <Link href="/auth/signin" className="block text-neon-cyan hover:underline">
            Sign in
          </Link>
          <p>Community · hangouts · routes</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-display text-2xl text-paper">
            Tourink
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="rounded-full border border-white/15 p-2 text-white/70"
              aria-label="Search"
            >
              <Search size={16} />
            </Link>
            <Link
              href="/notifications"
              className="rounded-full border border-white/15 p-2 text-white/70"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-neon-pink/40 px-2.5 py-1 text-[11px] uppercase tracking-wider text-neon-pink"
            >
              My Page
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href)) ||
              (href === "/profile" &&
                (pathname.startsWith("/compose") || pathname.startsWith("/reel")));
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "relative flex min-w-[4.5rem] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px]",
                  active ? "text-neon-cyan" : "text-white/55"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
