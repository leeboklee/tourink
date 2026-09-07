"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminResourceKey } from "@/lib/admin-config";
import { rowTitle } from "@/lib/admin-config";

type Row = Record<string, unknown> & { id: string };

export function AdminResourceList({
  resource,
  label,
  items: initial
}: {
  resource: AdminResourceKey;
  label: string;
  items: Row[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function toggle(id: string, active: boolean) {
    setError(null);
    const res = await fetch(`/api/admin/${resource}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Toggle failed");
      return;
    }
    const data = await res.json();
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, ...data.item } : row)));
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    if (!confirm("Delete this item permanently?")) return;
    setError(null);
    const res = await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Delete failed");
      return;
    }
    setItems((prev) => prev.filter((row) => row.id !== id));
    startTransition(() => router.refresh());
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-paper">{label}</h1>
          <p className="mt-1 text-sm text-white/50">{items.length} rows</p>
        </div>
        <Link
          href={`/admin/${resource}/new`}
          className="rounded-xl bg-neon-cyan/90 px-4 py-2 text-sm font-semibold text-ink-950 hover:brightness-110"
        >
          + New
        </Link>
      </div>

      {error ? <p className="mt-3 text-sm text-neon-pink">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2.5 font-medium">Title</th>
              <th className="px-3 py-2.5 font-medium">Id</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const active = resource === "profiles" ? !!item.isOfficialAi : item.active !== false;
              return (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-3 py-3 font-medium">{rowTitle(resource, item)}</td>
                  <td className="px-3 py-3 font-mono text-xs text-white/40">{item.id}</td>
                  <td className="px-3 py-3">
                    <span className={active ? "text-neon-cyan" : "text-white/35"}>
                      {active ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/${resource}/${item.id}`}
                        className="rounded-lg border border-white/15 px-2.5 py-1 text-xs hover:border-neon-cyan/50"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => toggle(item.id, active)}
                        className="rounded-lg border border-white/15 px-2.5 py-1 text-xs hover:border-neon-amber/50 disabled:opacity-50"
                      >
                        {active ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => remove(item.id)}
                        className="rounded-lg border border-neon-pink/30 px-2.5 py-1 text-xs text-neon-pink hover:bg-neon-pink/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-white/40">
                  No rows yet — create one or re-run seed.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
