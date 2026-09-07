/**
 * Basic abuse / spam lexicon (EN + common KR).
 * Inspired by open blocklist patterns — see docs/MODERATION.md.
 */

const EN_ABUSE = [
  "kill yourself",
  "kys",
  "nigger",
  "faggot",
  "retard",
  "rape you",
  "child porn",
  "csam"
];

const KR_ABUSE = [
  "시발",
  "씨발",
  "병신",
  "꺼져",
  "죽어라",
  "지랄",
  "개새끼",
  "씹",
  "장애년",
  "창녀"
];

const SPAM_PHRASES = [
  "crypto giveaway",
  "free nft",
  "dm for promo",
  "click my bio",
  "make money fast",
  "telegram.me",
  "t.me/",
  "bit.ly/",
  "whatsapp me",
  "카톡 추가",
  "돈 벌기",
  "무료 코인",
  "수익 보장"
];

export const BLOCKED_PHRASES = [...EN_ABUSE, ...KR_ABUSE, ...SPAM_PHRASES].map((p) =>
  p.toLowerCase()
);

export function findBlockedPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of BLOCKED_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}
