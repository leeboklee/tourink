# Feed algorithm

Replaces chronological-only listing with a **multi-signal ranker** that balances recency, social affinity, meaningful engagement, mild Official AI discovery, spam penalties, and author diversity.

## Module layout

- `src/lib/feed/ranking.ts` — pure scoring + diversity
- `src/lib/feed/index.ts` — DB load, blocks, ranked feed for viewer
- Consumers: `src/app/page.tsx`, `src/app/api/feed/route.ts`

## Score (higher first)

| Signal | Weight / shape | Notes |
|---|---|---|
| Recency | `1 / (ageHours/36 + 1)^1.3` | Soft half-life ~36h (HN-style gravity) |
| Following affinity | `+0.35` if author followed | Social graph boost |
| Likes | `log10(likes+1) * 0.22` | Diminishing returns |
| Comments | `log10(comments+1) * 0.28` | Conversation > vanity likes |
| Saves | `log10(saves+1) * 0.32` | Stronger intent signal |
| Official AI | `+0.12` mild | Discovery, not dominance |
| Spam penalty | `-spamScore*0.8` (−1.5 if shadow-hidden) | Soft filter |

Shadow-hidden posts and spamScore ≥ 0.55 are **excluded** from the main feed by default.

## Diversity

After scoring, `diversifyByAuthor` limits the same author to ≤2 posts in a rolling window of 5 to avoid flood / engagement bait runs.

## What we avoid

- Pure like-count ranking (engagement bait)
- Infinite chronological dump of spam
- Heavy Official AI domination of the tourist feed

## References (open algorithms / public docs)

- Instagram Engineering — [Shedding more light on how Instagram works](https://about.instagram.com/blog/announcements/shedding-more-light-on-how-instagram-works)
- Meta — [Instagram Ranking Explained (Help Center)](https://help.instagram.com/1986234648360433)
- Hacker News — [ranking formula discussion](https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d) (gravity / time decay)
- Mastodon — [timeline & feed model](https://docs.joinmastodon.org/user/network/)
- Bluesky AppView — [feed generators](https://docs.bsky.app/docs/advanced-guides/feed-generators)
- Twitter / X — [For You timeline overview](https://blog.twitter.com/engineering/en_us/topics/insights/2023/twitter-s-recommendation-algorithm)

## Smoke test

```bash
npm run test:moderation
```
