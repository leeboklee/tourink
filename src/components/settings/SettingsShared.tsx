"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { TravelerProfile } from "@/data/mock";

export function useSettingsProfile() {
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
        else setError(d.error ?? "Could not load settings");
      })
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (patch: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Could not save settings");
        return false;
      }
      if (data.profile) setProfile(data.profile);
      setSaved(true);
      return true;
    } catch {
      setError("Could not save settings");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, setProfile, loading, saving, saved, error, setError, save };
}

export function SettingsShell({
  title,
  children,
  backHref = "/settings"
}: {
  title: string;
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="px-4 pb-12 pt-6 lg:px-0">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl">{title}</h1>
        <Link href={backHref} className="text-sm text-white/50 hover:text-neon-cyan">
          Back
        </Link>
      </div>
      {children}
    </div>
  );
}

export function SettingsField({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-white/55">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-white/35">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2";

export const selectClass = inputClass;

export function SaveBar({
  saving,
  saved,
  error,
  label = "Save"
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
  label?: string;
}) {
  return (
    <div className="space-y-2 pt-2">
      {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
      {saved ? <p className="text-sm text-neon-cyan">Saved — preferences persist across refresh.</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl border border-neon-cyan/40 bg-neon-cyan/15 px-4 py-3 text-sm font-semibold text-neon-cyan transition hover:bg-neon-cyan/25 disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved" : label}
      </button>
    </div>
  );
}

export const AUDIENCE_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "followers", label: "Followers" },
  { value: "off", label: "Off" }
] as const;
