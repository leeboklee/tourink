import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/json";
import { isExperiencesEnabled, isHotelsEnabled } from "@/lib/feature-flags";
import type {
  Comment,
  CommunityPost,
  Experience,
  FeedPost,
  ForumReply,
  ForumThread,
  Hotel,
  Meetup,
  NightlifeSpot,
  PlaceReview,
  ReelPost,
  RoutePlan,
  ThreadPost,
  TravelerProfile
} from "@/data/mock";

type UserRow = {
  handle: string;
  name: string;
  image: string | null;
  bio: string;
  city: string;
  followers: number;
  following: number;
  postsCount: number;
  isLocal: boolean;
  isOfficialAi: boolean;
  persona: string | null;
  website: string | null;
  joinedAt: string | null;
};

export function mapProfile(u: UserRow): TravelerProfile {
  return {
    handle: u.handle,
    name: u.name,
    avatar: u.image ?? "",
    bio: u.bio,
    city: u.city,
    followers: u.followers,
    following: u.following,
    posts: u.postsCount,
    isLocal: u.isLocal || undefined,
    isOfficialAi: u.isOfficialAi || undefined,
    persona: u.persona ?? undefined,
    website: u.website ?? undefined,
    joinedAt: u.joinedAt ?? undefined
  };
}

export async function dbGetProfile(handle: string) {
  const u = await prisma.user.findUnique({ where: { handle } });
  return u ? mapProfile(u) : null;
}

export async function dbGetOfficialAiProfiles() {
  const rows = await prisma.user.findMany({
    where: { isOfficialAi: true },
    orderBy: { handle: "asc" }
  });
  return rows.map(mapProfile);
}

export async function dbListFeedPosts(): Promise<FeedPost[]> {
  const rows = await prisma.feedPost.findMany({
    where: { active: true, shadowHidden: false },
    include: { author: true },
    orderBy: { publishedAt: "desc" }
  });
  return rows.map((p) => ({
    id: p.id,
    author: p.author.handle,
    avatar: p.author.image ?? "",
    location: p.location,
    image: p.image,
    caption: p.caption,
    likes: p.likes,
    comments: p.comments,
    tags: parseJsonArray(p.tagsJson),
    createdAt: p.createdAt
  }));
}

export async function dbGetFeedPost(id: string): Promise<FeedPost | null> {
  const p = await prisma.feedPost.findUnique({
    where: { id },
    include: { author: true }
  });
  if (!p) return null;
  return {
    id: p.id,
    author: p.author.handle,
    avatar: p.author.image ?? "",
    location: p.location,
    image: p.image,
    caption: p.caption,
    likes: p.likes,
    comments: p.comments,
    tags: parseJsonArray(p.tagsJson),
    createdAt: p.createdAt
  };
}

export async function dbGetCommentsForPost(postId: string): Promise<Comment[]> {
  const rows = await prisma.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: "asc" }
  });
  return rows.map((c) => ({
    id: c.id,
    postId: c.postId,
    author: c.author.handle,
    avatar: c.author.image ?? "",
    body: c.body,
    likes: c.likes,
    createdAt: c.createdAt,
    isLocal: c.isLocal || undefined
  }));
}

export async function dbGetPostsByAuthor(handle: string): Promise<FeedPost[]> {
  const all = await dbListFeedPosts();
  return all.filter((p) => p.author === handle);
}

export async function dbGetPostsByTag(tag: string): Promise<FeedPost[]> {
  const t = tag.toLowerCase();
  const all = await dbListFeedPosts();
  return all.filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}

export async function dbGetPostsByLocation(location: string): Promise<FeedPost[]> {
  const q = decodeURIComponent(location).toLowerCase();
  const all = await dbListFeedPosts();
  return all.filter((p) => p.location.toLowerCase().includes(q));
}

