/**
 * Staff-facing result reports for monday.org / Tourink admin.
 * Korean titles are primary for staff scan; English body for implementation detail.
 */

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

  const providers: ProviderStatus[] = [
    {
      id: "mock",
      displayName: "Mock (default)",
      configured: true,
      envKeys: ["HOTEL_PROVIDER=mock"],
      mode: "mock",
      notes: "Deterministic rates for local / preview. Always available."
    },
    {
      id: "expedia-rapid",
      displayName: "Expedia Rapid (EAN)",
      configured: expediaReady,
      envKeys: ["EXPEDIA_API_KEY", "EXPEDIA_SHARED_SECRET", "EXPEDIA_ENV"],
      mode: expediaReady ? "ready" : "stub",
      notes: "Partner approval required. Sandbox test.ean.com → api.ean.com."
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
      "HotelProvider adapter pattern: mock by default; Expedia Rapid / Amadeus stubs flip live when HOTEL_PROVIDER + partner keys are set. Booking.com Demand API noted but not wired (Managed Affiliate only).",
    statusLabel: active === "mock" ? "Mock live · partner stubs ready" : `Live via ${active}`,
    activeProvider: active,
    codePaths: [
      { label: "Provider factory", path: "src/lib/hotels/index.ts" },
      { label: "Types / contract", path: "src/lib/hotels/types.ts" },
      { label: "Mock rates", path: "src/lib/hotels/mock-provider.ts" },
      { label: "Expedia Rapid stub", path: "src/lib/hotels/expedia-rapid.ts" },
      { label: "Amadeus stub", path: "src/lib/hotels/amadeus.ts" },
      { label: "Availability API", path: "src/app/api/hotels/availability/route.ts" },
      { label: "Hotel detail UI", path: "src/components/HotelAvailabilityPanel.tsx" }
    ],
    envHints: ["HOTEL_PROVIDER", "EXPEDIA_*", "AMADEUS_*"],
    providers,
    howItWorks: [
      "Public `/hotel/[id]` calls `/api/hotels/availability` with check-in/out + guests.",
      "Factory `getHotelProvider()` reads HOTEL_PROVIDER; falls back to mock if keys missing.",
      "Selected offer deep-links into `/book/hotel/[id]` with nightlyRate for checkout.",
      "Orders persist via `/api/bookings` (test payment path when Stripe absent)."
    ]
  };
}

export function getExperienceIntegrationReport(): IntegrationReport {
  const choice = (process.env.EXPERIENCE_PROVIDER ?? "mock").toLowerCase().trim();
  const klookReady = envSet("KLOOK_API_KEY");
  const viatorReady = envSet("VIATOR_API_KEY");
  const gygReady = envSet("GYG_ACCESS_TOKEN");

  const providers: ProviderStatus[] = [
    {
      id: "mock",
      displayName: "Mock (default)",
      configured: true,
      envKeys: ["EXPERIENCE_PROVIDER=mock"],
      mode: "mock",
      notes: "Keeps Experiences catalog visible with fake time-slot offers."
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
      "ExperienceProvider adapter (Klook / Viator / GYG stubs). Catalog stays visible as a core product surface; mock provider serves availability until partner keys land.",
    statusLabel: active === "mock" ? "Mock live · partner stubs ready" : `Live via ${active}`,
    activeProvider: active,
    codePaths: [
      { label: "Provider factory", path: "src/lib/experiences/index.ts" },
      { label: "Types / contract", path: "src/lib/experiences/types.ts" },
      { label: "Mock offers", path: "src/lib/experiences/mock-provider.ts" },
      { label: "Klook stub", path: "src/lib/experiences/klook.ts" },
      { label: "Viator stub", path: "src/lib/experiences/viator.ts" },
      { label: "GetYourGuide stub", path: "src/lib/experiences/getyourguide.ts" },
      { label: "Availability API", path: "src/app/api/experiences/availability/route.ts" },
      { label: "Experience detail UI", path: "src/components/ExperienceAvailabilityPanel.tsx" }
    ],
    envHints: ["EXPERIENCE_PROVIDER", "KLOOK_*", "VIATOR_*", "GYG_*"],
    providers,
    howItWorks: [
      "Nav Experiences remains product-critical (not soft-hidden).",
      "`/experience/[id]` loads availability from `/api/experiences/availability`.",
      "Factory `getExperienceProvider()` selects mock|klook|viator|gyg; missing keys → mock.",
      "Checkout passes unitRate + activityDate into `/api/bookings`."
    ]
  };
}

export function getDeliverableReports(): DeliverableReport[] {
  return [
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
        "Unpublished rows stay in DB but hide from tourist pages"
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
        "Checkout → DB order → confirmation (test payment without Stripe)",
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
