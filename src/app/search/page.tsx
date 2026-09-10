"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { communityPosts, feedPosts, forumThreads, nightlife, profiles } from "@/data/mock";
import { SectionHero } from "@/components/ui";

type Tab = "all" | "people" | "posts" | "places" | "threads";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    const people = profiles.filter(
      (p) =>
        !query ||
        p.handle.includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.bio.toLowerCase().includes(query)
    );
    const posts = feedPosts.filter(
      (p) =>
        !query ||
        p.caption.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.author.includes(query)
    );
    const places = nightlife.filter(
      (n) =>
        !query ||
        n.name.toLowerCase().includes(query) ||
        n.area.toLowerCase().includes(query) ||
        n.city.toLowerCase().includes(query) ||
        n.vibe.toLowerCase().includes(query)
    );
    const threads = [
      ...forumThreads.filter(
        (t) =>
          !query ||
          t.title.toLowerCase().includes(query) ||
          t.body.toLowerCase().includes(query) ||
          t.board.toLowerCase().includes(query)
      ),
      ...communityPosts.filter(
        (c) =>
          !query ||
          c.title.toLowerCase().includes(query) ||
          c.body.toLowerCase().includes(query) ||
          c.tags.some((t) => t.includes(query))
      )
    ];
    return { people, posts, places, threads };
  }, [query]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "people", label: "People" },
    { id: "posts", label: "Posts" },
    { id: "places", label: "Places" },
    { id: "threads", label: "Threads" }
  ];

  const show = (id: Tab) => tab === "all" || tab === id;

  return (
    <div>
      <SectionHero
        eyebrow="Discover"
        title="Search"
        subtitle="Find guides, posts, nightlife, and forum threads across Korea."
      />
      <div className="space-y-4 px-4 pb-8 lg:px-0">
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5">
          <Search size={18} className="text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Seoul, hangouts, eSIM, Haeundae…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
          />
        </label>

        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "shrink-0 rounded-full bg-neon-cyan/20 px-3 py-1.5 text-xs font-semibold text-neon-cyan"
                  : "shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55"
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {show("people") ? (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white/70">People</h2>
            {results.people.slice(0, tab === "all" ? 4 : 20).map((p) => (
              <Link
                key={p.handle}
                href={`/u/${p.handle}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 hover:border-neon-cyan/40"
              >
                <Image src={p.avatar} alt={p.handle} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">@{p.handle}</p>
                  <p className="truncate text-xs text-white/45">
                    {p.name} · {p.city}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {show("posts") ? (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white/70">Posts</h2>
            {results.posts.slice(0, tab === "all" ? 4 : 20).map((p) => (
              <Link
                key={p.id}
                href={`/post/${p.id}`}
                className="flex gap-3 rounded-xl border border-white/10 bg-ink-900/40 p-2 hover:border-neon-cyan/40"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image src={p.image} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/45">@{p.author}</p>
                  <p className="line-clamp-2 text-sm">{p.caption}</p>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {show("places") ? (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white/70">Places</h2>
            {results.places.slice(0, tab === "all" ? 4 : 20).map((n) => (
              <Link
                key={n.id}
                href={`/nightlife/${n.id}`}
                className="block rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 hover:border-neon-cyan/40"
              >
                <p className="text-sm font-semibold">{n.name}</p>
                <p className="text-xs text-white/45">
                  {n.area}, {n.city} · {n.vibe}
                </p>
              </Link>
            ))}
          </section>
        ) : null}

        {show("threads") ? (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white/70">Threads</h2>
            {results.threads.slice(0, tab === "all" ? 4 : 20).map((t) => {
              const isForum = "board" in t;
              return (
                <Link
                  key={t.id}
                  href={isForum ? `/forum/${t.id}` : "/community"}
                  className="block rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 hover:border-neon-cyan/40"
                >
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="line-clamp-2 text-xs text-white/50">{"body" in t ? t.body : ""}</p>
                </Link>
              );
            })}
          </section>
        ) : null}
      </div>
    </div>
  );
}
