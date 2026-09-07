#!/usr/bin/env bash
set -euo pipefail
ROOT=/home/bok/projects/tourink
OUT="$ROOT/finish-out.txt"
cd "$ROOT"
{
  echo "==> continue finish $(date -Iseconds)"
  git status -sb || true
  echo "--- remotes ---"
  git remote -v || true
  echo "--- identity ---"
  echo "name=$(git config --get user.name || true)"
  echo "email=$(git config --get user.email || true)"
  echo "--- branch ---"
  git branch --show-current || true
  echo "--- ensuring branch ---"
  git checkout -B feature/community-social
  # Commit without updating git config — use env identity
  export GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-Tourink Bot}"
  export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-bokmuch@gmail.com}"
  export GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME:-Tourink Bot}"
  export GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL:-bokmuch@gmail.com}"
  if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    git add -A
    git commit -m "feat: ship Korea travel community social surfaces" || echo "COMMIT_FAILED"
  else
    echo "CLEAN_TREE_NO_COMMIT_NEEDED"
  fi
  echo "--- after commit ---"
  git rev-parse HEAD
  git status -sb
  git branch --show-current
  echo "--- push ---"
  if git remote get-url origin >/dev/null 2>&1; then
    if git push -u origin feature/community-social 2>&1; then
      echo "PUSH_OK"
      if command -v gh >/dev/null 2>&1; then
        EXISTING=$(gh pr list --head feature/community-social --json url --jq '.[0].url' 2>/dev/null || true)
        if [ -n "${EXISTING:-}" ]; then
          echo "PR_EXISTING=$EXISTING"
        else
          PR_URL=$(gh pr create --title "feat: Korea travel community social surfaces" --body "$(cat <<'EOF'
## Summary
- Ship community social surfaces (community, hangouts, nightlife, forum, profiles, posts)
- Production build verified on Next.js 15

## Test plan
- [ ] Smoke `/`, `/community`, `/hangouts`, `/nightlife`, `/forum`
- [ ] Check post and profile detail routes
EOF
)" 2>&1) && echo "PR_OK=$PR_URL" || echo "PR_FAILED=$PR_URL"
        fi
      else
        echo "PR_BLOCKED=gh CLI missing"
      fi
    else
      echo "PUSH_FAILED"
    fi
  else
    echo "PUSH_BLOCKED=no origin remote"
  fi
  echo "=== FINAL ==="
  echo "HEAD=$(git rev-parse HEAD)"
  echo "BRANCH=$(git branch --show-current)"
  git status -sb
  echo "--- remotes ---"
  git remote -v || true
} >"$OUT" 2>&1
echo DONE >>"$OUT"
