export { BLOCKED_PHRASES, findBlockedPhrase } from "@/lib/moderation/lexicon";
export {
  normalizeText,
  scoreSpam,
  shouldRejectSpam,
  shouldShadowHide,
  SPAM_HARD_REJECT,
  SPAM_SHADOW_HIDE,
  type SpamSignals
} from "@/lib/moderation/spam";
export {
  checkRateLimit,
  RATE_LIMITS,
  __resetRateLimitsForTests,
  type RateLimitResult
} from "@/lib/moderation/rate-limit";
export {
  moderateUserContent,
  type ModerationVerdict,
  type ContentKind
} from "@/lib/moderation/checks";
export { moderateTextClient } from "@/lib/moderation/client";
