import { prisma } from "@/lib/db";
import { newCatalogId } from "@/lib/staff";
import { parseJsonArray } from "@/lib/json";

function asBool(v: unknown, fallback = true) {
  if (typeof v === "boolean") return v;
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  return fallback;
}

function asNum(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asStr(v: unknown, fallback = "") {
  return v == null ? fallback : String(v);
}

function csvOrJson(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  const s = asStr(v).trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      return parseJsonArray(s);
    } catch {
      /* fall through */
    }
  }
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

async function resolveUserId(body: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = asStr(body[k]).replace(/^@/, "");
    if (!v) continue;
    if (k.endsWith("Id") || k === "authorId" || k === "hostId") {
      const byId = await prisma.user.findUnique({ where: { id: v } });
      if (byId) return byId.id;
    }
    const byHandle = await prisma.user.findUnique({ where: { handle: v } });
    if (byHandle) return byHandle.id;
  }
  const any = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  return any?.id ?? "";
}

export type AdminResource =
  | "experiences"
  | "hotels"
  | "routes"
  | "nightlife"
  | "hangouts"
  | "feed"
  | "profiles"
  | "forum"
  | "community";

export async function adminListExperiences() {
  return prisma.experience.findMany({ orderBy: { id: "asc" } });
}

export async function adminUpsertExperience(body: Record<string, unknown>, id?: string) {
  const data = {
    title: asStr(body.title, "Untitled experience"),
    city: asStr(body.city, "Seoul"),
    price: asNum(body.price, 0),
    currency: asStr(body.currency, "USD"),
    duration: asStr(body.duration, "3 hours"),
    rating: asNum(body.rating, 4.5),
    reviews: asNum(body.reviews, 0),
    image: asStr(body.image, "https://images.unsplash.com/photo-1517154423616-4c2e5f5f0c5e?w=800"),
    category: asStr(body.category, "Day trip"),
    description: asStr(body.description, ""),
    active: asBool(body.active, true)
  };
  if (id) return prisma.experience.update({ where: { id }, data });
  return prisma.experience.create({ data: { id: asStr(body.id) || newCatalogId("exp-"), ...data } });
}

export async function adminListHotels() {
  return prisma.hotel.findMany({ orderBy: { id: "asc" } });
}

export async function adminUpsertHotel(body: Record<string, unknown>, id?: string) {
  const data = {
    name: asStr(body.name, "Untitled hotel"),
    city: asStr(body.city, "Seoul"),
    area: asStr(body.area, ""),
    priceFrom: asNum(body.priceFrom ?? body.price, 0),
    currency: asStr(body.currency, "KRW"),
    rating: asNum(body.rating, 4.5),
    image: asStr(body.image, "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"),
    amenitiesJson: JSON.stringify(csvOrJson(body.amenities ?? body.amenitiesJson)),
    description: asStr(body.description, ""),
    active: asBool(body.active, true)
  };
  if (id) return prisma.hotel.update({ where: { id }, data });
  return prisma.hotel.create({ data: { id: asStr(body.id) || newCatalogId("htl-"), ...data } });
}

export async function adminListRoutes() {
  return prisma.routePlan.findMany({ orderBy: { id: "asc" } });
}

export async function adminUpsertRoute(body: Record<string, unknown>, id?: string) {
  const data = {
    title: asStr(body.title, "Untitled route"),
    days: asNum(body.days, 3),
    citiesJson: JSON.stringify(csvOrJson(body.cities ?? body.citiesJson)),
    image: asStr(body.image, "https://images.unsplash.com/photo-1517154423616-4c2e5f5f0c5e?w=800"),
    highlightsJson: JSON.stringify(csvOrJson(body.highlights ?? body.highlightsJson)),
    summary: asStr(body.summary, ""),
    active: asBool(body.active, true)
  };
  if (id) return prisma.routePlan.update({ where: { id }, data });
  return prisma.routePlan.create({ data: { id: asStr(body.id) || newCatalogId("rte-"), ...data } });
}

export async function adminListNightlife() {
  return prisma.nightlifeSpot.findMany({ orderBy: { id: "asc" } });
}

