"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
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
import { CURRENT_USER_HANDLE, reelPosts } from "@/data/mock";

const primaryLinks = [
  { href: "/", label: "Feed", icon: Newspaper },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "My Page", icon: UserRound },
  { href: "/hangouts", label: "Hangouts", icon: Users },
  { href: "/forum", label: "Forum", icon: MessageSquare }
];

const moreLinks = [
  { href: "/community", label: "Community", icon: Compass },
  { href: "/routes", label: "Routes", icon: Map },
  { href: "/nightlife", label: "Nightlife", icon: MoonStar },
  { href: "/experiences", label: "Experiences", icon: Ticket },
  { href: "/hotels", label: "Hotels", icon: Hotel }
];

function isMyPageContext(pathname: string) {
  if (pathname.startsWith("/compose")) return true;
  if (!pathname.startsWith("/reel/")) return false;
  const reelId = pathname.slice("/reel/".length).split("/")[0];
  const reel = reelPosts.find((r) => r.id === reelId);
  return reel?.author === CURRENT_USER_HANDLE;
}

function isActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/" && pathname.startsWith(href)) ||
    (href === "/profile" && isMyPageContext(pathname))
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  mobile
}: {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  pathname: string;
  mobile?: boolean;
}) {
  const active = isActive(pathname, href);
  if (mobile) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex min-w-[4.25rem] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px]",
          active ? "text-neon-cyan" : "text-white/55"
        )}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        active ? "bg-white/10 text-neon-cyan" : "text-white/70 hover:bg-white/5 hover:text-paper"
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const mobileLinks = [...primaryLinks.slice(0, 5), { href: "/forum", label: "Forum", icon: MessageSquare }];

  return (
    <>
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-56 lg:flex-col lg:justify-between lg:py-8">
        <div>
          <Link href="/" className="font-display text-3xl tracking-tight text-paper">
            Tourink
          </Link>
          <p className="mt-2 text-sm text-white/55">Korea travel, feed-first.</p>
          <nav className="mt-10 space-y-1">
            {primaryLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </nav>
          <p className="mb-2 mt-8 px-3 text-[10px] uppercase tracking-wider text-white/35">Discover</p>
          <nav className="space-y-1">
            {moreLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </nav>
        </div>
        <p className="text-xs text-white/35">Feed · hangouts · guides</p>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-2xl text-paper">
            Tourink
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70"
              aria-label="Search"
            >
              <Search size={14} />
            </Link>
            <Link
              href="/notifications"
              className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70"
              aria-label="Notifications"
            >
              <Bell size={14} />
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
          {mobileLinks.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} mobile />
          ))}
        </div>
      </nav>
    </>
  );
}
