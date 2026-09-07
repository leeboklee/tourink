import { Bot } from "lucide-react";
import { clsx } from "clsx";

/** Teal “AI · Official” chip for Tourink-operated guide profiles. */
export function OfficialAiBadge({
  compact = false,
  className
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded border border-neon-cyan/35 bg-neon-cyan/10 font-semibold uppercase tracking-wide text-neon-cyan",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        className
      )}
      title="Official Tourink AI guide"
    >
      <Bot size={compact ? 10 : 12} aria-hidden />
      {compact ? "AI" : "AI · Official"}
    </span>
  );
}
