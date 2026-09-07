"use client";

import { useState } from "react";
import { Flag, UserX, X } from "lucide-react";

const REASONS = [
  { id: "spam", label: "Spam or scam" },
  { id: "abuse", label: "Abuse or hate" },
  { id: "harassment", label: "Harassment" },
  { id: "sexual", label: "Sexual content" },
  { id: "pii", label: "Personal data leak" },
  { id: "other", label: "Other" }
] as const;

export function ReportBlockMenu({
  authorHandle,
  postId
}: {
  authorHandle: string;
  postId: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "report" | "done">("menu");
  const [reason, setReason] = useState<(typeof REASONS)[number]["id"]>("spam");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setMode("menu");
    setMessage(null);
  }

  async function submitReport() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "post",
          targetId: postId,
          reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report failed");
      setMode("done");
      setMessage("Thanks — our team will review this.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not report");
    } finally {
      setBusy(false);
    }
  }

  async function blockUser() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: authorHandle })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Block failed");
      setMode("done");
      setMessage(`Blocked @${authorHandle}. Their posts leave your feed.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not block");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="More options"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md px-2 py-1 text-xs text-white/45 hover:bg-white/5 hover:text-paper"
      >
        ···
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-white/10 bg-ink-950 p-2 shadow-xl">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wide text-white/40">Safety</span>
            <button type="button" onClick={close} className="text-white/40 hover:text-paper" aria-label="Close">
              <X size={14} />
            </button>
          </div>

          {mode === "menu" ? (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setMode("report")}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-white/80 hover:bg-white/5"
              >
                <Flag size={14} /> Report post
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={blockUser}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-neon-pink hover:bg-neon-pink/10"
              >
                <UserX size={14} /> Block @{authorHandle}
              </button>
            </div>
          ) : null}

          {mode === "report" ? (
            <div className="space-y-2 px-1 py-1">
              <p className="text-xs text-white/50">Why are you reporting this?</p>
              <div className="space-y-1">
                {REASONS.map((r) => (
                  <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                    <input
                      type="radio"
                      name="reason"
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={submitReport}
                className="w-full rounded-lg bg-neon-pink/90 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Submit report
              </button>
            </div>
          ) : null}

          {mode === "done" ? (
            <p className="px-2 py-2 text-xs text-white/70">{message}</p>
          ) : null}

          {message && mode !== "done" ? (
            <p className="mt-1 px-2 text-[11px] text-neon-pink">{message}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
