import Link from "next/link";

export function ComingSoon({
  title,
  subtitle,
  enableHint
}: {
  title: string;
  subtitle: string;
  enableHint?: string;
}) {
  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neon-amber">Coming soon</p>
      <h1 className="font-display text-3xl leading-tight text-paper md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-white/60 md:text-base">{subtitle}</p>
      {enableHint ? (
        <p className="mt-4 max-w-xl rounded-xl border border-white/10 bg-ink-900/40 px-4 py-3 text-xs text-white/45">
          {enableHint}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-xl bg-neon-cyan/15 px-4 py-2.5 text-sm font-medium text-neon-cyan hover:bg-neon-cyan/25"
        >
          Back to feed
        </Link>
        <Link
          href="/routes"
          className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:border-white/30"
        >
          Browse routes
        </Link>
        <Link
          href="/nightlife"
          className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:border-white/30"
        >
          Nightlife
        </Link>
      </div>
    </div>
  );
}
