/**
 * Staff-facing result reports for monday.org / Tourink admin.
 * Korean titles are primary for staff scan; English body for implementation detail.
 */

import {
  getPublicFeatureFlags,
  hasLiveExperienceProvider,
  hasLiveHotelProvider,
  isExperiencesEnabled,
  isHotelsEnabled
} from "@/lib/feature-flags";

export type ProviderStatus = {
  id: string;
  displayName: string;
  configured: boolean;
  envKeys: string[];
  mode: "mock" | "stub" | "ready";
  notes: string;
};

export type IntegrationReport = {
  id: string;
  /** Korean title for monday.org staff */
  titleKo: string;
  titleEn: string;
  summary: string;
  statusLabel: string;
  activeProvider: string;
  codePaths: { label: string; path: string }[];
  envHints: string[];
  providers: ProviderStatus[];
  howItWorks: string[];
};

export type DeliverableReport = {
  id: string;
  titleKo: string;
  titleEn: string;
  summary: string;
  statusLabel: string;
  links: { label: string; href: string }[];
  bullets: string[];
};

function envSet(...keys: string[]) {
  return keys.every((k) => Boolean(process.env[k]?.trim()));
}

export function getHotelIntegrationReport(): IntegrationReport {
  const choice = (process.env.HOTEL_PROVIDER ?? "mock").toLowerCase().trim();
  const expediaReady = envSet("EXPEDIA_API_KEY", "EXPEDIA_SHARED_SECRET");
  const amadeusReady = envSet("AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET");
  const publicEnabled = isHotelsEnabled();
  const live = hasLiveHotelProvider();

  const providers: ProviderStatus[] = [
    {
      id: "mock",
      displayName: "Mock (hidden from public)",
      configured: true,
      envKeys: ["HOTEL_PROVIDER=mock"],
      mode: "mock",
      notes:
        "Mock rates remain in code for staging. Public nav shows Coming soon unless NEXT_PUBLIC_ENABLE_HOTELS=true or a live provider is keyed."
    },
    {
      id: "expedia-rapid",
      displayName: "Expedia Rapid (EAN)",
      configured: expediaReady,
      envKeys: ["EXPEDIA_API_KEY", "EXPEDIA_SHARED_SECRET", "EXPEDIA_ENV"],
      mode: expediaReady ? "ready" : "stub",
      notes: "Partner approval required. Setting HOTEL_PROVIDER=expedia + keys auto-enables public Hotels."
    },
    {
      id: "amadeus",
      displayName: "Amadeus Hotel APIs",
      configured: amadeusReady,
      envKeys: ["AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET", "AMADEUS_ENV"],
      mode: amadeusReady ? "ready" : "stub",
      notes: "Enterprise credentials. Self-serve portal decommissioned."
    }
  ];

  let active = "mock";
  if ((choice === "expedia" || choice === "expedia-rapid" || choice === "ean") && expediaReady) {
    active = "expedia-rapid";
  } else if (choice === "amadeus" && amadeusReady) {
    active = "amadeus";
  }

  return {
    id: "hotel-api",
    titleKo: "호텔 API 연동 결과 리포트",
    titleEn: "Hotel API integration",
    summary:
      "HotelProvider adapters kept. Public Hotels soft-hidden (Coming soon) by default — mock checkout is not treated as real use. Enable via NEXT_PUBLIC_ENABLE_HOTELS=true or auto when HOTEL_PROVIDER=expedia|amadeus + keys.",
    statusLabel: !publicEnabled
      ? "Public Coming soon · adapters ready"
      : live
        ? `Public live via ${active}`
        : "Public enabled (override) · mock",
    activeProvider: active,
    codePaths: [
      { label: "Feature flags", path: "src/lib/feature-flags.ts" },
      { label: "Provider factory", path: "src/lib/hotels/index.ts" },
      { label: "Types / contract", path: "src/lib/hotels/types.ts" },
      { label: "Mock rates", path: "src/lib/hotels/mock-provider.ts" },
      { label: "Expedia Rapid stub", path: "src/lib/hotels/expedia-rapid.ts" },
      { label: "Amadeus stub", path: "src/lib/hotels/amadeus.ts" },
      { label: "Availability API", path: "src/app/api/hotels/availability/route.ts" },
      { label: "Hotel detail UI", path: "src/components/HotelAvailabilityPanel.tsx" }
    ],
    envHints: [
      "NEXT_PUBLIC_ENABLE_HOTELS (default false)",
      "HOTEL_PROVIDER",
      "EXPEDIA_*",
      "AMADEUS_*"
    ],
    providers,
    howItWorks: [
      "Nav Hotels stays visible with a Soon badge when disabled; `/hotels` shows Coming soon (no fake Book CTAs).",
      "Availability + `/api/bookings` hotel POSTs return 503 while the flag is off.",
      "Factory `getHotelProvider()` still resolves mock|expedia|amadeus for when keys land.",
      "Auto-enable: HOTEL_PROVIDER=expedia + EXPEDIA_API_KEY + EXPEDIA_SHARED_SECRET (or amadeus + keys)."
    ]
  };
}

