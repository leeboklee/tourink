const DEFAULT_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.pexels.com",
  "cdn.pixabay.com",
  "i.imgur.com"
];

function configuredHosts(): string[] {
  const extra = (process.env.UPLOAD_URL_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return [...DEFAULT_HOSTS, ...extra];
}

export function isAllowedUploadUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return configuredHosts().some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function getUploadAllowlist(): string[] {
  return configuredHosts();
}
