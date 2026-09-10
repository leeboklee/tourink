# Tourink 브랜드명 조사 메모

조사일: 2026-09-08 · **개정: 2026-09-10** (고유·마케팅 가능 리네임 후보 확정)  
범위: 한국 여행·외국인향 **피드 중심** 커뮤니티(인스타형 피드 + 행아웃 + 포럼/가이드).  
방법: 후보 조어 → Google exact / App Store·Play 검색 → 인접 브랜드·LLC 충돌 → Verisign RDAP(`.com`)·DNS → USPTO/WIPO **퀵 체크**(법적 클리어런스 아님).

> **면책:** 도메인·상표는 등록 직전 변호사 + KIPO/USPTO/WIPO 풀 서치 필수. RDAP `404` = *likely available* 신호일 뿐, **구매·예약하지 않음.**  
> PR: [#17](https://github.com/leeboklee/tourink/pull/17) · branch `cursor/brand-name-research-7c85`

---

## 결론 (2026-09-10 · Top10 개정)

| 결정 | 내용 |
| --- | --- |
| **라이브 제품명** | **Tourink 유지** (코드·배포 리네임 안 함) |
| **최종 Top 10 보고서** | [`BRAND_NAME_TOP10_REPORT.md`](./BRAND_NAME_TOP10_REPORT.md) |
| **합성 1순위** | **Seouvoy** (Seoul + voyage) |
| **2–3** | **SeoulReel** · **Seoumora** |
| **탈락 핵심** | Hangukly · Tourlya · Seoulyn · Seouloop · Meetoya · **Seouvibe**(Seoul Vibe 법인들) · Meetkor · Seouza |

**Top 10:** Seouvoy · SeoulReel · Seoumora · Seoubit · Seounova · Seouzen · Korenest · Seouvia · Seoufy · Korespot  

점수표 A(핏) / B(유니크·리스크) / C(실행) + Composite → 상세는 Top10 보고서.

---

## B. 탈락·주의 목록 (충돌 증거)

| 후보 | 사유 |
| --- | --- |
| **Hangukly** | **Hanguly**(한국어 학습 앱)와 철자·발음 과근접 |
| **Tourlya** | **Tourly**(오디오 가이드·다수 여행 앱/회사)와 청각 충돌 |
| **Seoulyn** | Florida **SEOULYN LLC** Active (sunbiz) — 고유 법인명 충돌 |
| **Seouloop** | **Seoullo**(외국인 서울 관광 앱)와 철자·발음 근접 |
| **Meetoya** | **MeetYou**(美柚)와 철자·발음 근접 |
| **Seouvibe** | **The Seoul Vibe Ltd** · **Seoul Vibe LLC** · **VIBE Seoul GmbH** |
| **Meetkor** | 화상회의 앱 |
| **Seouza** | **SEOuza** SEO 브랜드 |
| **Hanvia** | **Hanvia Studio**(브랜딩 회사) |
| **Seouora** | **Seoulora**(스토어) / **Seoura**(에이전시) / **Seaoura** 근접 |
| **Korelya / Korevia / Koravi / Koreel / Koreami / TripNuri / Inkorbit** | VC·물류·건설·미디어·퍼블리싱 등 기존 고유명 (이전 라운드) |
| **Tourink 리네임 강제** | 딜브레이커 아님 → 라이브는 유지, Top10 보고서로 후보 보관 |

---

## C. 라이브는 Tourink 유지 — 이유 (요약)

리네임 = 도메인·SEO·스토어·OAuth·인지 리셋. Early에는 피드/행아웃 배송이 병목.  
“Tour-in-K” 오독은 **스토리 옵션**이지 기능 결함 아님 → 히어로에 Korea 한 줄이면 보정.

**리네임 실행 조건 (모두 충족 시):**
1. PMF·리텐션 신호 + 이름이 실제 소개/검색 마찰로 측정될 때  
2. **Seouvoy**(또는 Top10 확정 후보) 도메인 + 풀 법률 클리어  
3. 리다이렉트·소셜·스토어·문자열을 한 스프린트에 끝낼 여유  
4. Tourink 혼란이 유저 인터뷰에서 **반복**될 때

---

## D. 경쟁 네이밍 지형 (참고)

| 유형 | 예 | 교훈 |
| --- | --- | --- |
| Opaque 글로벌 | Klook, Trazy, Creatrip | 이름만으로 Korea 안 보여도 태그라인·제품으로 이김 |
| 한국 직설 | VisitKorea, Connect KOR | 브랜드성↓, 서술표 리스크 |
| 커뮤니티/동행 | Nomax, KOPLE, SeoulTalk | hangout 신호 강함 — 피드+가이드 자리는 여유 |

Tourink/Seouvia 포지션: OTA도 순수 hangout만도 아닌 **피드 + 행아웃 + 가이드**.

---

## E. Tourink 유지 시 보정

- 랜딩/앱 히어로에 **Korea**를 브랜드급으로  
- ASO·SEO: korea / seoul / expat / hangout  
- “Tour-in-K”는 강제하지 말 것  
- 유저 5–10명 이름 연상 스모크 테스트(선택)

---

## F. 조사 로그 (2026-09-10)

| 체크 | Seouvia | Seoubit | Seoumora | Feedoya |
| --- | --- | --- | --- | --- |
| Google exact 고유브랜드 | 없음 | 없음 | 없음 | 없음 |
| Apple search | 0 results | (동일 패턴) | — | 0 |
| Play exact app | 없음 | 없음 | — | 없음 |
| `.com` RDAP | 404 | 404 | 404 | 404 |
| DNS A | NXDOMAIN | — | — | — |
| USPTO/WIPO API | UI 캡차·API 401 → **수동 풀서치 잔여** | 동 | 동 | 동 |
| 유사음 주의 | Soovia eSIM | — | — | Feeda / Feedy |

유사 USPTO 문자열(Seouvia 주변, exact 아님): SOLUVIA, SOVIA, SEOULVIOSYS 등 — 클래스·상품 다르면 충돌 아닐 수 있으나 **변호사 확인**.

---

## G. 실행 제안

1. **제품은 Tourink로 계속** — 이 PR에서 리네임 코드 변경 없음.  
2. 리네임 준비 시 **Seouvoy** → SeoulReel → Seoumora 순으로 도메인·핸들·법률 클리어.  
3. Seouvia는 Soovia 발음 테스트 통과 시에만 승격.  
4. Hangukly / Tourlya / Seoulyn / Seouvibe **재사용 금지**.  
5. 점수·Top10 상세: `docs/BRAND_NAME_TOP10_REPORT.md`

---

*Updated for PR #17 — Top10 locked (composite #1 Seouvoy; product stays Tourink until clearance).*
