"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminResourceKey, FieldDef } from "@/lib/admin-config";
import { RESOURCE_FIELDS, normalizeItemForForm } from "@/lib/admin-config";

export function AdminResourceForm({
  resource,
  label,
  id,
  item
}: {
  resource: AdminResourceKey;
  label: string;
  id?: string;
  item: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const fields = RESOURCE_FIELDS[resource];
  const [form, setForm] = useState(() => normalizeItemForForm(resource, item));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(form)) {
      if (v && typeof v === "object" && !Array.isArray(v)) continue;
      payload[k] = v;
    }

    const url = id ? `/api/admin/${resource}/${id}` : `/api/admin/${resource}`;
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    router.push(`/admin/${resource}`);
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-neon-amber">{label}</p>
          <h1 className="font-display text-3xl text-paper">{id ? "Edit" : "Create"}</h1>
        </div>
        <Link href={`/admin/${resource}`} className="text-sm text-neon-cyan hover:underline">
          ← Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => (
          <FieldInput key={field.key} field={field} value={form[field.key]} onChange={setField} />
        ))}

        {error ? <p className="text-sm text-neon-pink">{error}</p> : null}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-neon-pink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <Link
            href={`/admin/${resource}`}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange
}: {
  field: FieldDef;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const common =
    "w-full rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2.5 text-sm outline-none ring-neon-cyan/40 focus:ring-2";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="size-4 rounded border-white/20 bg-ink-900 accent-neon-cyan"
        />
        <span className="text-white/80">{field.label}</span>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">{field.label}</span>
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={common}
        />
        {field.hint ? <span className="text-xs text-white/35">{field.hint}</span> : null}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="block space-y-1.5 text-sm">
        <span className="text-white/70">{field.label}</span>
        <select
          value={String(value ?? field.options?.[0] ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={common}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-white/70">{field.label}</span>
      <input
        type={field.type === "number" ? "number" : "text"}
        step={field.type === "number" ? "any" : undefined}
        value={value == null ? "" : String(value)}
        onChange={(e) =>
          onChange(
            field.key,
            field.type === "number" ? e.target.valueAsNumber || Number(e.target.value) : e.target.value
          )
        }
        className={common}
      />
      {field.hint ? <span className="text-xs text-white/35">{field.hint}</span> : null}
    </label>
  );
}
