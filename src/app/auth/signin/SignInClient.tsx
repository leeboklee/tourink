"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInClient() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/profile";
  const [handle, setHandle] = useState("sofia.mx");
  const [password, setPassword] = useState("tourink-demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      handle,
      password,
      redirect: false,
      callbackUrl
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid handle or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="px-4 pb-10 pt-8 lg:px-0">
      <h1 className="font-display text-3xl text-paper">Sign in</h1>
      <p className="mt-2 text-sm text-white/55">
        Demo credentials ship with seed. OAuth providers activate when env keys are set.
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Handle</span>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2.5 outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-neon-pink px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-xs text-white/40">
        Default demo: <code className="text-white/60">sofia.mx</code> /{" "}
        <code className="text-white/60">tourink-demo</code>
      </p>
      <Link href="/" className="mt-4 inline-block text-sm text-neon-cyan hover:underline">
        ← Back to feed
      </Link>
    </div>
  );
}
