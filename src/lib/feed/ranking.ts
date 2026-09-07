/**
 * Feed ranking heuristics — multi-signal, not engagement-bait-only.
 * See docs/FEED_ALGORITHM.md.
 */

export type RankablePost = {
  id: string;
  authorId: string;
  authorHandle: string;
  isOfficialAi: boolean;
  likes: number;
  comments: number;
  saves: number;
  spamScore: number;
  shadowHidden: boolean;
  publishedAt: Date | string | number;
};

export type RankContext = {
  viewerId?: string | null;
  followingIds?: Set<string> | string[];
  now?: Date;
};

export type RankBreakdown = {
  recency: number;
  following: number;
  likes: number;
  comments: number;
  saves: number;
  officialAi: number;
  spamPenalty: number;
  total: number;
};

const MS_HOUR = 3600_000;
const MS_DAY = 24 * MS_HOUR;

function toDate(v: Date | string | number): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

function followingSet(ctx: RankContext): Set<string> {
  if (!ctx.followingIds) return new Set();
  return ctx.followingIds instanceof Set ? ctx.followingIds : new Set(ctx.followingIds);
}

export function scorePost(post: RankablePost, ctx: RankContext = {}): RankBreakdown {
  const now = ctx.now ?? new Date();
  const published = toDate(post.publishedAt);
  const ageHours = Math.max(0, (now.getTime() - published.getTime()) / MS_HOUR);

  const recency = 1 / Math.pow(ageHours / 36 + 1, 1.3);

  const follows = followingSet(ctx);
  const following = follows.has(post.authorId) ? 0.35 : 0;

  const likes = Math.log10((post.likes ?? 0) + 1) * 0.22;
  const comments = Math.log10((post.comments ?? 0) + 1) * 0.28;
  const saves = Math.log10((post.saves ?? 0) + 1) * 0.32;

  const officialAi = post.isOfficialAi ? 0.12 : 0;

  const spamPenalty = Math.min(1, post.spamScore ?? 0) * 0.8 + (post.shadowHidden ? 1.5 : 0);

  const total = recency + following + likes + comments + saves + officialAi - spamPenalty;

  return { recency, following, likes, comments, saves, officialAi, spamPenalty, total };
}

export function diversifyByAuthor<T extends { authorId: string }>(
  ranked: T[],
  windowSize = 5,
  maxPerWindow = 2
): T[] {
  const out: T[] = [];
  const deferred: T[] = [];

  for (const item of ranked) {
    const window = out.slice(-windowSize + 1);
    const same = window.filter((x) => x.authorId === item.authorId).length;
    if (same >= maxPerWindow) {
      deferred.push(item);
    } else {
      out.push(item);
    }
  }
  return [...out, ...deferred];
}

export function rankFeedPosts<T extends RankablePost>(
  posts: T[],
  ctx: RankContext = {},
  opts?: { includeShadowHidden?: boolean }
): Array<T & { rankScore: number; rankBreakdown: RankBreakdown }> {
  const filtered = opts?.includeShadowHidden
    ? posts
    : posts.filter((p) => !p.shadowHidden && (p.spamScore ?? 0) < 0.55);

  const scored = filtered
    .map((p) => {
      const breakdown = scorePost(p, ctx);
      return { ...p, rankScore: breakdown.total, rankBreakdown: breakdown };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  return diversifyByAuthor(scored);
}

export function estimatePublishedAt(createdAtLabel: string, fallback = new Date()): Date {
  const s = createdAtLabel.toLowerCase().trim();
  if (s === "just now" || s === "now") return fallback;
  const m = s.match(/^(\d+)\s*(m|min|mins|h|hr|hrs|d|day|days|w|week|weeks)\b/);
  if (!m) {
    const asDate = new Date(createdAtLabel);
    if (!Number.isNaN(asDate.getTime())) return asDate;
    return new Date(fallback.getTime() - MS_DAY);
  }
  const n = Number(m[1]);
  const unit = m[2];
  let ms = MS_HOUR;
  if (unit.startsWith("m")) ms = 60_000;
  else if (unit.startsWith("h")) ms = MS_HOUR;
  else if (unit.startsWith("d")) ms = MS_DAY;
  else if (unit.startsWith("w")) ms = 7 * MS_DAY;
  return new Date(fallback.getTime() - n * ms);
}
