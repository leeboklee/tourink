# Tourink content & media license rules

These rules apply to **all** seeded mock data, Official AI guides, admin CMS uploads, and marketing assets.

## Allowed sources only

| Source | License field value | Attribution required |
|--------|---------------------|----------------------|
| [Unsplash](https://unsplash.com) | `unsplash` | Yes — `Photo by {Name} on Unsplash` (+ link when UI allows) |
| [Pexels](https://www.pexels.com) | `pexels` | Yes — Pexels photographer credit |
| DiceBear / Boring Avatars / other generators under CC0 | `dicebear-cc0` or `cc0` | Yes — e.g. `DiceBear bottts-neutral · CC0 1.0` |
| Tourink-owned originals (team photos, commissioned, in-house AI under our rights) | `owned` | Optional internal note |

## Banned

- Scraped social / web faces (Google Images, Instagram, randomuser.me “as real person”, etc.)
- Stock portraits used as **Official AI guide** identity without a clear license + model release path — **prefer DiceBear CC0** for AI personas
- Any URL with `license=unknown` or empty `imageLicense` / `imageAttribution` in CMS before publish
- Compiling Unsplash/Pexels into a competing stock library (violates their terms)

## Official AI guides

- **Handles stay stable** (`mina.seoul`, `busan.wave`, `jeju.trail`, `market.finder`, `local.yuna`) so `/u/[handle]` links do not break.
- **Display names** use guide branding: `Guide Mina · Seoul`, `Guide Jun · Busan`, …
- **Avatars** must be generated (DiceBear CC0) or Tourink-owned — not Unsplash/stock human portraits used as a fake identity.

## CMS / data model

Every media row that stores an image URL must also store:

- `imageLicense` — one of: `unsplash` | `pexels` | `cc0` | `dicebear-cc0` | `owned`
- `imageAttribution` — human-readable credit string

Applies to: AI profiles (avatar), feed posts, hotels, experiences, routes, nightlife.

Helpers: `src/data/media-license.ts` (`dicebearAvatar`, `licenseFromUrl`, `unsplashMedia`).

## Agent / PR checklist

1. New image URL? Set `imageLicense` + `imageAttribution` in the same change.
2. New Official AI? DiceBear (or owned) avatar + guide-style display name; do not rename handles without redirects.
3. Prefer place / food / landscape Unsplash shots for feed posts — not portrait-as-identity for AI accounts.
