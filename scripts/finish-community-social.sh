#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> root: $ROOT"

if [[ -f cursorignore && ! -f .cursorignore ]]; then
  mv cursorignore .cursorignore
  echo "==> renamed cursorignore -> .cursorignore"
elif [[ -f .cursorignore ]]; then
  echo "==> .cursorignore present"
else
  cat > .cursorignore <<'EOF'
node_modules/
.next/
out/
build/
dist/
coverage/
.turbo/
*.min.js
*.min.css
package-lock.json
pnpm-lock.yaml
yarn.lock
.env*
!.env.example
EOF
  echo "==> wrote .cursorignore"
fi

echo "==> npm install"
npm install

echo "==> npm run build"
npm run build

if [[ ! -d .git ]]; then
  git init
  echo "==> git init"
fi

git checkout -B feature/community-social

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "feat: ship Korea travel community social surfaces"
  echo "==> committed"
else
  echo "==> nothing to commit"
fi

echo "==> HEAD: $(git rev-parse HEAD)"
echo "==> branch: $(git branch --show-current)"
git status -sb
git remote -v || true
echo "==> DONE"
