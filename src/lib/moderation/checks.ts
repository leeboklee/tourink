import { prisma } from "@/lib/db";
import { normalizeText, scoreSpam, shouldRejectSpam, shouldShadowHide } from "@/lib/moderation/spam";
import { checkRateLimit, RATE_LIMITS } from "@/lib/moderation/rate-limit";
import { sanitizeUserText } from "@/lib/security/sanitize";
import { findPii, redactPii } from "@/lib/security/pii";
import { isAllowedUploadUrl } from "@/lib/security/upload-allowlist";

export type ContentKind = "post" | "comment" | "thread";

export type ModerationVerdict = {
  ok: boolean;
  status: number;
  error?: string;
  sanitized: string;
  displayText: string;
  spamScore: number;
  shadowHidden: boolean;
  reasons: string[];
};

async function recentlyPostedIdentical(
  userId: string,
  kind: ContentKind,
  normalized: string
): Promise<boolean> {
  if (!normalized) return false;
  const since = new Date(Date.now() - 30 * 60 * 1000);

  if (kind === "post") {
    const recent = await prisma.feedPost.findMany({
      where: { authorId: userId, publishedAt: { gte: since } },
      select: { caption: true },
      take: 8,
      orderBy: { publishedAt: "desc" }
    });
    return recent.some((r) => normalizeText(r.caption) === normalized);
  }

  if (kind === "comment") {
    const recent = await prisma.comment.findMany({
      where: { authorId: userId },
      select: { body: true },
      take: 12,
      orderBy: { id: "desc" }
    });
    return recent.some((r) => normalizeText(r.body) === normalized);
  }

  const recent = await prisma.threadPost.findMany({
    where: { authorId: userId },
    select: { body: true },
    take: 8,
    orderBy: { id: "desc" }
  });
  return recent.some((r) => normalizeText(r.body) === normalized);
}

export async function moderateUserContent(input: {
  userId: string;
  kind: ContentKind;
  text: string;
  imageUrl?: string;
  rejectPii?: boolean;
}): Promise<ModerationVerdict> {
  const rateKey =
    input.kind === "post"
      ? `post:${input.userId}`
      : input.kind === "comment"
        ? `comment:${input.userId}`
        : `thread:${input.userId}`;
  const limits = input.kind === "comment" ? RATE_LIMITS.comment : RATE_LIMITS.post;
  const rl = checkRateLimit(rateKey, limits.limit, limits.windowMs);
  if (!rl.allowed) {
    return {
      ok: false,
      status: 429,
      error: "Too many posts. Slow down and try again.",
      sanitized: "",
      displayText: "",
      spamScore: 1,
      shadowHidden: true,
      reasons: ["rate_limit"]
    };
  }

  if (input.imageUrl && !isAllowedUploadUrl(input.imageUrl)) {
    return {
      ok: false,
      status: 400,
      error: "Image URL host is not allowed.",
      sanitized: "",
      displayText: "",
      spamScore: 0,
      shadowHidden: false,
      reasons: ["upload_host"]
    };
  }

  const sanitized = sanitizeUserText(input.text);
  if (!sanitized.trim()) {
    return {
      ok: false,
      status: 400,
      error: "Empty content after sanitization.",
      sanitized: "",
      displayText: "",
      spamScore: 0,
      shadowHidden: false,
      reasons: ["empty"]
    };
  }

  const pii = findPii(sanitized);
  if (pii.length && input.rejectPii) {
    return {
      ok: false,
      status: 400,
      error: "Remove personal data (phone, email, passport) before posting.",
      sanitized,
      displayText: redactPii(sanitized),
      spamScore: 0.3,
      shadowHidden: false,
      reasons: pii.map((p) => `pii:${p.type}`)
    };
  }

  const normalized = normalizeText(sanitized);
  const identical = await recentlyPostedIdentical(input.userId, input.kind, normalized);
  const signals = scoreSpam(sanitized, { recentIdentical: identical });

  if (shouldRejectSpam(signals.score) || signals.blockedPhrase) {
    return {
      ok: false,
      status: 400,
      error: signals.blockedPhrase
        ? "Content blocked by community guidelines."
        : "Content looks like spam and was not published.",
      sanitized,
      displayText: redactPii(sanitized),
      spamScore: signals.score,
      shadowHidden: true,
      reasons: signals.reasons
    };
  }

  const displayText = redactPii(sanitized);
  return {
    ok: true,
    status: 200,
    sanitized,
    displayText,
    spamScore: signals.score,
    shadowHidden: shouldShadowHide(signals.score),
    reasons: signals.reasons
  };
}
