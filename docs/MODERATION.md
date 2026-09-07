# Content moderation (Instagram-like)

Tourink filters spam, abuse, and floods on **write** (client + server) and soft-hides low-quality content from the main feed. Staff review reports at `/admin/moderation`.

## What shipped

| Capability | Where |
|---|---|
| Rate limits (posts / comments / reports) | `src/lib/moderation/rate-limit.ts` |
| Abuse + spam lexicon (EN + basic KR) | `src/lib/moderation/lexicon.ts` |
| Repeated text, excess mentions/links | `src/lib/moderation/spam.ts` |
| Unified write gate | `src/lib/moderation/checks.ts` |
| Client pre-check | `src/lib/moderation/client.ts` |
| Report API | `POST /api/reports` |
| Block user API | `POST/DELETE /api/blocks` |
| Admin queue | `/admin/moderation` + `POST /api/admin/moderation` |
| Shadow filter | `FeedPost.shadowHidden` + feed ranking penalty |

## Flows

1. **Compose / comment** → client `moderateTextClient` → server `moderateUserContent` (rate limit, lexicon, identical flood, PII reject, upload host allowlist).
2. **Hard reject** when spam score ≥ 0.85 or blocked phrase hit.
3. **Shadow hide** when 0.55 ≤ score < 0.85 — post persists but drops from main feed ranking.
4. **Report** → persisted `ContentReport`; ≥2 spam/scam reports auto shadow-hide the post.
5. **Block** → `UserBlock`; blocked authors removed from viewer’s ranked feed.
6. **Admin** → dismiss / shadow hide / remove (`active=false`).

## Thresholds

- Posts: 5 / 10 minutes
- Comments: 20 / 10 minutes
- Reports: 10 / hour

## References (open source & public docs)

- Instagram / Meta — [How Instagram feed ranking works](https://about.instagram.com/blog/announcements/shedding-more-light-on-how-instagram-works)
- Mastodon — [moderation tools & filters](https://docs.joinmastodon.org/admin/moderation/)
- Bluesky — [Ozone moderation / labeling](https://docs.bsky.app/docs/advanced-guides/moderation)
- Perspective API (Jigsaw) — [toxicity scoring concepts](https://developers.perspectiveapi.com/s/about-the-api)
- LDNOOBW-style blocklists — community wordlists for basic lexicon seeding
- Discord — [AutoMod rate limits & keyword filters](https://support.discord.com/hc/en-us/articles/4421269019671)

## Related

- Feed ranking: `docs/FEED_ALGORITHM.md`
- Security / PII: `docs/SECURITY.md`