export async function dbGetThreadsByAuthor(handle: string): Promise<ThreadPost[]> {
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) return [];
  const rows = await prisma.threadPost.findMany({
    where: { authorId: user.id, active: true }
  });
  return rows.map((t) => ({
    id: t.id,
    author: handle,
    avatar: user.image ?? "",
    body: t.body,
    likes: t.likes,
    replies: t.replies,
    createdAt: t.createdAt,
    tags: parseJsonArray(t.tagsJson)
  }));
}

export async function dbGetReelsByAuthor(handle: string): Promise<ReelPost[]> {
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) return [];
  const rows = await prisma.reelPost.findMany({
    where: { authorId: user.id, active: true }
  });
  return rows.map((r) => ({
    id: r.id,
    author: handle,
    avatar: user.image ?? "",
    cover: r.cover,
    caption: r.caption,
    views: r.views,
    likes: r.likes,
    createdAt: r.createdAt,
    location: r.location ?? undefined
  }));
}

export async function dbListReels(): Promise<ReelPost[]> {
  const rows = await prisma.reelPost.findMany({
    where: { active: true },
    include: { author: true }
  });
  return rows.map((r) => ({
    id: r.id,
    author: r.author.handle,
    avatar: r.author.image ?? "",
    cover: r.cover,
    caption: r.caption,
    views: r.views,
    likes: r.likes,
    createdAt: r.createdAt,
    location: r.location ?? undefined
  }));
}

export async function dbGetSavedPostsForUser(handle: string): Promise<FeedPost[]> {
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) return [];
  const saved = await prisma.savedPost.findMany({
    where: { userId: user.id },
    include: { post: { include: { author: true } } }
  });
  return saved.map((s) => ({
    id: s.post.id,
    author: s.post.author.handle,
    avatar: s.post.author.image ?? "",
    location: s.post.location,
    image: s.post.image,
    caption: s.post.caption,
    likes: s.post.likes,
    comments: s.post.comments,
    tags: parseJsonArray(s.post.tagsJson),
    createdAt: s.post.createdAt
  }));
}

export async function dbListHotels(): Promise<Hotel[]> {
  const rows = await prisma.hotel.findMany({ where: { active: true } });
  return rows.map((h) => ({
    id: h.id,
    name: h.name,
    city: h.city,
    area: h.area,
    priceFrom: h.priceFrom,
    currency: h.currency,
    rating: h.rating,
    image: h.image,
    amenities: parseJsonArray(h.amenitiesJson),
    description: h.description
  }));
}

export async function dbGetHotel(id: string) {
  const list = await dbListHotels();
  return list.find((h) => h.id === id) ?? null;
}

export async function dbListExperiences(): Promise<Experience[]> {
  const rows = await prisma.experience.findMany({ where: { active: true } });
  return rows.map((e) => ({
    id: e.id,
    title: e.title,
    city: e.city,
    price: e.price,
    currency: e.currency,
    duration: e.duration,
    rating: e.rating,
    reviews: e.reviews,
    image: e.image,
    category: e.category,
    description: e.description
  }));
}

export async function dbGetExperience(id: string) {
  const list = await dbListExperiences();
  return list.find((e) => e.id === id) ?? null;
}

export async function dbListRoutes(): Promise<RoutePlan[]> {
  const rows = await prisma.routePlan.findMany({ where: { active: true } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    days: r.days,
    cities: parseJsonArray(r.citiesJson),
    image: r.image,
    highlights: parseJsonArray(r.highlightsJson),
    summary: r.summary
  }));
}

export async function dbListNightlife(): Promise<NightlifeSpot[]> {
  const rows = await prisma.nightlifeSpot.findMany({ where: { active: true } });
  return rows.map((n) => ({
    id: n.id,
    name: n.name,
    type: n.type as NightlifeSpot["type"],
    area: n.area,
    city: n.city,
    vibe: n.vibe,
    image: n.image,
    cover: n.cover ?? undefined,
    openUntil: n.openUntil,
    rating: n.rating,
    reviewCount: n.reviewCount
  }));
}

