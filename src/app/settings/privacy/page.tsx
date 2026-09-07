"use client";

import {
  AUDIENCE_OPTIONS,
  SaveBar,
  SettingsField,
  SettingsShell,
  selectClass,
  useSettingsProfile
} from "@/components/settings/SettingsShared";
import type { VisibilityAudience } from "@/data/mock";

export default function PrivacySettingsPage() {
  const { profile, setProfile, loading, saving, saved, error, save } = useSettingsProfile();

  if (loading || !profile) {
    return (
      <SettingsShell title="Privacy">
        <p className="text-sm text-white/45">{error ?? "Loading…"}</p>
      </SettingsShell>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save({
      privateAccount: !!profile!.privateAccount,
      postsVisibility: profile!.postsVisibility ?? "everyone",
      threadsVisibility: profile!.threadsVisibility ?? "everyone",
      reelsVisibility: profile!.reelsVisibility ?? "everyone",
      whoCanMessage: profile!.whoCanMessage ?? "everyone",
      whoCanFollow: profile!.whoCanFollow ?? "everyone"
    });
  }

  function setAudience(key: TravelerVis, value: VisibilityAudience) {
    setProfile({ ...profile!, [key]: value });
  }

  return (
    <SettingsShell title="Privacy">
      <p className="mb-4 text-sm text-white/45">
        Private accounts hide posts, threads, and reels from people who don&apos;t follow you.
      </p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink-950/40 px-3 py-3">
          <span>
            <span className="block text-sm font-medium">Private account</span>
            <span className="mt-0.5 block text-xs text-white/40">
              Only approved followers see your content
            </span>
          </span>
          <input
            type="checkbox"
            checked={!!profile.privateAccount}
            onChange={(e) => setProfile({ ...profile, privateAccount: e.target.checked })}
            className="h-5 w-5 accent-neon-cyan"
          />
        </label>

        <AudienceSelect
          label="Who can see posts"
          value={profile.postsVisibility ?? "everyone"}
          onChange={(v) => setAudience("postsVisibility", v)}
        />
        <AudienceSelect
          label="Who can see threads"
          value={profile.threadsVisibility ?? "everyone"}
          onChange={(v) => setAudience("threadsVisibility", v)}
        />
        <AudienceSelect
          label="Who can see reels"
          value={profile.reelsVisibility ?? "everyone"}
          onChange={(v) => setAudience("reelsVisibility", v)}
        />
        <AudienceSelect
          label="Who can message you"
          value={profile.whoCanMessage ?? "everyone"}
          onChange={(v) => setAudience("whoCanMessage", v)}
        />
        <AudienceSelect
          label="Who can follow you"
          value={profile.whoCanFollow ?? "everyone"}
          onChange={(v) => setAudience("whoCanFollow", v)}
        />

        <SaveBar saving={saving} saved={saved} error={error} label="Save privacy" />
      </form>
    </SettingsShell>
  );
}

type TravelerVis =
  | "postsVisibility"
  | "threadsVisibility"
  | "reelsVisibility"
  | "whoCanMessage"
  | "whoCanFollow";

function AudienceSelect({
  label,
  value,
  onChange
}: {
  label: string;
  value: VisibilityAudience;
  onChange: (v: VisibilityAudience) => void;
}) {
  return (
    <SettingsField label={label}>
      <select
        className={selectClass}
        value={value}
        onChange={(e) => onChange(e.target.value as VisibilityAudience)}
      >
        {AUDIENCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </SettingsField>
  );
}
