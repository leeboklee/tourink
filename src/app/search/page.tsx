"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { FeedPost, TravelerProfile } from "@/data/mock";

type PlaceHit = { type: string; id: string; title: string; href: string };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<TravelerProfile[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [places, setPlaces] = useState<PlaceHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setUsers([]);
        setPosts([]);
        setPlaces([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setUsers(data.users ?? []);
        setPosts(data.posts ?? []);
        setPlaces(data.places ?? []);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="px-4 pb-10 pt-4 lg:px-0">
      <h1 className="font-display text-3xl text-paper">Search</h1>
      <p className="mt-2 text-sm text-white/55">Find travelers, places, and feed posts across Korea.</p>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Seoul, Hongdae, mina.seoul…"
          className="w-full rounded-xl border border-white/10 bg-ink-900/70 py-3 pl-10 pr-3 text-sm outline-none ring-neon-cyan/40 focus:ring-2"
          autoFocus
        />
      </label>

      {loading ? <p className="mt-4 text-sm text-white/45">Searching…</p> : null}

      {!loading && q.trim() && users.length + posts.length + places.length === 0 ? (
        <p className="mt-6 text-sm text-white/45">No matches.</p>
      ) : null}

      {users.length ? (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neon-amber">People</h2>
          <ul className="mt-3 space-y-2">
            {users.map((u) => (
              <li key={u.handle}>
                <Link
                  href={`/u/${u.handle}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 hover:border-neon-cyan/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">@{u.handle}</p>
                    <p className="text-xs text-white/50">
                      {u.name} · {u.city}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {places.length ? (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neon-amber">Places</h2>
          <ul className="mt-3 space-y-2">
            {places.map((p) => (
              <li key={`${p.type}-${p.id}`}>
                <Link
                  href={p.href}
                  className="block rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 text-sm hover:border-neon-cyan/30"
                >
                  <span className="text-white/40">{p.type}</span> · {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {posts.length ? (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neon-amber">Posts</h2>
          <ul className="mt-3 space-y-2">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/post/${p.id}`}
                  className="block rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 hover:border-neon-cyan/30"
                >
                  <p className="text-sm font-medium">@{p.author}</p>
                  <p className="text-xs text-white/55 line-clamp-2">{p.caption}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
