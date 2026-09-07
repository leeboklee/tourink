"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string;
  href?: string | null;
  read: boolean;
  createdAt: string;
  actor?: { handle: string; name: string; image: string | null } | null;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setItems(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true })
    });
    load();
  }

  return (
    <div className="px-4 pb-10 pt-4 lg:px-0">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-paper">Notifications</h1>
          <p className="mt-2 text-sm text-white/55">
            Likes, follows, RSVPs, and bookings · {unread} unread
          </p>
        </div>
        <button
          type="button"
          onClick={markAll}
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
        >
          Mark all read
        </button>
      </div>

      {loading ? <p className="mt-8 text-sm text-white/45">Loading…</p> : null}

      <ul className="mt-6 space-y-2">
        {items.map((n) => (
          <li key={n.id}>
            <Link
              href={n.href || "/"}
              onClick={() =>
                fetch("/api/notifications", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: n.id })
                })
              }
              className={`flex gap-3 rounded-xl border px-3 py-3 transition ${
                n.read
                  ? "border-white/10 bg-ink-900/30"
                  : "border-neon-cyan/30 bg-neon-cyan/5"
              }`}
            >
              <Bell size={16} className={n.read ? "mt-1 text-white/35" : "mt-1 text-neon-cyan"} />
              <div>
                <p className="text-sm font-semibold text-paper">{n.title}</p>
                <p className="text-xs text-white/55">{n.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/35">{n.type}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 ? (
        <p className="mt-8 text-sm text-white/45">You&apos;re all caught up.</p>
      ) : null}
    </div>
  );
}
