# Tourink 브랜드명 조사 메모

조사일: 2026-09-08 (팔로업: 유지 vs 리네임 재검토)  
범위: 한국 여행·외국인향 **피드 중심** 커뮤니티(인스타형 피드 + 행아웃 + 가이드).  
방법: 경쟁/인접 서비스 웹 조사, 후보 발음·신호·유니크니스 평가, DNS/RDAP 도메인 신호, Google/USPTO/WIPO **퀵 체크**, 스타트업 리네임 가이드라인 조사(법적 클리어런스 아님).

> **면책:** 도메인·상표는 등록 직전에 변호사/공식 DB로 재확인 필요. RDAP `404` = *likely available* 신호일 뿐, 구매·예약하지 않음.  
> PR: [#17](https://github.com/leeboklee/tourink/pull/17) · branch `cursor/brand-name-research-7c85`

---

## 결론 (개정)

**지금은 안 바꾸는 게 낫다 — Tourink 유지.**  
이름은 불완전해도 **딜브레이커가 아니고**, early 단계에선 리네임이 제품 배송·유저 대화보다 주의력을 뺏는다. Hangukly 등은 “나중에 바꿀 때 쓸 후보”로만 보관.

| 선택 | 판정 |
| --- | --- |
| **지금 Tourink 유지** | **권장.** 법적/평판 위기 없음, 발음 가능, opaque travel 브랜드와 같은 패턴 |
| Hangukly 등 리네임 | **지금은 비권장.** 조건 충족 시에만 재검토(아래) |

**나중에 리네임을 검토할 조건 (모두 충족 시에만):**
1. PMF·리텐션이 보이고, 이름이 **실제 CAC/소개 마찰**로 잡힐 때  
2. `hangukly.com`(또는 확정 후보) **확보 + KIPO/USPTO/WIPO 풀 클리어**  
3. 리다이렉트·소셜·스토어·코드 문자열을 한 스프린트에 끝낼 여유  
4. “Tour-in-K”가 유저 인터뷰에서 **반복적으로** 혼란을 줄 때(현재는 가설)

---

## A. 왜 “안 하는 게 낫나” — early 리네임 비용

리네임은 이름 바꾸기가 아니라 **인프라·SEO·인지 리셋**이다.

| 영역 | 비용 / 리스크 |
| --- | --- |
| **도메인** | 신규 `.com`/`.app` 확보, 구 도메인 리다이렉트, 이메일·쿠키·OAuth 콜백 |
| **Vercel / GitHub** | 프로젝트·환경변수·배포 URL·repo/org 표시명, CI secrets, 문서·README 일괄 |
| **앱스토어 (예정)** | 리스팅 이름·키워드 재인덱싱, 일시적 랭킹 하락(가이드상 수 주~수 개월 회복 가능), 리뷰/브랜드 검색 단절 |
| **SEO** | 백링크·브랜드 쿼리·소셜 멘션 이전; “Tourink” 검색 자산 리셋 |
| **유저 혼란** | 북마크·카톡 공유·“그 앱 뭐였지?” — early라도 이미 live-ish면 비용 존재 |
| **멘탈 로드** | 로고·카피·법률·핸들 확보 토론이 **피드/행아웃/가이드 배송**을 밀어냄 |

YC식 우선순위: early에는 *make something people want* / talk to users가 병목이지, 브랜드 폴리싱이 아니다. 브랜딩 가이드도 PMF 전에는 **minimum viable brand**로 충분하고, 무거운 리브랜드는 스케일·펀드 단계에 맞추라고 본다.

**Naming debt 관점:** 약한 이름의 “이자”는 매출·팀이 커질수록 커진다. 지금은 이자 ≪ 리네임 원금 + 기회비용 → **크로스오버 전**이면 유지가 합리적.

---

## B. 언제 바꾸고 / 언제 유지하나 (가이드 요약)

**유지가 맞는 경우**
- 법적 취약·욕설·심각한 오해·평판 위기가 **아님**
- 발음·철자가 학습 가능하고, 제품이 아직 흔들림
- 예산·주의력이 제품에 묶여 있음
- 이름 불만이 **창업자 지루함**에 가깝고, 고객은 익숙함(Spellbrand: founder boredom ≠ rename 사유)

**바꿀 때**
- 상표 분쟁·강제 변경
- 피벗 후 이름이 사업을 **적극적으로 부정**
- 측정 가능한 소개/검색 마찰이 크고, 리네임 ROI가 명확
- M&A·글로벌 스케일에서 이름이 채널을 막음

Tourink는 현재 **“바꿀 사유” 체크리스트에 거의 안 걸림** → 유지.

---

## C. “Tour in K” 오독 — 언어·UX 퀵 테이크

걱정: 사람들이 Tourink를 **Tour-in-K**(한국에서 투어)로 읽는다.

| 청자 | 실제 반응 (추정·관측 가능 패턴) |
| --- | --- |
| **외국인 (영어 L1/L2)** | 철자 `Tourink`는 보통 **한 단어 브랜드**(TOOR-ink / TOUR-ink)로 읽힘. “Tour in K”는 **의도적으로 분해**하거나 팀이 설명할 때 나오는 더블리드. 콜드 청취만으로 K=Korea를 확신하진 않음 → **딜브레이커라기보다 ‘의미 불투명’** |
| **한국인 / 한국 거주자** | **투어잉크**로 음차. “Tour-in-K” 영어 말장난은 팀·마케팅에만 보임. 한글 UI·‘Korea’ 카피가 있으면 오독 이슈 거의 없음 |
| **UX** | 히어로에 “Korea travel feed…”만 박아도 이름 모호성은 **1초 보정**됨. Creatrip도 이름만으론 Korea가 약하고 태그라인으로 보완 |

**판정:** “Tour-in-K로 읽힐까”는 **기능적 결함이 아니라 스토리텔링 옵션**(원하면 살리고, 싫으면 Tour+ink만 밀면 됨). 리네임 사유로 쓰기엔 약함. 검증이 필요하면 5–10명 외국인에게 “이 앱 이름만 듣고 뭐 하는 앱 같아?”를 물어보면 충분 — 지금 가설만으로 리네임하지 말 것.

---

## D. 경쟁 현실: opaque 이름으로도 이긴다

| 브랜드 | 이름 투명도 | 비고 |
| --- | --- | --- |
| **Klook** | Keep + looking → 이름만으론 여행 불명 | 제품·공급·마케팅으로 이김 |
| **Trazy** | 조어 | 한국 액티비티 = 카테고리로 학습 |
| **Creatrip** | Create+trip, Korea 약함 | “Korea Your Way” 카피로 보정 |
| **Airbnb / Slack** | 기원 스토리는 나중에야 의미 | 제품이 이름을 정의 |

교훈: **한국 신호가 약한 여행 앱은 흔하고**, 승패는 피드 품질·리텐션·배포다. Tourink도 같은 리그에 서 있음.

---

## 1. 경쟁·인접 네이밍 지형

### 글로벌 / 아시아 OTA·플래너
| 이름 | 포지션 | 네이밍 교훈 |
| --- | --- | --- |
| **Klook** | 액티비티 예약 | 짧고 발음 쉬움, 지역 신호 약함 → 글로벌 스케일용 |
| **KKday** | 로컬 체험 | K + day, 아시아 톤 |
| **Wanderlog** | 일정 플래너 | Wander + log, 여행 동사 + 기록 |
| **Trip.me / TripIt** | 여행 연결·정리 | Trip 접두 흔함 |
| **GetYourGuide / Viator** | 투어 마켓 | 기능 설명형 |

### 한국 특화 (외국인·관광)
| 이름 | 포지션 | 교훈 |
| --- | --- | --- |
| **Creatrip** | 외국인 K-플랫폼 (가이드·예약·커머스) | Create + trip, 한국 신호는 약하나 “Korea Your Way” 태그라인으로 보완 |
| **Trazy** | 한국 액티비티 샵 | 조어, 한국=카테고리로 포지셔닝 |
| **VisitKorea** | 공공 관광 | 직설, 브랜드라기보다 기관 |
| **Seollem** | 솔로 한국 여행 가이드 | 한국어 감성 조어 |
| **KOPLE** | 한국 여행 커뮤니티·소그룹 트립 | 커뮤니티 톤, Kakao/WhatsApp 연동 |
| **Trip2Gather / WETRAVER / Nomax** | 동행·버디 | 연결/모임 신호 |
| **Connect KOR / Kori** | 외국인 생활·만남 앱 | KOR / Kori = 한국 단축 신호 |

### 로컬 소셜 (한국인 중심, 인접)
**소모임(Somoim), 문토(Munto), 프립(Frip), Meetup, InterNations, Facebook Expats in Korea** — “모임/취미” 네이밍이 강하고, 외국인향 피드 앱 자리는 아직 비어 있음.

**포지션:** OTA도 순수 hangout만도 아닌 **피드 + 가이드 + 행아웃**. 이름보다 **제품 차별화**가 병목.

---

## 2. Tourink 유지 장단 (개정)

| | |
| --- | --- |
| **Pros** | live-ish 연속성; 리네임 기회비용 회피; Tour+ink / 투어잉크; 발음·철자 학습 가능; 대형 TM 퀵체크에서 뚜렷한 live mark 미발견; opaque travel 브랜드와 동일 패턴; `tourink.app` likely available |
| **Cons** | 콜드에 한국 신호 약함; Tour → OTA 연상 가능; ink 설명 필요; Tourlink/Tourinx와 청각 유사; `tourink.com` DNS·404(소유 확인) |
| **유지 시 보정** | 히어로·스토어 서브타이틀에 **Korea**를 브랜드급으로; ASO 키워드에 korea/seoul/expat; “Tour-in-K”는 **강제하지 말고** 선택 스토리로 |

---

## 3. 후보 랭킹 (나중에 쓸 때)

> 아래는 **지금 바꾸라는 뜻이 아님.** 향후 리네임 시 shortlist.

점수 축: 영어 발음 · 한국 신호 · 커뮤니티/피드 톤 · 유니크 · 도메인 가능성 · 상표 리스크(퀵체크).

| 순위 | 이름 | 발음 | 한국 | 피드/커뮤니티 | 유니크 | 도메인 신호 | TM 퀵체크 | 한줄 |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Hangukly** | HAN-gook-lee | 강 | 앱다운 -ly | 매우 높음 | `.com`/`.app` likely free | exact hit 거의 없음 | 나중에 1순위 후보 |
| 2 | **SeoulReel** | SOUL-reel | 서울 강·전국 약 | 릴/피드 강 | 높음 | likely free | clean | 피드 핏, 서울 편중 |
| 3 | **Korespot** | KOR-spot | 중강 | 스팟 발견 | 높음 | likely free | clean | 장소 디스커버리 |
| 4 | **WanderKR** | WAN-der KR | KR 명확 | 여행 커뮤니티 | 중 | likely free | Wander Korea 인접 | Wanderlog 연상 |
| 5 | **Korenest** | kor-NEST | 중강 | 둥지=커뮤니티 | 중 | likely free | 약충돌 | 따뜻한 톤 |
| 6 | **Korfeed** | KOR-feed | 중강 | feed 직설 | 중 | likely free | 사료·닉 잡음 | 브랜드성↓ |
| 7 | **Seouldot** | SOUL-dot | 서울 | 테크/앱 | 높음 | likely free | clean | 의미 약 |
| 8 | **HangoutKR** | hang-out KR | KR | hangout 직설 | 중하 | likely free | 뮤직 태그 | 데이팅 연상 |
| 9 | **Koreko** | ko-RE-ko | 중 | 귀여움 | 중 | `.com` taken | 미확인 | .com 불리 |
| 10 | **Tripink** | TRIP-ink | 약 | ink 계승 | 중 | `.com` taken | — | soft rename |
| 11 | **GoHanguk** | go HAN-gook | 강 | CTA형 | 중하 | likely free | Go! Go! Hanguk | 충돌 |
| 12 | **InKorea** | in Korea | 매우 강 | 약 | 낮음 | `.com` taken | 서술표 | 부제용 |

### Top 3 도메인 신호 (구매하지 않음)

| 이름 | `.com` | `.app` | 비고 |
| --- | --- | --- | --- |
| Hangukly | RDAP 404 → likely available | likely available | 웹 exact 브랜드 거의 없음 |
| SeoulReel | likely available | likely available | 서울 한정 리스크 |
| Korespot | likely available | likely available | spot 접미사 혼잡 |

**Taken / 주의:** `inkorea.com`, `tripink.com`, `korely.com`, `seoully.com`, `seouly.com`, `tourly.com`, `tourkr.com`, `mykorea.com`.

---

## 4. Hangukly (나중용 메모)

- Hanguk + -ly; 한글 표기 통일 필요(한국리 등)
- 한국 신호·앱 톤은 Tourink보다 강함 → **스케일 후 rename shortlist 1번**
- 지금은 도메인 사재기·코드 리네임 **하지 않음** (확정·법률 클리어 전)

---

## 5. 상표·도메인 주의

- Google + RDAP/DNS + USPTO/WIPO UI 퀵룩 수준. KIPO 전부·유사 상표 미조사.
- 서술명(`InKorea`, `Korfeed`)은 등록·권리 약할 수 있음.
- 유사음: Tourink↔Tourlink/Tourinx; WanderKR↔Wanderlog; GoHanguk↔Go! Go! Hanguk.
- “likely available” ≠ 보장. **구매하지 말 것.**

---

## 6. 실행 제안 (개정)

1. **제품에 집중.** 피드·행아웃·가이드 배송; 브랜드 토론은 이 문서로 종결.
2. **유지 보정만:** 랜딩/앱에 Korea를 크게; 스토어·SEO에 korea 키워드; Tour-in-K는 선택 스토리.
3. **유저 5–10명**에게 이름만으로 연상 테스트(선택). 반복 혼란 없으면 리네임 안 함.
4. 리네임은 결론의 **4조건** 충족 시에만; 그때 Hangukly shortlist + 풀 법률·도메인.

---

*Updated for PR #17 — verdict flipped to keep Tourink for now.*
