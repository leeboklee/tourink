import { prisma } from "@/lib/db";
import {
  rankFeedPosts,
  estimatePublishedAt,
  type RankContext,
  type RankablePost
} from "@/lib/feed/ranking";
import type { FeedPost } from "@/data/mock";
import { parseJsonArray } from "@/lib/json";

export type RankedFeedPost = FeedPost & {
  authorId: string;
  rankScore?: number;
};

export async function getRankedFeed(opts?: {
  viewerId?: string | null;
  includeShadowHidden?: boolean;
  limit?: number;
}): Promise<RankedFeedPost[]> {
  const viewerId = opts?.viewerId ?? null;

  const [rows, follows, blocks] = await Promise.all([
    prisma.feedPost.findMany({
      where: { active: true },
      include: {
        author: true,
        _count: { select: { savedBy: true } }
      }
    }),
    viewerId
      ? prisma.follow.findMany({
          where: { followerId: viewerId },
          select: { followingId: true }
        })
      : Promise.resolve([] as { followingId: string }[]),
    viewerId
      ? prisma.userBlock.findMany({
          where: { blockerId: viewerId },
          select: { blockedId: true }
        })
      : Promise.resolve([] as { blockedId: string }[])
  ]);

  const blockedIds = new Set(blocks.map((b) => b.blockedId));
  const followingIds = new Set(follows.map((f) => f.followingId));

  const candidates: (RankablePost & {
    location: string;
    image: string;
    caption: string;
    tags: string[];
    createdAt: string;
    avatar: string;
  })[] = rows
    .filter((p) => !blockedIds.has(p.authorId))
    .map((p) => ({
      id: p.id,
      authorId: p.authorId,
      authorHandle: p.author.handle,
      isOfficialAi: p.author.isOfficialAi,
      likes: p.likes,
      comments: p.comments,
      saves: p._count.savedBy,
      spamScore: p.spamScore,
      shadowHidden: p.shadowHidden,
      publishedAt: p.publishedAt ?? estimatePublishedAt(p.createdAt),
      location: p.location,
      image: p.image,
      caption: p.caption,
      tags: parseJsonArray(p.tagsJson),
      createdAt: p.createdAt,
      avatar: p.author.image ?? ""
    }));

  const ctx: RankContext = { viewerId, followingIds };
  const ranked = rankFeedPosts(candidates, ctx, {
    includeShadowHidden: opts?.includeShadowHidden
  });

  const limit = opts?.limit ?? 50;
  return ranked.slice(0, limit).map((p) => ({
    id: p.id,
    author: p.authorHandle,
    authorId: p.authorId,
    avatar: p.avatar,
    location: p.location,
    image: p.image,
    caption: p.caption,
    likes: p.likes,
    comments: p.comments,
    tags: p.tags,
    createdAt: p.createdAt,
    rankScore: p.rankScore
  }));
}

export { rankFeedPosts, scorePost, diversifyByAuthor, estimatePublishedAt } from "@/lib/feed/ranking";