export async function adminUpsertNightlife(body: Record<string, unknown>, id?: string) {
  const data = {
    name: asStr(body.name, "Untitled spot"),
    type: asStr(body.type, "bar"),
    area: asStr(body.area, ""),
    city: asStr(body.city, "Seoul"),
    vibe: asStr(body.vibe, ""),
    image: asStr(body.image, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"),
    cover: body.cover == null || body.cover === "" ? null : asNum(body.cover),
    openUntil: asStr(body.openUntil, "2am"),
    rating: asNum(body.rating, 4.5),
    reviewCount: asNum(body.reviewCount ?? body.reviews, 0),
    active: asBool(body.active, true)
  };
  if (id) return prisma.nightlifeSpot.update({ where: { id }, data });
  return prisma.nightlifeSpot.create({ data: { id: asStr(body.id) || newCatalogId("nl-"), ...data } });
}

export async function adminListHangouts() {
  return prisma.meetup.findMany({ include: { host: true }, orderBy: { id: "asc" } });
}

export async function adminUpsertHangout(body: Record<string, unknown>, id?: string) {
  const hostId = await resolveUserId(body, ["hostId", "host"]);
  if (!hostId) throw new Error("No host user available");
  const data = {
    title: asStr(body.title, "Untitled hangout"),
    hostId,
    city: asStr(body.city, "Seoul"),
    area: asStr(body.area, ""),
    whenLabel: asStr(body.whenLabel ?? body.when, "Soon"),
    spots: asNum(body.spots, 8),
    going: asNum(body.going, 0),
    tagsJson: JSON.stringify(csvOrJson(body.tags ?? body.tagsJson)),
    description: asStr(body.description, ""),
    active: asBool(body.active, true)
  };
  if (id) return prisma.meetup.update({ where: { id }, data });
  return prisma.meetup.create({ data: { id: asStr(body.id) || newCatalogId("mt-"), ...data } });
}

export async function adminListFeed() {
  return prisma.feedPost.findMany({ include: { author: true }, orderBy: { id: "asc" } });
}

export async function adminUpsertFeed(body: Record<string, unknown>, id?: string) {
  const authorId = await resolveUserId(body, ["authorId", "author"]);
  if (!authorId) throw new Error("No author available");
  const data = {
    authorId,
    location: asStr(body.location, "Seoul"),
    image: asStr(body.image, "https://images.unsplash.com/photo-1517154423616-4c2e5f5f0c5e?w=800"),
    caption: asStr(body.caption, ""),
    likes: asNum(body.likes, 0),
    comments: asNum(body.comments, 0),
    tagsJson: JSON.stringify(csvOrJson(body.tags ?? body.tagsJson)),
    createdAt: asStr(body.createdAt, new Date().toISOString().slice(0, 10)),
    active: asBool(body.active, true)
  };
  if (id) return prisma.feedPost.update({ where: { id }, data });
  return prisma.feedPost.create({ data: { id: asStr(body.id) || newCatalogId("p"), ...data } });
}

export async function adminListProfiles() {
  return prisma.user.findMany({
    where: { OR: [{ isOfficialAi: true }, { role: { in: ["ADMIN", "STAFF"] } }] },
    orderBy: [{ isOfficialAi: "desc" }, { handle: "asc" }]
  });
}

export async function adminUpsertProfile(body: Record<string, unknown>, id?: string) {
  const data = {
    name: asStr(body.name, "Profile"),
    bio: asStr(body.bio, ""),
    city: asStr(body.city, "Seoul"),
    image: body.image == null ? undefined : asStr(body.image),
    persona: body.persona == null ? undefined : asStr(body.persona),
    website: body.website == null ? undefined : asStr(body.website),
    isOfficialAi: asBool(body.isOfficialAi, false),
    isLocal: asBool(body.isLocal, false),
    role: asStr(body.role, "USER")
  };
  if (id) return prisma.user.update({ where: { id }, data });
  const handle = asStr(body.handle).replace(/^@/, "").toLowerCase();
  if (!handle) throw new Error("handle required");
  return prisma.user.create({
    data: {
      handle,
      email: asStr(body.email) || `${handle.replace(/\./g, "_")}@tourink.local`,
      ...data
    }
  });
}

export async function adminListForum() {
  return prisma.forumThread.findMany({ include: { author: true }, orderBy: { id: "asc" } });
}

export async function adminUpsertForum(body: Record<string, unknown>, id?: string) {
  const authorId = await resolveUserId(body, ["authorId", "author"]);
  if (!authorId) throw new Error("No author available");
  const data = {
    board: asStr(body.board, "general"),
    title: asStr(body.title, "Untitled thread"),
    authorId,
    replies: asNum(body.replies, 0),
    views: asNum(body.views, 0),
    pinned: asBool(body.pinned, false),
    createdAt: asStr(body.createdAt, new Date().toISOString().slice(0, 10)),
    body: asStr(body.body, ""),
    active: asBool(body.active, true)
  };
  if (id) return prisma.forumThread.update({ where: { id }, data });
  return prisma.forumThread.create({ data: { id: asStr(body.id) || newCatalogId("ft-"), ...data } });
}

export async function adminListCommunity() {
  return prisma.communityPost.findMany({ include: { author: true }, orderBy: { id: "asc" } });
}

export async function adminUpsertCommunity(body: Record<string, unknown>, id?: string) {
  const authorId = await resolveUserId(body, ["authorId", "author"]);
  if (!authorId) throw new Error("No author available");
  const data = {
    authorId,
    title: asStr(body.title, "Untitled"),
    body: asStr(body.body, ""),
    tagsJson: JSON.stringify(csvOrJson(body.tags ?? body.tagsJson)),
    replies: asNum(body.replies, 0),
    createdAt: asStr(body.createdAt, new Date().toISOString().slice(0, 10)),
    kind: asStr(body.kind, "tip"),
    active: asBool(body.active, true)
  };
  if (id) return prisma.communityPost.update({ where: { id }, data });
  return prisma.communityPost.create({ data: { id: asStr(body.id) || newCatalogId("cp-"), ...data } });
}

export async function adminList(resource: AdminResource) {
  switch (resource) {
    case "experiences": return adminListExperiences();
    case "hotels": return adminListHotels();
    case "routes": return adminListRoutes();
    case "nightlife": return adminListNightlife();
    case "hangouts": return adminListHangouts();
    case "feed": return adminListFeed();
    case "profiles": return adminListProfiles();
    case "forum": return adminListForum();
    case "community": return adminListCommunity();
    default: throw new Error("Unknown resource");
  }
}

export async function adminUpsert(resource: AdminResource, body: Record<string, unknown>, id?: string) {
  switch (resource) {
    case "experiences": return adminUpsertExperience(body, id);
    case "hotels": return adminUpsertHotel(body, id);
    case "routes": return adminUpsertRoute(body, id);
    case "nightlife": return adminUpsertNightlife(body, id);
    case "hangouts": return adminUpsertHangout(body, id);
    case "feed": return adminUpsertFeed(body, id);
    case "profiles": return adminUpsertProfile(body, id);
    case "forum": return adminUpsertForum(body, id);
    case "community": return adminUpsertCommunity(body, id);
    default: throw new Error("Unknown resource");
  }
}

export async function adminDelete(resource: AdminResource, id: string) {
  switch (resource) {
    case "experiences": return prisma.experience.delete({ where: { id } });
    case "hotels": return prisma.hotel.delete({ where: { id } });
    case "routes": return prisma.routePlan.delete({ where: { id } });
    case "nightlife": return prisma.nightlifeSpot.delete({ where: { id } });
    case "hangouts": return prisma.meetup.delete({ where: { id } });
    case "feed": return prisma.feedPost.delete({ where: { id } });
    case "profiles": return prisma.user.delete({ where: { id } });
    case "forum": return prisma.forumThread.delete({ where: { id } });
    case "community": return prisma.communityPost.delete({ where: { id } });
    default: throw new Error("Unknown resource");
  }
}

export async function adminToggleActive(resource: AdminResource, id: string, active: boolean) {
  if (resource === "profiles") {
    return prisma.user.update({ where: { id }, data: { isOfficialAi: active } });
  }
  const data = { active };
  switch (resource) {
    case "experiences": return prisma.experience.update({ where: { id }, data });
    case "hotels": return prisma.hotel.update({ where: { id }, data });
    case "routes": return prisma.routePlan.update({ where: { id }, data });
    case "nightlife": return prisma.nightlifeSpot.update({ where: { id }, data });
    case "hangouts": return prisma.meetup.update({ where: { id }, data });
    case "feed": return prisma.feedPost.update({ where: { id }, data });
    case "forum": return prisma.forumThread.update({ where: { id }, data });
    case "community": return prisma.communityPost.update({ where: { id }, data });
    default: throw new Error("Unknown resource");
  }
}

export async function adminGet(resource: AdminResource, id: string) {
  switch (resource) {
    case "experiences": return prisma.experience.findUnique({ where: { id } });
    case "hotels": return prisma.hotel.findUnique({ where: { id } });
    case "routes": return prisma.routePlan.findUnique({ where: { id } });
    case "nightlife": return prisma.nightlifeSpot.findUnique({ where: { id } });
    case "hangouts": return prisma.meetup.findUnique({ where: { id }, include: { host: true } });
    case "feed": return prisma.feedPost.findUnique({ where: { id }, include: { author: true } });
    case "profiles": return prisma.user.findUnique({ where: { id } });
    case "forum": return prisma.forumThread.findUnique({ where: { id }, include: { author: true } });
    case "community": return prisma.communityPost.findUnique({ where: { id }, include: { author: true } });
    default: throw new Error("Unknown resource");
  }
}
