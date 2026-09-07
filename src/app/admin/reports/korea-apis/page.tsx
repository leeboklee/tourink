import Link from "next/link";
import {
  fetchVisitKoreaFestivalsIfKeyed,
  getKoreaApiTopPicks,
  KOREA_API_RESEARCH_UPDATED,
  KOREA_API_STATUS_META,
  KOREA_APIS,
  probeFoodSafetySample,
  type KoreaApiEntry,
  type KoreaApiStatus
} from "@/lib/korea-apis";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Korea APIs · Admin reports"
};

const CATEGORY_KO: Record<KoreaApiEntry["category"], string> = {
  places: "장소·POI",
  food: "음식·위생",
  transit: "교통",
  weather: "날씨",
  events: "행사·축제",
  images: "이미지"
};

function StatusBadge({ status }: { status: KoreaApiStatus }) {
  const meta = KOREA_API_STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      {meta.labelKo}
      <span className="ml-1 opacity-60">· {meta.labelEn}</span>
    </span>
  );
}

function TimingBadge({ timing }: { timing: KoreaApiEntry["timing"] }) {
  const label =
    timing === "now" ? "지금 연결" : timing === "soon" ? "곧" : "나중";
  return (
    <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/45">
      {label}
    </span>
  );
}

function ApiCard({ api }: { api: KoreaApiEntry }) {
  return (
    <article className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-paper">{api.nameKo}</h3>
          <p className="text-xs text-white/45">{api.nameEn}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TimingBadge timing={api.timing} />
          <StatusBadge status={api.status} />
        </div>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-wide text-white/35">
        {CATEGORY_KO[api.category]}
      </p>
      <dl className="mt-3 space-y-2 text-sm text-white/65">
        <div>
          <dt className="text-[11px] uppercase text-white/35">무료·쿼터</dt>
          <dd>{api.freeTier}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-white/35">가입·키</dt>
          <dd>{api.signup}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-white/35">한국 커버리지</dt>
          <dd>{api.koreaCoverage}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-white/35">노트</dt>
          <dd className="leading-relaxed">{api.notes}</dd>
        </div>
        {api.envHint ? (
          <div>
            <dt className="text-[11px] uppercase text-white/35">Env</dt>
            <dd className="font-mono text-xs text-neon-cyan/80">{api.envHint}</dd>
          </div>
        ) : null}
      </dl>
      <a
        href={api.docsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-xs text-neon-cyan hover:underline"
      >
        Docs →
      </a>
    </article>
  );
}

export default async function KoreaApisReportPage() {
  const [sample, festivals] = await Promise.all([
    probeFoodSafetySample(),
    fetchVisitKoreaFestivalsIfKeyed(4)
  ]);
  const top = getKoreaApiTopPicks();
  const groups: { status: KoreaApiStatus; title: string }[] = [
    { status: "usable_now", title: "지금 사용 가능 · Usable now" },
    { status: "needs_key", title: "키 발급 필요 · Needs key" },
    { status: "partner", title: "제휴·승인 · Partner" }
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-wide text-neon-cyan/80">
          monday.org · staff research
        </p>
        <h1 className="mt-1 font-display text-3xl text-paper md:text-4xl">
          한국 API 조사 · Korea APIs
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          인바운드 여행용 장소·음식·교통·날씨·축제 공개/민간 API 조사. 상태:{" "}
          <span className="text-white/80">지금 사용 가능</span> /{" "}
          <span className="text-white/80">키 발급 필요</span> /{" "}
          <span className="text-white/80">제휴</span>. 연구일 {KOREA_API_RESEARCH_UPDATED}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href="/admin/reports" className="text-neon-cyan hover:underline">
            ← Result reports
          </Link>
          <a href="#top-picks" className="text-white/45 hover:text-paper">
            Top 3
          </a>
          <a href="#catalog" className="text-white/45 hover:text-paper">
            Full catalog
          </a>
          <a href="#live-probe" className="text-white/45 hover:text-paper">
            Live probe
          </a>
        </div>
      </header>

      <section
        id="top-picks"
        className="scroll-mt-6 rounded-xl border border-neon-cyan/25 bg-neon-cyan/5 p-5"
      >
        <h2 className="font-display text-2xl text-paper">결론 · Top 3 연결 후보</h2>
        <ol className="mt-4 space-y-3">
          {top.map((api, i) => (
            <li key={api.id} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="font-display text-lg text-neon-cyan">{i + 1}.</span>
              <span className="font-semibold text-paper">{api.nameKo}</span>
              <StatusBadge status={api.status} />
              <span className="text-white/50">— {api.notes}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-white/45">
          날씨(Open-Meteo)·Nominatim은 이미 라이브. 다음 키 발급 우선순위: VisitKorea 영문 →
          Kakao Local(FD6) → TAGO.
        </p>
      </section>

      <section id="live-probe" className="scroll-mt-6 space-y-4">
        <h2 className="font-display text-2xl text-paper">라이브 프로브 · Keyless check</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-paper">식품안전나라 sample</h3>
              <span
                className={`text-[10px] uppercase ${sample.ok ? "text-neon-cyan" : "text-neon-amber"}`}
              >
                {sample.ok ? "ok · no key" : "failed"}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/50">
              키 없이 응답 가능한 공개 샘플. 관광 피드용은 아니고 스태프 검증용.
            </p>
            {sample.ok ? (
              <ul className="mt-3 space-y-1 text-xs text-white/65">
                <li className="text-white/40">total_count · {sample.totalCount}</li>
                {sample.preview.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-neon-amber">{sample.error}</p>
            )}
          </article>

          <article className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-paper">VisitKorea EngService2</h3>
              <span
                className={`text-[10px] uppercase ${
                  festivals.configured
                    ? festivals.ok
                      ? "text-neon-cyan"
                      : "text-neon-amber"
                    : "text-white/35"
                }`}
              >
                {festivals.configured
                  ? festivals.ok
                    ? "keyed · ok"
                    : "keyed · error"
                  : "needs key"}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/50">
              <code className="text-white/60">DATA_GO_KR_SERVICE_KEY</code> 또는{" "}
              <code className="text-white/60">TOUR_API_KEY</code> 설정 시 축제 미리보기.
              데모 키는 포털에서 발급되지 않음.
            </p>
            {festivals.configured && festivals.ok ? (
              <ul className="mt-3 space-y-1 text-xs text-white/65">
                {festivals.items.map((it) => (
                  <li key={`${it.title}-${it.start}`}>
                    · {it.title}
                    {it.addr ? ` · ${it.addr}` : ""}
                  </li>
                ))}
              </ul>
            ) : festivals.configured ? (
              <p className="mt-2 text-xs text-neon-amber">{festivals.error}</p>
            ) : (
              <p className="mt-2 text-xs text-white/40">
                data.go.kr에서 EngService2 활용신청 후 .env에 키를 넣으면 여기가 채워집니다.
              </p>
            )}
          </article>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-6 space-y-8">
        <h2 className="font-display text-2xl text-paper">전체 목록 · Catalog</h2>
        {groups.map((g) => {
          const items = KOREA_APIS.filter((a) => a.status === g.status);
          return (
            <div key={g.status} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                {g.title}{" "}
                <span className="text-white/30">({items.length})</span>
              </h3>
              <div className="grid gap-3 lg:grid-cols-2">
                {items.map((api) => (
                  <ApiCard key={api.id} api={api} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
