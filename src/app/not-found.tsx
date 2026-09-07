import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-neon-pink">404</p>
      <h1 className="mt-2 font-display text-3xl text-paper">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-white/55">
        That route is missing or the demo data has no match. Jump back into the feed.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-full bg-neon-pink px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Feed
        </Link>
        <Link
          href="/hangouts"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-neon-cyan/40 hover:text-neon-cyan"
        >
          Hangouts
        </Link>
        <Link
          href="/community"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-neon-cyan/40 hover:text-neon-cyan"
        >
          Community
        </Link>
      </div>
    </div>
  );
}
