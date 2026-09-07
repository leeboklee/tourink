import { findBlockedPhrase } from "@/lib/moderation/lexicon";

export type SpamSignals = {
  blockedPhrase: string | null;
  mentionCount: number;
  linkCount: number;
  repeatedChars: boolean;
  identicalFloodRisk: boolean;
  score: number;
  reasons: string[];
};

const URL_RE = /https?:\/\/|www\./gi;
const MENTION_RE = /@[a-zA-Z0-9._]{2,}/g;
const REPEATED_CHAR_RE = /(.)\1{8,}/;

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s@#./:-]/gu, "")
    .trim();
}

export function countMentions(text: string): number {
  return (text.match(MENTION_RE) ?? []).length;
}

export function countLinks(text: string): number {
  return (text.match(URL_RE) ?? []).length;
}

export function scoreSpam(text: string, opts?: { recentIdentical?: boolean }): SpamSignals {
  const reasons: string[] = [];
  let score = 0;

  const blockedPhrase = findBlockedPhrase(text);
  if (blockedPhrase) {
    score += 0.9;
    reasons.push(`blocked_phrase:${blockedPhrase}`);
  }

  const mentionCount = countMentions(text);
  if (mentionCount >= 5) {
    score += 0.45;
    reasons.push("excessive_mentions");
  } else if (mentionCount >= 3) {
    score += 0.2;
    reasons.push("many_mentions");
  }

  const linkCount = countLinks(text);
  if (linkCount >= 3) {
    score += 0.5;
    reasons.push("excessive_links");
  } else if (linkCount >= 2) {
    score += 0.25;
    reasons.push("many_links");
  }

  const repeatedChars = REPEATED_CHAR_RE.test(text);
  if (repeatedChars) {
    score += 0.3;
    reasons.push("repeated_chars");
  }

  const identicalFloodRisk = Boolean(opts?.recentIdentical);
  if (identicalFloodRisk) {
    score += 0.55;
    reasons.push("identical_repeat");
  }

  const trimmed = text.trim();
  if (trimmed.length > 0 && trimmed.length < 8 && linkCount > 0) {
    score += 0.2;
    reasons.push("short_link_bait");
  }

  return {
    blockedPhrase,
    mentionCount,
    linkCount,
    repeatedChars,
    identicalFloodRisk,
    score: Math.min(1, score),
    reasons
  };
}

export const SPAM_HARD_REJECT = 0.85;
export const SPAM_SHADOW_HIDE = 0.55;

export function shouldRejectSpam(score: number): boolean {
  return score >= SPAM_HARD_REJECT;
}

export function shouldShadowHide(score: number): boolean {
  return score >= SPAM_SHADOW_HIDE && score < SPAM_HARD_REJECT;
}