export function getExperienceIntegrationReport(): IntegrationReport {
  const choice = (process.env.EXPERIENCE_PROVIDER ?? "mock").toLowerCase().trim();
  const klookReady = envSet("KLOOK_API_KEY");
  const viatorReady = envSet("VIATOR_API_KEY");
  const gygReady = envSet("GYG_ACCESS_TOKEN");
  const publicEnabled = isExperiencesEnabled();
  const live = hasLiveExperienceProvider();

  const providers: ProviderStatus[] = [
    {
      id: "mock",
      displayName: "Mock (hidden from public)",
      configured: true,
      envKeys: ["EXPERIENCE_PROVIDER=mock"],
      mode: "mock",
      notes: "Mock slots kept for staging only. Public Experiences = Coming soon by default."
    },
    {
      id: "klook",
      displayName: "Klook",
      configured: klookReady,
      envKeys: ["KLOOK_API_KEY", "KLOOK_AFFILIATE_ID", "KLOOK_ENV"],
      mode: klookReady ? "ready" : "stub",
      notes: "Demand/reseller needs BD agreement — public OpenAPI is supplier OCTO (inverted)."
    },
    {
      id: "viator",
      displayName: "Viator",
      configured: viatorReady,
      envKeys: ["VIATOR_API_KEY", "VIATOR_ENV"],
      mode: viatorReady ? "ready" : "stub",
      notes: "Basic Access self-serve; Full + Booking needs certification."
    },
    {
      id: "getyourguide",
      displayName: "GetYourGuide",
      configured: gygReady,
      envKeys: ["GYG_ACCESS_TOKEN", "GYG_ENV"],
      mode: gygReady ? "ready" : "stub",
      notes: "X-ACCESS-TOKEN from partner onboarding. Test host api.gygtest.net."
    }
  ];

  let active = "mock";
  if (choice === "klook" && klookReady) active = "klook";
  else if (choice === "viator" && viatorReady) active = "viator";
  else if ((choice === "getyourguide" || choice === "gyg") && gygReady) active = "getyourguide";

  return {
    id: "experiences-api",
    titleKo: "체험·티켓 API 연동 결과 리포트",
    titleEn: "Experiences / tickets API integration",
    summary:
      "ExperienceProvider adapters kept. Public Experiences soft-hidden (Coming soon) — mock booking is not real use. Enable via NEXT_PUBLIC_ENABLE_EXPERIENCES=true or auto when EXPERIENCE_PROVIDER + partner keys are set.",
    statusLabel: !publicEnabled
      ? "Public Coming soon · adapters ready"
      : live
        ? `Public live via ${active}`
        : "Public enabled (override) · mock",
    activeProvider: active,
    codePaths: [
      { label: "Feature flags", path: "src/lib/feature-flags.ts" },
      { label: "Provider factory", path: "src/lib/experiences/index.ts" },
      { label: "Types / contract", path: "src/lib/experiences/types.ts" },
      { label: "Mock offers", path: "src/lib/experiences/mock-provider.ts" },
      { label: "Klook stub", path: "src/lib/experiences/klook.ts" },
      { label: "Viator stub", path: "src/lib/experiences/viator.ts" },
      { label: "GetYourGuide stub", path: "src/lib/experiences/getyourguide.ts" },
      { label: "Availability API", path: "src/app/api/experiences/availability/route.ts" },
      { label: "Experience detail UI", path: "src/components/ExperienceAvailabilityPanel.tsx" }
    ],
    envHints: [
      "NEXT_PUBLIC_ENABLE_EXPERIENCES (default false)",
      "EXPERIENCE_PROVIDER",
      "KLOOK_*",
      "VIATOR_*",
      "GYG_*"
    ],
    providers,
    howItWorks: [
      "Nav Experiences shows Soon badge; landing is Coming soon without Check availability / Book CTAs.",
      "Availability + booking APIs return 503 while the flag is off.",
      "Factory `getExperienceProvider()` still selects mock|klook|viator|gyg for later keys.",
      "Auto-enable when EXPERIENCE_PROVIDER matches a keyed partner."
    ]
  };
}

