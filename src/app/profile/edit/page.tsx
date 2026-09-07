"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENT_USER_HANDLE, getCurrentProfile } from "@/data/mock";

export default function EditProfilePage() {
  const router = useRouter();
  const profile = getCurrentProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [saved, setSaved] = useState(false);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/profile"), 800);
  }

  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit profile</h1>
        <Link href="/profile" className="text-sm text-white/50 hover:text-neon-cyan">
          Cancel
        </Link>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Demo edit for @{CURRENT_USER_HANDLE} — changes are not persisted.
      </p>
      <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">Display name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/55">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
        >
          {saved ? "Saved · returning…" : "Save (mock)"}
        </button>
      </form>
    </div>
  );
}
