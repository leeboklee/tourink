"use client";

import {
  SaveBar,
  SettingsField,
  SettingsShell,
  inputClass,
  useSettingsProfile
} from "@/components/settings/SettingsShared";

export default function SocialSettingsPage() {
  const { profile, setProfile, loading, saving, saved, error, save } = useSettingsProfile();

  if (loading || !profile) {
    return (
      <SettingsShell title="Social links">
        <p className="text-sm text-white/45">{error ?? "Loading…"}</p>
      </SettingsShell>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save({
      instagramUrl: profile!.instagramUrl ?? "",
      facebookUrl: profile!.facebookUrl ?? "",
      threadsUrl: profile!.threadsUrl ?? "",
      tiktokUrl: profile!.tiktokUrl ?? "",
      youtubeUrl: profile!.youtubeUrl ?? ""
    });
  }

  return (
    <SettingsShell title="Social links">
      <p className="mb-4 text-sm text-white/45">
        Add Instagram, Facebook, and other profiles shown on your About tab.
      </p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        {(
          [
            ["instagramUrl", "Instagram"],
            ["facebookUrl", "Facebook"],
            ["threadsUrl", "Threads"],
            ["tiktokUrl", "TikTok"],
            ["youtubeUrl", "YouTube"]
          ] as const
        ).map(([key, label]) => (
          <SettingsField key={key} label={label} hint="Full URL preferred">
            <input
              className={inputClass}
              value={profile[key] ?? ""}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              placeholder={`https://…`}
            />
          </SettingsField>
        ))}
        <SaveBar saving={saving} saved={saved} error={error} label="Save social links" />
      </form>
    </SettingsShell>
  );
}
