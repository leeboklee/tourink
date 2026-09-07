"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-4 py-16 lg:px-0">
      <p className="text-xs uppercase tracking-[0.2em] text-neon-amber">Error</p>
      <h1 className="mt-2 font-display text-3xl text-paper">Couldn’t load this page</h1>
      <p className="mt-2 max-w-md text-sm text-white/55">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-neon-pink px-4 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
        >
          Back to feed
        </Link>
      </div>
    </div>
  );
}
