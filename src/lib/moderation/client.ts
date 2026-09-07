/**
 * Browser-safe moderation helpers (no Prisma / Node-only imports).
 */
import { sanitizeUserText } from "@/lib/security/sanitize";
import { findPii } from "@/lib/security/pii";
import { scoreSpam, shouldRejectSpam } from "@/lib/moderation/spam";

export function moderateTextClient(text: string): {
  ok: boolean;
  error?: string;
  reasons: string[];
} {
  const sanitized = sanitizeUserText(text);
  const signals = scoreSpam(sanitized);
  if (shouldRejectSpam(signals.score) || signals.blockedPhrase) {
    return {
      ok: false,
      error: signals.blockedPhrase
        ? "That language is not allowed."
        : "This looks like spam. Edit before posting.",
      reasons: signals.reasons
    };
  }
  const pii = findPii(sanitized);
  if (pii.length) {
    return {
      ok: false,
      error: "Remove phone numbers, emails, or ID numbers before posting.",
      reasons: pii.map((p) => `pii:${p.type}`)
    };
  }
  return { ok: true, reasons: signals.reasons };
}
