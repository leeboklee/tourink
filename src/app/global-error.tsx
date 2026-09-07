"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-[#0a0b12] text-[#f4f0ea]">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-start justify-center gap-4 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#ffb020]">Something went wrong</p>
          <h1 className="font-serif text-3xl">Tourink hit a snag</h1>
          <p className="text-sm text-white/60">Try again, or head back to the feed.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-[#ff2d6a] px-4 py-2.5 text-sm font-semibold"
            >
              Retry
            </button>
            <Link href="/" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm">
              Feed
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
