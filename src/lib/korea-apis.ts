/**
 * Korea inbound-travel API research catalog for Tourink staff.
 * Status reflects signup / free-tier / partner barriers as of research date.
 */

export type KoreaApiStatus = "usable_now" | "needs_key" | "partner";

export type KoreaApiEntry = {
  id: string;
  nameKo: string;
  nameEn: string;
  category: "places" | "food" | "transit" | "weather" | "events" | "images";
  status: KoreaApiStatus;
  /** Recommend connecting now vs later */
  timing: "now" | "soon" | "later";
  freeTier: string;
  signup: string;
  koreaCoverage: string;
  notes: string;
  docsUrl: string;
  envHint?: string;
};

export type KoreaApiStatusMeta = {
  labelKo: string;
  labelEn: string;
  className: string;
};

export const KOREA_API_STATUS_META: Record<KoreaApiStatus, KoreaApiStatusMeta> = {
  usable_now: {
    labelKo: "지금 사용 가능",
    labelEn: "Usable now",
    className: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
  },
  needs_key: {
    labelKo: "키 발급 필요",
    labelEn: "Needs key",
    className: "border-neon-amber/40 bg-neon-amber/10 text-neon-amber"
  },
  partner: {
    labelKo: "제휴·승인 필요",
    labelEn: "Partner",
    className: "border-white/20 bg-white/5 text-white/55"
  }
};

export const KOREA_API_RESEARCH_UPDATED = "2026-09-07";

/** Top connection candidates for inbound Tourink (staff recommendation). */
export const KOREA_API_TOP_PICKS = ["visitkorea-eng", "kakao-local", "tago"] as const;