export async function dbGetReviewsForPlace(placeId: string): Promise<PlaceReview[]> {
  const rows = await prisma.placeReview.findMany({
    where: { placeId },
    include: { author: true }
  });
  return rows.map((r) => ({
    id: r.id,
    placeId: r.placeId,
    placeType: r.placeType as PlaceReview["placeType"],
    author: r.author.handle,
    rating: r.rating,
    body: r.body,
    tags: parseJsonArray(r.tagsJson),
    createdAt: r.createdAt
  }));
}

export async function dbListCommunity(): Promise<CommunityPost[]> {
  const rows = await prisma.communityPost.findMany({
    where: { active: true },
    include: { author: true }
  });
  return rows.map((c) => ({
    id: c.id,
    author: c.author.handle,
    title: c.title,
    body: c.body,
    tags: parseJsonArray(c.tagsJson),
    replies: c.replies,
    createdAt: c.createdAt,
    kind: c.kind as CommunityPost["kind"]
  }));
}

export async function dbGetCommunityByAuthor(handle: string) {
  const all = await dbListCommunity();
  return all.filter((c) => c.author === handle);
}

export async function dbListForumThreads(): Promise<ForumThread[]> {
  const rows = await prisma.forumThread.findMany({
    where: { active: true },
    include: { author: true }
  });
  return rows.map((t) => ({
    id: t.id,
    board: t.board,
    title: t.title,
    author: t.author.handle,
    replies: t.replies,
    views: t.views,
    pinned: t.pinned || undefined,
    createdAt: t.createdAt,
    body: t.body
  }));
}

export async function dbGetForumReplies(threadId: string): Promise<ForumReply[]> {
  const rows = await prisma.forumReply.findMany({
    where: { threadId },
    include: { author: true }
  });
  return rows.map((r) => ({
    id: r.id,
    threadId: r.threadId,
    author: r.author.handle,
    body: r.body,
    likes: r.likes,
    createdAt: r.createdAt,
    isLocal: r.isLocal || undefined,
    accepted: r.accepted || undefined
  }));
}

export async function dbListMeetups(): Promise<Meetup[]> {
  const rows = await prisma.meetup.findMany({
    where: { active: true },
    include: { host: true }
  });
  return rows.map((m) => ({
    id: m.id,
    title: m.title,
    host: m.host.handle,
    city: m.city,
    area: m.area,
    when: m.whenLabel,
    spots: m.spots,
    going: m.going,
    tags: parseJsonArray(m.tagsJson),
    description: m.description
  }));
}

export async function dbGetHangoutsByHost(handle: string) {
  const all = await dbListMeetups();
  return all.filter((m) => m.host === handle);
}

export async function dbSearch(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) {
    return { users: [], posts: [], places: [] as { type: string; id: string; title: string; href: string }[] };
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { handle: { contains: query } },
        { name: { contains: query } },
        { city: { contains: query } },
        { bio: { contains: query } }
      ]
    },
    take: 12
  });

  const posts = (await dbListFeedPosts())
    .filter(
      (p) =>
        p.caption.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.author.toLowerCase().includes(query)
    )
    .slice(0, 12);

  const hotels = (await dbListHotels())
    .filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.city.toLowerCase().includes(query) ||
        h.area.toLowerCase().includes(query)
    )
    .map((h) => ({ type: "hotel", id: h.id, title: h.name, href: `/hotel/${h.id}` }));

  const experiences = (await dbListExperiences())
    .filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.city.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
    )
    .map((e) => ({ type: "experience", id: e.id, title: e.title, href: `/experience/${e.id}` }));

  const nightlife = (await dbListNightlife())
    .filter(
      (n) =>
        n.name.toLowerCase().includes(query) ||
        n.area.toLowerCase().includes(query) ||
        n.city.toLowerCase().includes(query)
    )
    .map((n) => ({ type: "nightlife", id: n.id, title: n.name, href: `/nightlife/${n.id}` }));

  const places = [
    ...(isHotelsEnabled() ? hotels : []),
    ...(isExperiencesEnabled() ? experiences : []),
    ...nightlife
  ].slice(0, 16);

  return {
    users: users.map(mapProfile),
    posts,
    places
  };
}
