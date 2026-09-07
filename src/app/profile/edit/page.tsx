"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CURRENT_USER_HANDLE } from "@/data/mock";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [handle, setHandle] = useState(CURRENT_USER_HANDLE);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile?handle=${encodeURIComponent(CURRENT_USER_HANDLE)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setHandle(d.profile.handle);
          setName(d.profile.name);
          setBio(d.profile.bio);
          setCity(d.profile.city);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/profile/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, city })
    });
    if (!res.ok) {
      setError("Could not save profile");
      return;
    }
    setSaved(true);
    setTimeout(() => router.push("/profile"), 800);
  }

  if (loading) {
    return <p className="px-4 pt-8 text-sm text-white/45 lg:px-0">Loading profile…</p>;
  }

  return (
    <div className="px-4 pb-10 pt-6 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit profile</h1>
        <Link href="/profile" className="text-sm text-white/50 hover:text-neon-cyan">
          Cancel
        </Link>
      </div>
      <p className="mb-4 text-sm text-white/50">Updates persist to the Tourink database for @{handle}.</p>
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
        {error ? <p className="text-sm text-neon-pink">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
        >
          {saved ? "Saved · returning…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
