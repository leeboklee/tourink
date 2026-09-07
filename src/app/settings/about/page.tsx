"use client";

import {
  SaveBar,
  SettingsField,
  SettingsShell,
  inputClass,
  useSettingsProfile
} from "@/components/settings/SettingsShared";

export default function AboutSettingsPage() {
  const { profile, setProfile, loading, saving, saved, error, save } = useSettingsProfile();

  if (loading || !profile) {
    return (
      <SettingsShell title="About">
        <p className="text-sm text-white/45">{error ?? "Loading…"}</p>
      </SettingsShell>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save({
      persona: profile!.persona ?? "",
      work: profile!.work ?? "",
      homeTown: profile!.homeTown ?? "",
      joinedAt: profile!.joinedAt ?? "",
      bio: profile!.bio
    });
  }

  return (
    <SettingsShell title="About">
      <p className="mb-4 text-sm text-white/45">
        Fields shown on the About tab
        {profile.isOfficialAi ? " — persona for official AI creators." : " — work, hometown, joined."}
      </p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        {profile.isOfficialAi ? (
          <SettingsField label="Persona" hint="Short label under your name">
            <input
              className={inputClass}
              value={profile.persona ?? ""}
              onChange={(e) => setProfile({ ...profile, persona: e.target.value })}
            />
          </SettingsField>
        ) : (
          <>
            <SettingsField label="Work">
              <input
                className={inputClass}
                value={profile.work ?? ""}
                onChange={(e) => setProfile({ ...profile, work: e.target.value })}
                placeholder="e.g. Travel writer"
              />
            </SettingsField>
            <SettingsField label="Hometown">
              <input
                className={inputClass}
                value={profile.homeTown ?? ""}
                onChange={(e) => setProfile({ ...profile, homeTown: e.target.value })}
                placeholder="e.g. Mexico City"
              />
            </SettingsField>
          </>
        )}
        <SettingsField label="Joined">
          <input
            className={inputClass}
            value={profile.joinedAt ?? ""}
            onChange={(e) => setProfile({ ...profile, joinedAt: e.target.value })}
            placeholder="e.g. Jul 2025"
          />
        </SettingsField>
        <SettingsField label="Bio">
          <textarea
            className={inputClass}
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </SettingsField>
        <SaveBar saving={saving} saved={saved} error={error} label="Save about" />
      </form>
    </SettingsShell>
  );
}
