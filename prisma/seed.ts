/**
 * Seed Tourink catalog + AI official creators + demo traveler.
 * Usage: npx tsx prisma/seed.ts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  comments,
  communityPosts,
  CURRENT_USER_HANDLE,
  experiences,
  feedPosts,
  forumReplies,
  forumThreads,
  hotels,
  meetups,
  nightlife,
  placeReviews,
  profiles,
  reelPosts,
  routes,
  savedPostIds,
  threadPosts
} from "../src/data/mock";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Tourink…");

  // Wipe mutable tables in FK-safe order
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.like.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.placeReview.deleteMany();
  await prisma.meetup.deleteMany();
  await prisma.reelPost.deleteMany();
  await prisma.threadPost.deleteMany();
  await prisma.feedPost.deleteMany();
  await prisma.nightlifeSpot.deleteMany();
  await prisma.routePlan.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await bcrypt.hash("tourink-demo", 10);

  const handleToId = new Map<string, string>();

  for (const p of profiles) {
    const email = `${p.handle.replace(/\./g, "_")}@tourink.local`;
    const user = await prisma.user.create({
      data: {
        handle: p.handle,
        name: p.name,
        email,
        image: p.avatar,
        bio: p.bio,
        city: p.city,
        followers: p.followers,
        following: p.following,
        postsCount: p.posts,
        isLocal: !!p.isLocal,
        isOfficialAi: !!p.isOfficialAi,
        persona: p.persona,
        website: p.website,
        joinedAt: p.joinedAt,
        work: p.work,
        homeTown: p.homeTown,
        privateAccount: !!p.privateAccount,
        postsVisibility: p.postsVisibility ?? "everyone",
        threadsVisibility: p.threadsVisibility ?? "everyone",
        reelsVisibility: p.reelsVisibility ?? "everyone",
        whoCanMessage: p.whoCanMessage ?? "everyone",
        whoCanFollow: p.whoCanFollow ?? "everyone",
        instagramUrl: p.instagramUrl || null,
        facebookUrl: p.facebookUrl || null,
        threadsUrl: p.threadsUrl || null,
        tiktokUrl: p.tiktokUrl || null,
        youtubeUrl: p.youtubeUrl || null,
        passwordHash: p.handle === CURRENT_USER_HANDLE ? demoPassword : null
      }
    });
    handleToId.set(p.handle, user.id);
  }

  // Ensure every author handle exists
  const ensureUser = async (handle: string) => {
    let id = handleToId.get(handle);
    if (id) return id;
    const created = await prisma.user.create({
      data: {
        handle,
        name: handle,
        email: `${handle.replace(/\./g, "_")}@tourink.local`,
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
        bio: "Tourink traveler"
      }
    });
    handleToId.set(handle, created.id);
    return created.id;
  };

  for (const post of feedPosts) {
    const authorId = await ensureUser(post.author);
    await prisma.feedPost.create({
      data: {
        id: post.id,
        authorId,
        location: post.location,
        image: post.image,
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        tagsJson: JSON.stringify(post.tags),
        createdAt: post.createdAt
      }
    });
  }

  for (const c of comments) {
    const authorId = await ensureUser(c.author);
    await prisma.comment.create({
      data: {
        id: c.id,
        postId: c.postId,
        authorId,
        body: c.body,
        likes: c.likes,
        createdAt: c.createdAt,
        isLocal: !!c.isLocal
      }
    });
  }

  for (const t of threadPosts) {
    const authorId = await ensureUser(t.author);
    await prisma.threadPost.create({
      data: {
        id: t.id,
        authorId,
        body: t.body,
        likes: t.likes,
        replies: t.replies,
        createdAt: t.createdAt,
        tagsJson: JSON.stringify(t.tags ?? [])
      }
    });
  }

  for (const r of reelPosts) {
    const authorId = await ensureUser(r.author);
    await prisma.reelPost.create({
      data: {
        id: r.id,
        authorId,
        cover: r.cover,
        caption: r.caption,
        views: r.views,
        likes: r.likes,
        createdAt: r.createdAt,
        location: r.location
      }
    });
  }

  const sofiaId = handleToId.get(CURRENT_USER_HANDLE)!;
  for (const postId of savedPostIds) {
    await prisma.savedPost.create({
      data: { postId, userId: sofiaId }
    });
  }

  for (const h of hotels) {
    await prisma.hotel.create({
      data: {
        id: h.id,
        name: h.name,
        city: h.city,
        area: h.area,
        priceFrom: h.priceFrom,
        currency: h.currency,
        rating: h.rating,
        image: h.image,
        amenitiesJson: JSON.stringify(h.amenities),
        description: h.description
      }
    });
  }

  for (const e of experiences) {
    await prisma.experience.create({
      data: {
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
      }
    });
  }

  for (const r of routes) {
    await prisma.routePlan.create({
      data: {
        id: r.id,
        title: r.title,
        days: r.days,
        citiesJson: JSON.stringify(r.cities),
        image: r.image,
        highlightsJson: JSON.stringify(r.highlights),
        summary: r.summary
      }
    });
  }

  for (const n of nightlife) {
    await prisma.nightlifeSpot.create({
      data: {
        id: n.id,
        name: n.name,
        type: n.type,
        area: n.area,
        city: n.city,
        vibe: n.vibe,
        image: n.image,
        cover: n.cover,
        openUntil: n.openUntil,
        rating: n.rating,
        reviewCount: n.reviewCount
      }
    });
  }

  for (const rev of placeReviews) {
    const authorId = await ensureUser(rev.author);
    await prisma.placeReview.create({
      data: {
        id: rev.id,
        placeId: rev.placeId,
        placeType: rev.placeType,
        authorId,
        rating: rev.rating,
        body: rev.body,
        tagsJson: JSON.stringify(rev.tags),
        createdAt: rev.createdAt
      }
    });
  }

  for (const c of communityPosts) {
    const authorId = await ensureUser(c.author);
    await prisma.communityPost.create({
      data: {
        id: c.id,
        authorId,
        title: c.title,
        body: c.body,
        tagsJson: JSON.stringify(c.tags),
        replies: c.replies,
        createdAt: c.createdAt,
        kind: c.kind
      }
    });
  }

  for (const t of forumThreads) {
    const authorId = await ensureUser(t.author);
    await prisma.forumThread.create({
      data: {
        id: t.id,
        board: t.board,
        title: t.title,
        authorId,
        replies: t.replies,
        views: t.views,
        pinned: !!t.pinned,
        createdAt: t.createdAt,
        body: t.body
      }
    });
  }

  for (const r of forumReplies) {
    const authorId = await ensureUser(r.author);
    await prisma.forumReply.create({
      data: {
        id: r.id,
        threadId: r.threadId,
        authorId,
        body: r.body,
        likes: r.likes,
        createdAt: r.createdAt,
        isLocal: !!r.isLocal,
        accepted: !!r.accepted
      }
    });
  }

  for (const m of meetups) {
    const hostId = await ensureUser(m.host);
    await prisma.meetup.create({
      data: {
        id: m.id,
        title: m.title,
        hostId,
        city: m.city,
        area: m.area,
        whenLabel: m.when,
        spots: m.spots,
        going: m.going,
        tagsJson: JSON.stringify(m.tags),
        description: m.description
      }
    });
  }

  // Sample notifications for demo traveler
  const minaId = handleToId.get("mina.seoul");
  if (minaId) {
    await prisma.notification.createMany({
      data: [
        {
          userId: sofiaId,
          actorId: minaId,
          type: "follow",
          title: "New follower",
          body: "mina.seoul started following you",
          href: "/u/mina.seoul"
        },
        {
          userId: sofiaId,
          actorId: minaId,
          type: "like",
          title: "Liked your saved spot",
          body: "mina.seoul liked a post you saved",
          href: "/post/p1"
        },
        {
          userId: sofiaId,
          actorId: handleToId.get("local.yuna"),
          type: "rsvp",
          title: "Hangout update",
          body: "local.yuna RSVP’d near Seongsu",
          href: "/hangouts"
        }
      ]
    });
  }

  const aiCount = await prisma.user.count({ where: { isOfficialAi: true } });
  console.log(`Seeded users=${handleToId.size} (AI official=${aiCount}), posts=${feedPosts.length}`);
  console.log(`Demo login: @${CURRENT_USER_HANDLE} / tourink-demo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
