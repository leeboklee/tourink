const BLOCKED_KEY = "tourink_blocked_handles";
const FOLLOWING_KEY = "tourink_following_handles";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify([...new Set(value)]));
}

export function getBlockedHandles(): string[] {
  return readList(BLOCKED_KEY);
}

export function blockHandle(handle: string) {
  writeList(BLOCKED_KEY, [...getBlockedHandles(), handle]);
}

export function unblockHandle(handle: string) {
  writeList(
    BLOCKED_KEY,
    getBlockedHandles().filter((h) => h !== handle)
  );
}

export function getFollowingHandles(defaults: string[] = []): string[] {
  const stored = readList(FOLLOWING_KEY);
  return stored.length ? stored : defaults;
}

export function setFollowingHandle(handle: string, following: boolean, defaults: string[] = []) {
  const base = getFollowingHandles(defaults);
  writeList(
    FOLLOWING_KEY,
    following ? [...base, handle] : base.filter((h) => h !== handle)
  );
}
