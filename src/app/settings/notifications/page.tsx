"use client";

import {
  SaveBar,
  SettingsShell,
  useSettingsProfile
} from "@/components/settings/SettingsShared";

const TOGGLES = [
  ["notifyLikes", "Likes", "When someone likes your posts"],
  ["notifyComments", "Comments", "Replies and comments on your content"],
  ["notifyFollows", "New followers", "When someone follows you"],
  ["notifyMessages", "Messages", "Direct messages and hangout invites"]
] as const;

export default function NotificationSettingsPage() {
  const { profile, setProfile, loading, saving, saved, error, save } = useSettingsProfile();

  if (loading || !profile) {
    return (
      <SettingsShell title="Notifications">
        <p className="text-sm text-white/45">{error ?? "Loading…"}</p>
      </SettingsShell>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save({
      notifyLikes: profile!.notifyLikes !== false,
      notifyComments: profile!.notifyComments !== false,
      notifyFollows: profile!.notifyFollows !== false,
      notifyMessages: profile!.notifyMessages !== false
    });
  }

  return (
    <SettingsShell title="Notifications">
      <p className="mb-4 text-sm text-white/45">Preference stubs — stored on your account for later wire-up.</p>
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        {TOGGLES.map(([key, title, desc]) => (
          <label
            key={key}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink-950/40 px-3 py-3"
          >
            <span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-0.5 block text-xs text-white/40">{desc}</span>
            </span>
            <input
              type="checkbox"
              checked={profile[key] !== false}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })}
              className="h-5 w-5 accent-neon-cyan"
            />
          </label>
        ))}
        <SaveBar saving={saving} saved={saved} error={error} label="Save notifications" />
      </form>
    </SettingsShell>
  );
}
