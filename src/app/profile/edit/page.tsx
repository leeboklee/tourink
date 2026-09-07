"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SaveBar,
  SettingsField,
  inputClass,
  useSettingsProfile
} from "@/components/settings/SettingsShared";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, setProfile, loading, saving, saved, error, save } = useSettingsProfile();

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const ok = await save({
      name: profile.name,
      bio: profile.bio,
      city: profile.city,
      image: profile.avatar || "",
      website: profile.website ?? ""
    });
    if (ok) setTimeout(() => router.push("/profile"), 700);
  }

  if (loading || !profile) {
    return <p className="px-4 pt-8 text-sm text-white/45 lg:px-0">{error ?? "Loading profile…"}</p>;
  }

  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit profile</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/settings" className="text-white/50 hover:text-neon-cyan">
            Settings
          </Link>
          <Link href="/profile" className="text-white/50 hover:text-neon-cyan">
            Cancel
          </Link>
        </div>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Updates persist for @{profile.handle}. Avatar uses an image URL.
      </p>
      <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <SettingsField label="Avatar URL">
          <input
            className={inputClass}
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
            placeholder="https://…"
          />
        </SettingsField>
        <SettingsField label="Display name">
          <input
            className={inputClass}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
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
        <SettingsField label="Location">
          <input
            className={inputClass}
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          />
        </SettingsField>
        <SettingsField label="Website">
          <input
            className={inputClass}
            value={profile.website ?? ""}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            placeholder="tourink.kr/@you"
          />
        </SettingsField>
        <SaveBar saving={saving} saved={saved} error={error} label={saved ? "Saved · returning…" : "Save profile"} />
      </form>
    </div>
  );
}
