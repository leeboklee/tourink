# Tourink

Korea travel feed for foreigners — Instagram-style discovery, plus routes, hotels, nightlife, hangouts, community, forum, and Klook-like experiences with persistent bookings.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Prisma + SQLite locally (Postgres / Supabase-ready via `DATABASE_URL`)
- Auth.js (NextAuth v5) — demo credentials + optional Google/GitHub
- REST Route Handlers for feed, social, search, bookings, notifications

## Setup

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open http://localhost:3000

Demo traveler: `sofia.mx` / `tourink-demo`

Staff Admin CMS: `/admin` — login `admin@tourink` / `tourink-admin` (override with `ADMIN_PASSWORD`). Roles: `ADMIN` or `STAFF` only.

Result reports (API integrations + AI Answers): `/admin/reports`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run db:setup` | generate + push schema + seed |
| `npm run db:seed` / `npm run seed:ai-creators` | reseeds catalog + official AI creators |
| `npm run build` | db sync + seed + production build |

## Production notes

- Set `AUTH_SECRET`, `NEXTAUTH_URL`, and a Postgres `DATABASE_URL` (Supabase) for durable hosting.
- Stripe: set `STRIPE_SECRET_KEY` to move bookings off the labeled **test payment** path.
- OAuth: set Google/GitHub client env vars to enable provider buttons.
- Hotels: availability uses `HotelProvider` (`src/lib/hotels`). Default `HOTEL_PROVIDER=mock`. After Expedia Rapid or Amadeus partner keys land, set `EXPEDIA_*` / `AMADEUS_*` and switch `HOTEL_PROVIDER`. Booking.com Demand API needs Managed Affiliate approval (not wired yet).
- Experiences: availability uses `ExperienceProvider` (`src/lib/experiences`). Default `EXPERIENCE_PROVIDER=mock`. After Klook / Viator / GetYourGuide partner keys land, set `KLOOK_*` / `VIATOR_*` / `GYG_*` and switch `EXPERIENCE_PROVIDER`. Nav stays visible — catalog is product-critical, not a soft-hide.
- Staff result reports: `/admin/reports` documents API adapter status + Official AI creator output for monday.org review.

## Product surfaces

Admin CMS (`/admin`) · Feed · My Page (Posts / Threads / Reels / Saved / About) · Search · Notifications · Experiences · Routes · Hotels · Nightlife · Hangouts · Community · Forum · Bookings
