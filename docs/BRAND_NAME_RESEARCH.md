# Tourink 브랜드명 조사 메모

조사일: 2026-09-08 · **개정: 2026-09-10** (의미 합성 + Google-pass 점수표)  
범위: 한국 여행·외국인향 **피드 중심** 커뮤니티(인스타형 피드 + 행아웃 + 포럼/가이드).  
방법: 후보 조어 → Google exact / App Store·Play 검색 → 인접 브랜드·LLC 충돌 → Verisign RDAP(`.com`)·DNS → USPTO/WIPO **퀵 체크**(법적 클리어런스 아님).

> **면책:** 도메인·상표는 등록 직전 변호사 + KIPO/USPTO/WIPO 풀 서치 필수. RDAP `404` = *likely available* 신호일 뿐, **구매·예약하지 않음.**  
> PR: [#17](https://github.com/leeboklee/tourink/pull/17) · branch `cursor/brand-name-research-7c85`

---

## 결론 (2026-09-10 · 비판 반영 · 의미 합성 트랙)

| 결정 | 내용 |
| --- | --- |
| **라이브** | **Tourink 유지** |
| 비판 | Seoul / Kore·Han 과몰입 · `voy`/`ya`/`oya` · 무의미 조어 → 반영 |
| **현재 Top** | 의미 합성 + Google exact 통과 — **Hangfeed** #1 · Huddletrek · Huddlepath … |
| **점수표** | [`BRAND_NAME_SCORED_LIST.md`](./BRAND_NAME_SCORED_LIST.md) |
| **문서** | [`BRAND_NAME_ADVERSARIAL_PASS.md`](./BRAND_NAME_ADVERSARIAL_PASS.md) |

Korea는 **히어로/ASO**로 싣고, 브랜드명은 제품을 가두지 않는 의미 합성을 기본.

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

1. **Tourink 유지** — 한국 과몰입 비판을 받아들이면 지금 이름도 방어 가능.  
2. 리네임 시 기본 **Track A: Hangvoy → Feedvoy → Peervoy**.  
3. “Korea 전문”을 이름에 새기려면 Track B: Koremora ….  
4. Seoul\*/Kore\* 혼용 피치 금지 — 트랙 하나 고르기.  
5. 상세: `BRAND_NAME_ADVERSARIAL_PASS.md`

---

*Updated for PR #17 — dual track Opaque(Hangvoy) vs Korea(Koremora); Tourink stays live.*