export const KOREA_APIS: KoreaApiEntry[] = [
  {
    id: "open-meteo",
    nameKo: "Open-Meteo 날씨",
    nameEn: "Open-Meteo",
    category: "weather",
    status: "usable_now",
    timing: "now",
    freeTier: "완전 무료 · 키 없음 (비영리/오픈 사용 정책 준수)",
    signup: "불필요",
    koreaCoverage: "전국 예보 · Asia/Seoul",
    notes:
      "이미 홈 피드 WeatherStrip에 연동됨. 추가 키 없이 유지.",
    docsUrl: "https://open-meteo.com/"
  },
  {
    id: "nominatim",
    nameKo: "Nominatim (OSM) 장소",
    nameEn: "Nominatim / OpenStreetMap",
    category: "places",
    status: "usable_now",
    timing: "now",
    freeTier: "키 없음 · 사용 정책(User-Agent·레이트) 준수 필요",
    signup: "불필요",
    koreaCoverage: "전국 POI · 품질은 OSM 기여도에 따름",
    notes: "이미 /api/search에 countrycodes=kr로 연동. 상업 POI는 Kakao/Naver가 더 촘촘함.",
    docsUrl: "https://nominatim.org/release-docs/latest/api/Search/"
  },
  {
    id: "unsplash",
    nameKo: "Unsplash 이미지",
    nameEn: "Unsplash",
    category: "images",
    status: "usable_now",
    timing: "now",
    freeTier: "핫링크/시드 이미지 사용 중",
    signup: "프로덕션 대량 호출 시 Access Key 권장",
    koreaCoverage: "글로벌 스톡 (한국 특화 아님)",
    notes: "카탈로그·피드 시드 이미지에 사용 중.",
    docsUrl: "https://unsplash.com/developers"
  },
  {
    id: "foodsafety-sample",
    nameKo: "식품안전나라 샘플 OpenAPI",
    nameEn: "FoodSafetyKorea sample feed",
    category: "food",
    status: "usable_now",
    timing: "soon",
    freeTier: "sample 경로 키 없이 데모 가능 · 실서비스는 키 필요",
    signup: "실키: foodsafetykorea.go.kr 회원가입",
    koreaCoverage: "전국 위생·부적합·회수 정보",
    notes:
      "키 없이 `/api/sample/...` 응답 확인됨(스태프 페이지 라이브 프로브). 관광 피드 강화용보다는 신뢰/안전 배지용. 식당 발견용은 아님.",
    docsUrl: "https://www.foodsafetykorea.go.kr/api/howToUseApi.do"
  },
  {
    id: "visitkorea-eng",
    nameKo: "한국관광공사 TourAPI (영문 EngService2)",
    nameEn: "VisitKorea TourAPI English",
    category: "places",
    status: "needs_key",
    timing: "now",
    freeTier: "개발계정 일 ~1,000건 · 무료 · 자동승인(~30분)",
    signup: "data.go.kr 회원가입 → EngService2 활용신청 → serviceKey",
    koreaCoverage: "전국 관광지·숙소·행사·이미지 (~8만 영문 항목)",
    notes:
      "인바운드(영문)에 최적. searchFestival2 / areaBasedList2 / locationBasedList2. 데모 키 없음 — 실제 serviceKey 필수. 운영계정은 사례 등록·승인.",
    docsUrl: "https://www.data.go.kr/en/data/15101753/openapi.do",
    envHint: "DATA_GO_KR_SERVICE_KEY (또는 TOUR_API_KEY)"
  },
  {
    id: "visitkorea-kor",
    nameKo: "한국관광공사 TourAPI (국문 KorService2)",
    nameEn: "VisitKorea TourAPI Korean",
    category: "events",
    status: "needs_key",
    timing: "soon",
    freeTier: "개발계정 일 ~1,000건 · 무료",
    signup: "data.go.kr · KorService2 활용신청",
    koreaCoverage: "전국 (~26만 국문 항목) · 축제/행사 포함",
    notes: "국문 UI·로컬 에디토리얼용. 영문 서비스와 동일 키 체계(서비스별 신청).",
    docsUrl: "https://www.data.go.kr/en/data/15101578/openapi.do",
    envHint: "DATA_GO_KR_SERVICE_KEY"
  },
  {
    id: "kakao-local",
    nameKo: "카카오 로컬 (장소·음식 FD6)",
    nameEn: "Kakao Local API",
    category: "food",
    status: "needs_key",
    timing: "now",
    freeTier: "앱당 무료 쿼터(계정 첫 활성화 앱) · 초과 시 비즈월렛 과금",
    signup: "developers.kakao.com 앱 등록 → REST 키 → 카카오맵 활성화 ON",
    koreaCoverage: "한국 최고 수준 POI · 카테고리 FD6=음식점",
    notes:
      "키워드/카테고리 검색으로 식당·카페 즉시 보강 가능. 파트너 제휴 불필요. 맵 JS키와 REST키 구분.",
    docsUrl: "https://developers.kakao.com/docs/latest/en/local/dev-guide",
    envHint: "KAKAO_REST_API_KEY"
  },
  {
    id: "naver-maps",
    nameKo: "네이버 클라우드 Maps / Search",
    nameEn: "Naver Cloud Maps",
    category: "places",
    status: "needs_key",
    timing: "soon",
    freeTier: "대표(1차) 계정에만 무료 쿼터 · 비대표 계정은 과금 주의",
    signup: "NCP 콘솔 → AI·NAVER API Application · Client ID/Secret",
    koreaCoverage: "전국 · 검색·지오코딩 강점",
    notes: "한국 검색 UX 우수. 대표계정 확인 필수. Kakao와 중복 시 하나는 충분.",
    docsUrl: "https://guide.ncloud-docs.com/docs/en/maps-overview",
    envHint: "NAVER_MAPS_CLIENT_ID / NAVER_MAPS_CLIENT_SECRET"
  },
  {
    id: "google-places",
    nameKo: "Google Places (New)",
    nameEn: "Google Places API",
    category: "places",
    status: "needs_key",
    timing: "later",
    freeTier: "SKU당 월 무료 호출(Essentials ~10k 등) · 결제 수단 등록 필요",
    signup: "Google Cloud 프로젝트 · Places API (New) 활성화 · API key",
    koreaCoverage:
      "맵/지오코딩 가능 · KR에서 자동차 경로·트래픽 레이어 등 제한(로컬 규제)",
    notes:
      "인바운드 익숙한 브랜드이나 한국 길찾기·POI 밀도는 Kakao/Naver가 유리. 비용·약관 부담으로 후순위.",
    docsUrl: "https://developers.google.com/maps/documentation/places/web-service/op-overview",
    envHint: "GOOGLE_MAPS_API_KEY"
  },
  {
    id: "seoul-opendata",
    nameKo: "서울 열린데이터광장",
    nameEn: "Seoul Open Data Plaza",
    category: "food",
    status: "needs_key",
    timing: "soon",
    freeTier: "무료 · 서비스별 일 호출 한도(예: 실시간 지하철 1,000회/일)",
    signup: "data.seoul.go.kr 인증키 신청",
    koreaCoverage: "서울 한정 · 일반음식점 인허가·문화행사·지하철 등",
    notes:
      "음식점 인허가는 TM 좌표(EPSG:5174)라 WGS84 변환 필요. 문화행사(축제) 피드에 유용.",
    docsUrl: "https://data.seoul.go.kr/together/guide/useGuide.do",
    envHint: "SEOUL_OPEN_API_KEY"
  },
  {
    id: "seoul-food-tourism",
    nameKo: "서울 음식관광 OpenAPI (Redtable)",
    nameEn: "Seoul food-tourism API",
    category: "food",
    status: "needs_key",
    timing: "soon",
    freeTier: "공공·시 연계 · serviceKey 필요",
    signup: "가이드/시 연계 키 (seoul.openapi.redtable.global)",
    koreaCoverage: "서울 음식관광 DB · 메뉴 다국어(한/영/중/일)",
    notes: "인바운드 메뉴 설명에 특히 가치. 키 확보 후 카카오 장소와 보완.",
    docsUrl: "https://seoul.openapi.redtable.global/front/docs/openAPI_docs_seoul.pdf",
    envHint: "SEOUL_FOOD_TOURISM_KEY"
  },
  {
    id: "mfds-hygiene",
    nameKo: "식약처 위생등급 / 식품안전나라",
    nameEn: "MFDS hygiene grade APIs",
    category: "food",
    status: "needs_key",
    timing: "later",
    freeTier: "무료 · 기관 정책 트래픽",
    signup: "식품안전나라 또는 data.go.kr 활용신청",
    koreaCoverage: "전국 위생등급·회수 정보",
    notes: "식당 '안심' 배지용. 발견(discovery) API는 아님.",
    docsUrl: "https://www.data.go.kr/data/15060883/openapi.do",
    envHint: "FOODSAFETYKOREA_API_KEY"
  },
  {
    id: "tago",
    nameKo: "TAGO 대중교통 (국토부)",
    nameEn: "TAGO national transit",
    category: "transit",
    status: "needs_key",
    timing: "now",
    freeTier: "개발 일 10,000건 · 무료 · 대부분 자동승인",
    signup: "data.go.kr TAGO 버스/지하철/고속버스 등 활용신청",
    koreaCoverage: "전국 버스·지하철·고속·시외·항공·해운 등",
    notes: "인바운드 이동 안내의 공공 기본축. 서울 지하철은 서울시 API와 병행 가능.",
    docsUrl: "https://www.data.go.kr/data/15098516/openapi.do",
    envHint: "DATA_GO_KR_SERVICE_KEY"
  },
  {
    id: "seoul-metro",
    nameKo: "서울시 실시간 지하철",
    nameEn: "Seoul realtime subway",
    category: "transit",
    status: "needs_key",
    timing: "soon",
    freeTier: "무료 · 일 호출 한도",
    signup: "data.seoul.go.kr 실시간 지하철 인증키",
    koreaCoverage: "수도권 지하철 실시간",
    notes: "도착정보 UX용. TAGO와 역할 분담.",
    docsUrl: "https://data.seoul.go.kr/together/mypage/actkeyMain.do",
    envHint: "SEOUL_SUBWAY_API_KEY"
  },
  {
    id: "kakao-mobility",
    nameKo: "카카오모빌리티 대중교통 길찾기",
    nameEn: "Kakao Mobility multimodal transit",
    category: "transit",
    status: "partner",
    timing: "later",
    freeTier: "제휴(affiliate) 문서 기준 · REST 키 + 모빌리티 상품 권한",
    signup: "Kakao Developers + Kakao Mobility affiliate 온보딩",
    koreaCoverage: "한국 대중교통 통합 길찾기",
    notes: "품질 높으나 제휴/권한 장벽. TAGO+카카오맵으로 먼저 커버 후 검토.",
    docsUrl: "https://developers.kakaomobility.com/affiliate/publictransit/multimodal.html",
    envHint: "KAKAO_REST_API_KEY (+ mobility product)"
  },
  {
    id: "data-go-kr",
    nameKo: "공공데이터포털 (기타 데이터셋)",
    nameEn: "data.go.kr portal",
    category: "places",
    status: "needs_key",
    timing: "soon",
    freeTier: "대부분 무료 · 서비스별 트래픽",
    signup: "단일 serviceKey로 다수 API 신청",
    koreaCoverage: "전국 공공 데이터 허브",
    notes: "TourAPI·TAGO·위생 등 키 발급 창구. 먼저 EngService2+TAGO 신청 권장.",
    docsUrl: "https://www.data.go.kr/",
    envHint: "DATA_GO_KR_SERVICE_KEY"
  }
];

