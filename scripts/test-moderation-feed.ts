/**
 * Smoke tests for spam filter + feed ranking (no DB required for core asserts).
 * Run: npx tsx scripts/test-moderation-feed.ts
 */
import assert from "node:assert/strict";
import {
  scoreSpam,
  shouldRejectSpam,
  shouldShadowHide,
  normalizeText
} from "../src/lib/moderation/spam";
import { checkRateLimit, __resetRateLimitsForTests } from "../src/lib/moderation/rate-limit";
import { moderateTextClient } from "../src/lib/moderation/client";
import { sanitizeUserText } from "../src/lib/security/sanitize";
import { findPii, redactPii } from "../src/lib/security/pii";
import { isAllowedUploadUrl } from "../src/lib/security/upload-allowlist";
import { rankFeedPosts, scorePost } from "../src/lib/feed/ranking";

let failed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok  - ${name}`);
  } catch (e) {
    failed += 1;
    console.error(`FAIL - ${name}`);
    console.error(e);
  }
}

check("blocks abuse lexicon", () => {
  const s = scoreSpam("you should kill yourself");
  assert.ok(s.blockedPhrase);
  assert.ok(shouldRejectSpam(s.score) || s.score >= 0.85);
});

check("blocks KR abuse", () => {
  const s = scoreSpam("진짜 씨발 뭐야");
  assert.ok(s.blockedPhrase);
});

check("flags excessive links + mentions", () => {
  const s = scoreSpam("hi @alice @bobbie @carla @diana @eddie see https://a.com https://b.com https://c.com");
  assert.ok(s.score >= 0.55);
  assert.ok(shouldShadowHide(s.score) || shouldRejectSpam(s.score));
});

check("identical normalize", () => {
  assert.equal(normalizeText("Hello   WORLD!!"), normalizeText("hello world"));
});

check("rate limit trips", () => {
  __resetRateLimitsForTests();
  for (let i = 0; i < 5; i++) {
    assert.equal(checkRateLimit("t:user", 5, 60_000).allowed, true);
  }
  assert.equal(checkRateLimit("t:user", 5, 60_000).allowed, false);
});

check("client rejects PII", () => {
  const r = moderateTextClient("Call me at 010-1234-5678 please");
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.startsWith("pii:")));
});

check("sanitize strips script", () => {
  const out = sanitizeUserText('<script>alert(1)</script>Nice trek');
  assert.ok(!out.toLowerCase().includes("script"));
  assert.ok(out.includes("Nice trek"));
});

check("redact email", () => {
  assert.ok(findPii("mail me at a@b.co").length >= 1);
  assert.match(redactPii("mail me at a@b.co"), /redacted/);
});

check("upload allowlist", () => {
  assert.equal(
    isAllowedUploadUrl("https://images.unsplash.com/photo-1"),
    true
  );
  assert.equal(isAllowedUploadUrl("https://evil.example/x.png"), false);
  assert.equal(isAllowedUploadUrl("http://images.unsplash.com/x"), false);
});

check("ranking prefers followed + recent over spam", () => {
  const now = new Date();
  const posts = [
    {
      id: "spam",
      authorId: "u1",
      authorHandle: "spammer",
      isOfficialAi: false,
      likes: 999,
      comments: 0,
      saves: 0,
      spamScore: 0.8,
      shadowHidden: true,
      publishedAt: now
    },
    {
      id: "friend",
      authorId: "u2",
      authorHandle: "friend",
      isOfficialAi: false,
      likes: 3,
      comments: 2,
      saves: 1,
      spamScore: 0,
      shadowHidden: false,
      publishedAt: now
    },
    {
      id: "old",
      authorId: "u3",
      authorHandle: "oldie",
      isOfficialAi: false,
      likes: 50,
      comments: 1,
      saves: 0,
      spamScore: 0,
      shadowHidden: false,
      publishedAt: new Date(now.getTime() - 10 * 24 * 3600_000)
    }
  ];
  const ranked = rankFeedPosts(posts, { followingIds: ["u2"], now });
  assert.ok(!ranked.find((p) => p.id === "spam"));
  assert.equal(ranked[0]?.id, "friend");
  const friendScore = scorePost(posts[1], { followingIds: ["u2"], now });
  assert.ok(friendScore.following > 0);
});

check("clean travel caption passes", () => {
  const r = moderateTextClient("Sunset at Namsan Tower — recommend the cable car!");
  assert.equal(r.ok, true);
});

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log("\nAll moderation/feed smoke tests passed.");
