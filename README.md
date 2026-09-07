# Tourink

Korea travel feed for foreigners — Instagram-style discovery, plus routes, nightlife, hangouts, community, and forum. Hotels & experiences stay Coming soon until partner API keys land.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Prisma + SQLite locally (Postgres / Supabase-ready via `DATABASE_URL`)
- Auth.js (NextAuth v5) — demo credentials + optional Google/GitHub
- REST Route Handlers for feed, social, search, bookings, notifications
- Free public APIs: Open-Meteo (weather), Nominatim (geo search), Unsplash imagery

## Setup

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open http://localhost:3000

Demo login: `sofia.mx` / `tourink-demo`

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
- Hotels / Experiences: `NEXT_PUBLIC_ENABLE_HOTELS` / `NEXT_PUBLIC_ENABLE_EXPERIENCES` default `false` (Coming soon). Auto-enable when `HOTEL_PROVIDER` / `EXPERIENCE_PROVIDER` + partner keys are set. See `/admin/reports`.

## Product surfaces

Feed (live weather) · My Page · Search (Nominatim geo) · Notifications · Routes · Nightlife · Hangouts · Community · Forum · Hotels / Experiences (Coming soon until partner keys) · Bookings (when enabled) · Staff Admin