export function getKoreaApisByStatus(status: KoreaApiStatus) {
  return KOREA_APIS.filter((a) => a.status === status);
}

export function getKoreaApiTopPicks() {
  return KOREA_API_TOP_PICKS.map((id) => KOREA_APIS.find((a) => a.id === id)!).filter(Boolean);
}

/** Keyless sample probe — proves one Korea public API responds without signup. */
export async function probeFoodSafetySample(): Promise<{
  ok: boolean;
  totalCount: string | null;
  preview: string[];
  error?: string;
}> {
  try {
    const res = await fetch(
      "https://openapi.foodsafetykorea.go.kr/api/sample/I2620/json/1/3",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return { ok: false, totalCount: null, preview: [], error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as {
      I2620?: { total_count?: string; row?: { PRDTNM?: string; ADDR?: string; TEST_ITMNM?: string }[] };
    };
    const rows = data.I2620?.row ?? [];
    return {
      ok: true,
      totalCount: data.I2620?.total_count ?? null,
      preview: rows.map(
        (r) => `${r.PRDTNM ?? "item"} · ${r.ADDR ?? ""} · ${r.TEST_ITMNM ?? ""}`.trim()
      )
    };
  } catch (e) {
    return {
      ok: false,
      totalCount: null,
      preview: [],
      error: e instanceof Error ? e.message : "fetch failed"
    };
  }
}

/** Optional VisitKorea festival peek when service key is configured. */
export async function fetchVisitKoreaFestivalsIfKeyed(limit = 5): Promise<{
  configured: boolean;
  ok: boolean;
  items: { title: string; addr: string; start: string }[];
  error?: string;
}> {
  const key =
    process.env.DATA_GO_KR_SERVICE_KEY?.trim() || process.env.TOUR_API_KEY?.trim() || "";
  if (!key) {
    return { configured: false, ok: false, items: [] };
  }

  try {
    const start = new Date();
    const y = start.getFullYear();
    const m = String(start.getMonth() + 1).padStart(2, "0");
    const d = String(start.getDate()).padStart(2, "0");
    const url = new URL("https://apis.data.go.kr/B551011/EngService2/searchFestival2");
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("MobileOS", "ETC");
    url.searchParams.set("MobileApp", "Tourink");
    url.searchParams.set("_type", "json");
    url.searchParams.set("eventStartDate", `${y}${m}${d}`);
    url.searchParams.set("numOfRows", String(limit));
    url.searchParams.set("pageNo", "1");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) {
      return { configured: true, ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const json = (await res.json()) as {
      response?: {
        body?: {
          items?: {
            item?:
              | { title?: string; addr1?: string; eventstartdate?: string }
              | { title?: string; addr1?: string; eventstartdate?: string }[];
          };
        };
        header?: { resultCode?: string; resultMsg?: string };
      };
      OpenAPI_ServiceResponse?: { cmmMsgHeader?: { returnAuthMsg?: string } };
    };

    if (json.OpenAPI_ServiceResponse?.cmmMsgHeader?.returnAuthMsg) {
      return {
        configured: true,
        ok: false,
        items: [],
        error: json.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg
      };
    }

    const raw = json.response?.body?.items?.item;
    const list = !raw ? [] : Array.isArray(raw) ? raw : [raw];
    return {
      configured: true,
      ok: true,
      items: list.map((it) => ({
        title: it.title ?? "(no title)",
        addr: it.addr1 ?? "",
        start: it.eventstartdate ?? ""
      }))
    };
  } catch (e) {
    return {
      configured: true,
      ok: false,
      items: [],
      error: e instanceof Error ? e.message : "fetch failed"
    };
  }
}