export function getFreeApisReport(): IntegrationReport {
  return {
    id: "free-public-apis",
    titleKo: "무료 공개 API 실연동",
    titleEn: "Free public APIs (live now)",
    summary:
      "No partner approval needed: Open-Meteo weather on the feed, Nominatim (OSM) geo hits in Search, Unsplash images already used in catalog seeds.",
    statusLabel: "Live",
    activeProvider: "open-meteo + nominatim + unsplash",
    codePaths: [
      { label: "Weather client", path: "src/lib/weather.ts" },
      { label: "Weather UI", path: "src/components/WeatherStrip.tsx" },
      { label: "Nominatim geo", path: "src/lib/geo.ts" },
      { label: "Search API", path: "src/app/api/search/route.ts" }
    ],
    envHints: ["(none — Open-Meteo & Nominatim are keyless)"],
    providers: [
      {
        id: "open-meteo",
        displayName: "Open-Meteo",
        configured: true,
        envKeys: [],
        mode: "ready",
        notes: "Seoul / Busan / Jeju current conditions on the home feed."
      },
      {
        id: "nominatim",
        displayName: "Nominatim (OSM)",
        configured: true,
        envKeys: [],
        mode: "ready",
        notes: "Korea-scoped place search; User-Agent set; links to OSM map."
      },
      {
        id: "unsplash",
        displayName: "Unsplash (images)",
        configured: true,
        envKeys: [],
        mode: "ready",
        notes: "Hotlinked catalog / feed imagery (already in seed data)."
      }
    ],
    howItWorks: [
      "`fetchKoreaCityWeather()` calls api.open-meteo.com with 30m revalidate.",
      "`/api/search` merges catalog hits with Nominatim results (countrycodes=kr).",
      "Partner hotel/experience APIs remain stubs until keys — not mixed into free path."
    ]
  };
}

export function getFeatureFlagsReport(): DeliverableReport {
  const flags = getPublicFeatureFlags();
  return {
    id: "feature-flags",
    titleKo: "공개 기능 플래그 (숨김/연동)",
    titleEn: "Public feature flags",
    summary:
      "Hotels & Experiences default off for tourists. Staff enable via env; partner keys auto-flip on.",
    statusLabel: `hotels=${flags.hotels ? "on" : "off"} · experiences=${flags.experiences ? "on" : "off"}`,
    links: [
      { label: "Hotels", href: "/hotels" },
      { label: "Experiences", href: "/experiences" },
      { label: "This reports page", href: "/admin/reports" }
    ],
    bullets: [
      "NEXT_PUBLIC_ENABLE_HOTELS default false; auto-on when HOTEL_PROVIDER=expedia|amadeus + keys",
      "NEXT_PUBLIC_ENABLE_EXPERIENCES default false; auto-on when EXPERIENCE_PROVIDER + keys",
      "Adapter code + Admin CMS catalog rows kept; mock checkout CTAs removed from public path",
      "Feed · My Page · Community · Forum · Hangouts · Routes · Nightlife stay visible"
    ]
  };
}

export function getDeliverableReports(): DeliverableReport[] {
  return [
    getFeatureFlagsReport(),
    {
      id: "admin-cms",
      titleKo: "스태프 Admin CMS",
      titleEn: "Staff Admin CMS",
      summary: "Prisma-backed CRUD + publish toggles for catalog content at /admin.",
      statusLabel: "Shipped (PR #8)",
      links: [
        { label: "Admin dashboard", href: "/admin" },
        { label: "Experiences CMS", href: "/admin/experiences" },
        { label: "Hotels CMS", href: "/admin/hotels" }
      ],
      bullets: [
        "Staff gate: ADMIN / STAFF roles only",
        "Demo login admin@tourink / tourink-admin (ADMIN_PASSWORD)",
        "Unpublished rows stay in DB but hide from tourist pages",
        "Hotel/experience CMS rows remain editable even while public booking is Coming soon"
      ]
    },
    {
      id: "ai-official-profiles",
      titleKo: "공식 AI 크리에이터 프로필",
      titleEn: "Official AI creator profiles",
      summary: "Seeded Official AI handles author feed / threads / reels with badge.",
      statusLabel: "Shipped",
      links: [
        { label: "AI profiles CMS", href: "/admin/profiles" },
        { label: "AI Answers (this page)", href: "/admin/reports#ai-answers" },
        { label: "Public feed", href: "/" }
      ],
      bullets: [
        "Handles: mina.seoul, busan.wave, jeju.trail, market.finder, local.yuna",
        "isOfficialAi flag + OfficialAiBadge on public surfaces",
        "Staff can review publishing output below"
      ]
    },
    {
      id: "production-upgrade",
      titleKo: "프로덕션 기반 업그레이드",
      titleEn: "Production upgrade beyond MVP",
      summary: "Auth.js, Prisma, bookings, search, notifications — replace MVP mock framing.",
      statusLabel: "Shipped (PR #5)",
      links: [
        { label: "Sign in", href: "/auth/signin" },
        { label: "My Page", href: "/profile" }
      ],
      bullets: [
        "Demo traveler sofia.mx / tourink-demo",
        "Checkout → DB order → confirmation (only when hotel/experience flags on)",
        "Postgres / Stripe / OAuth activate via env"
      ]
    },
    {
      id: "profile-tabs",
      titleKo: "마이페이지 피드 탭",
      titleEn: "My Page profile tabs",
      summary: "Posts / Threads / Reels / Saved / About tabs on traveler profiles.",
      statusLabel: "Shipped (#3)",
      links: [
        { label: "My Page", href: "/profile" },
        { label: "AI creator example", href: "/u/mina.seoul" }
      ],
      bullets: [
        "Tabbed content for own + public profiles",
        "Saved posts collection",
        "About persona for Official AI creators"
      ]
    }
  ];
}
