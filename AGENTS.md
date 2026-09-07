# Tourink

## Canonical path (필수)

- **정본:** `\\wsl.localhost\Ubuntu-D\home\bok\projects\tourink`
- **WSL:** `/home/bok/projects/tourink`
- **repo:** `https://github.com/leeboklee/tourink.git`
- **금지:** `C:\Users\hapsl\projects\tourink` — stale Windows duplicate (삭제하지 말 것; 새 작업 금지)

에이전트는 WSL 경로만 사용한다.

## Cursor Cloud remote detection

Cloud agents require **exactly one** git remote on the workspace root that Cursor opens.

- WSL 정본에는 `origin` 1개만 있음 (`git remote -v` → github.com/leeboklee/tourink.git).
- Windows/`C:\home\...` 미러나 multi-root로 열면 `.git`이 안 보이거나 remote=0으로 감지되어 Cloud가 실패한다.
- **Fix:** Cursor에서 workspace를 WSL 정본 하나만 연다 (`\\wsl.localhost\Ubuntu-D\home\bok\projects\tourink`). 추가 root/폴더 붙이지 말 것.
