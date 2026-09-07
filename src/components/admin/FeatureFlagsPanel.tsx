"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FeatureState = {
  admin: { hotels: boolean; experiences: boolean };
  public: { hotels: boolean; experiences: boolean };
  booking: { hotels: boolean; experiences: boolean };
  liveProviders: { hotels: boolean; experiences: boolean };
};

export function FeatureFlagsPanel({ initial }: { initial: FeatureState }) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(surface: "hotels" | "experiences") {
    setPending(surface);
    setError(null);
    try {
      const res = await fetch("/api/admin/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface,
          enabled: !state.admin[surface]
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Toggle failed");
      setState((prev) => ({
        ...prev,
        admin: data.admin ?? {
          ...prev.admin,
          [surface]: !prev.admin[surface]
        },
        public: data.public ?? prev.public
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setPending(null);
    }
  }

  const rows: Array<{
    key: "hotels" | "experiences";
    label: string;
    hint: string;
  }> = [
    {
      key: "hotels",
      label: "Hotels",
      hint: "Show /hotels and /hotel/* in public nav. Checkout still needs HOTEL_PROVIDER + keys (or NEXT_PUBLIC_ENABLE_HOTELS)."
    },
    {
      key: "experiences",
      label: "Experiences",
      hint: "Show /experiences and /experience/* in public nav. Checkout still needs EXPERIENCE_PROVIDER + keys (or NEXT_PUBLIC_ENABLE_EXPERIENCES)."
    }
  ];

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}

      {rows.map((row) => {
        const adminOn = state.admin[row.key];
        const publicOn = state.public[row.key];
        const bookingOn = state.booking[row.key];
        const live = state.liveProviders[row.key];
        return (
          <section
            key={row.key}
            className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-paper">{row.label}</h2>
                <p className="mt-1 max-w-xl text-xs text-white/50">{row.hint}</p>
              </div>
              <button
                type="button"
                disabled={pending === row.key}
                onClick={() => void toggle(row.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  adminOn
                    ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                    : "border border-white/15 text-white/55 hover:border-white/30"
                } disabled:opacity-50`}
              >
                {pending === row.key ? "Saving…" : adminOn ? "Public on" : "Public off"}
              </button>
            </div>
            <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-lg bg-ink-950/50 px-3 py-2">
                <dt className="text-white/40">Admin DB</dt>
                <dd className="mt-0.5 text-paper">{adminOn ? "enabled" : "disabled"}</dd>
              </div>
              <div className="rounded-lg bg-ink-950/50 px-3 py-2">
                <dt className="text-white/40">Effective public</dt>
                <dd className="mt-0.5 text-paper">
                  {publicOn ? "visible" : "hidden"}
                  {live && !adminOn ? " · live keys" : ""}
                </dd>
              </div>
              <div className="rounded-lg bg-ink-950/50 px-3 py-2">
                <dt className="text-white/40">Booking / checkout</dt>
                <dd className="mt-0.5 text-paper">{bookingOn ? "available" : "catalog only"}</dd>
              </div>
            </dl>
          </section>
        );
      })}

      <aside className="rounded-xl border border-neon-amber/25 bg-neon-amber/5 px-4 py-3 text-xs text-white/55">
        <p className="font-medium text-neon-amber">Staff only — provider keys</p>
        <p className="mt-1">
          Set <code className="text-white/70">HOTEL_PROVIDER=expedia|amadeus</code> with partner keys,
          or <code className="text-white/70">EXPERIENCE_PROVIDER=klook|viator|getyourguide</code> with
          partner keys, for live checkout. Staging override:{" "}
          <code className="text-white/70">NEXT_PUBLIC_ENABLE_HOTELS</code> /{" "}
          <code className="text-white/70">NEXT_PUBLIC_ENABLE_EXPERIENCES=true</code>. See{" "}
          <a href="/admin/reports" className="text-neon-cyan hover:underline">
            /admin/reports
          </a>
          .
        </p>
      </aside>
    </div>
  );
}
