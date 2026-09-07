#!/usr/bin/env bash
# Re-seed catalog + official AI creators into the local/production DB.
set -euo pipefail
cd "$(dirname "$0")/.."
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
