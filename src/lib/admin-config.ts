export type AdminResourceKey =
  | "experiences"
  | "hotels"
  | "routes"
  | "nightlife"
  | "hangouts"
  | "feed"
  | "profiles"
  | "forum"
  | "community";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  hint?: string;
};

export const ADMIN_NAV: { href: string; key: AdminResourceKey; label: string }[] = [
  { href: "/admin/experiences", key: "experiences", label: "Experiences" },
  { href: "/admin/hotels", key: "hotels", label: "Hotels" },
  { href: "/admin/routes", key: "routes", label: "Routes" },
  { href: "/admin/nightlife", key: "nightlife", label: "Nightlife" },
  { href: "/admin/hangouts", key: "hangouts", label: "Hangouts" },
  { href: "/admin/feed", key: "feed", label: "Feed posts" },
  { href: "/admin/profiles", key: "profiles", label: "AI profiles" },
  { href: "/admin/forum", key: "forum", label: "Forum" },
  { href: "/admin/community", key: "community", label: "Community" }
];

export const RESOURCE_FIELDS: Record<AdminResourceKey, FieldDef[]> = {
  experiences: [
    { key: "title", label: "Title", type: "text" },
    { key: "city", label: "Place / city", type: "text" },
    { key: "duration", label: "Duration", type: "text", hint: "e.g. 10 hours" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "reviews", label: "Review count", type: "number" },
    { key: "price", label: "Price", type: "number" },
    { key: "currency", label: "Currency", type: "text", hint: "USD or KRW" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  hotels: [
    { key: "name", label: "Name", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "area", label: "Area", type: "text" },
    { key: "priceFrom", label: "Price from", type: "number" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "amenities", label: "Amenities (comma-separated)", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  routes: [
    { key: "title", label: "Title", type: "text" },
    { key: "days", label: "Days", type: "number" },
    { key: "cities", label: "Cities (comma-separated)", type: "text" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "highlights", label: "Highlights (comma-separated)", type: "text" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  nightlife: [
    { key: "name", label: "Name", type: "text" },
    { key: "type", label: "Type", type: "select", options: ["bar", "club", "rooftop"] },
    { key: "area", label: "Area", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "vibe", label: "Vibe", type: "text" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "cover", label: "Cover charge", type: "number" },
    { key: "openUntil", label: "Open until", type: "text" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "reviewCount", label: "Review count", type: "number" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  hangouts: [
    { key: "title", label: "Title", type: "text" },
    { key: "host", label: "Host handle", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "area", label: "Area", type: "text" },
    { key: "whenLabel", label: "When", type: "text" },
    { key: "spots", label: "Spots", type: "number" },
    { key: "going", label: "Going", type: "number" },
    { key: "tags", label: "Tags (comma-separated)", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  feed: [
    { key: "author", label: "Author handle", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "caption", label: "Caption", type: "textarea" },
    { key: "likes", label: "Likes", type: "number" },
    { key: "comments", label: "Comments count", type: "number" },
    { key: "tags", label: "Tags (comma-separated)", type: "text" },
    { key: "createdAt", label: "Created at", type: "text" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  profiles: [
    { key: "handle", label: "Handle", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "city", label: "City", type: "text" },
    { key: "image", label: "Avatar URL", type: "text" },
    { key: "persona", label: "Persona", type: "textarea" },
    { key: "website", label: "Website", type: "text" },
    { key: "role", label: "Role", type: "select", options: ["USER", "STAFF", "ADMIN"] },
    { key: "isOfficialAi", label: "Official AI profile", type: "checkbox" },
    { key: "isLocal", label: "Local guide", type: "checkbox" }
  ],
  forum: [
    { key: "board", label: "Board", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "author", label: "Author handle", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "replies", label: "Replies", type: "number" },
    { key: "views", label: "Views", type: "number" },
    { key: "pinned", label: "Pinned", type: "checkbox" },
    { key: "createdAt", label: "Created at", type: "text" },
    { key: "active", label: "Published", type: "checkbox" }
  ],
  community: [
    { key: "title", label: "Title", type: "text" },
    { key: "author", label: "Author handle", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "kind", label: "Kind", type: "select", options: ["ask-local", "tip", "meetup"] },
    { key: "tags", label: "Tags (comma-separated)", type: "text" },
    { key: "replies", label: "Replies", type: "number" },
    { key: "createdAt", label: "Created at", type: "text" },
    { key: "active", label: "Published", type: "checkbox" }
  ]
};

export function rowTitle(resource: AdminResourceKey, item: Record<string, unknown>): string {
  const t = item.title ?? item.name ?? item.caption ?? item.handle ?? item.id;
  return String(t ?? "Untitled");
}

export function normalizeItemForForm(
  resource: AdminResourceKey,
  item: Record<string, unknown> | null
): Record<string, unknown> {
  if (!item) {
    const blank: Record<string, unknown> = {};
    for (const f of RESOURCE_FIELDS[resource]) {
      blank[f.key] = f.type === "checkbox" ? true : f.type === "number" ? 0 : "";
    }
    if (resource === "profiles") blank.isOfficialAi = true;
    return blank;
  }

  const out: Record<string, unknown> = { ...item };

  if (item.amenitiesJson && !item.amenities) {
    try {
      out.amenities = JSON.parse(String(item.amenitiesJson)).join(", ");
    } catch {
      out.amenities = "";
    }
  } else if (Array.isArray(item.amenities)) {
    out.amenities = (item.amenities as string[]).join(", ");
  }

  for (const jsonKey of ["citiesJson", "highlightsJson", "tagsJson"] as const) {
    const plain = jsonKey.replace("Json", "");
    if (item[jsonKey] && out[plain] == null) {
      try {
        out[plain] = JSON.parse(String(item[jsonKey])).join(", ");
      } catch {
        out[plain] = "";
      }
    } else if (Array.isArray(item[plain])) {
      out[plain] = (item[plain] as string[]).join(", ");
    }
  }

  if (item.host && typeof item.host === "object") {
    out.host = (item.host as { handle?: string }).handle ?? "";
  }
  if (item.author && typeof item.author === "object") {
    out.author = (item.author as { handle?: string }).handle ?? "";
  }
  if (item.whenLabel) out.whenLabel = item.whenLabel;

  return out;
}
