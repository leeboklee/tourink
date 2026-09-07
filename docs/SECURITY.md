# Security & PII

Tourink hardens mutating APIs, sanitizes user text, redacts common PII, allowlists upload hosts, and ships baseline security headers.

## Threats addressed

| Topic | Approach | Code |
|---|---|---|
| XSS | Strip tags / script on write; React text escaping on display | `src/lib/security/sanitize.ts` |
| CSRF | Auth.js cookies + SameSite; mutating APIs require session/demo actor | NextAuth + `requireMutatingActor` |
| Rate limits | Sliding window per user/action | `src/lib/moderation/rate-limit.ts` |
| Authz | Staff gate for admin; mutating actor for writes | `src/lib/security/authz.ts`, `src/lib/staff.ts` |
| PII leakage | Detect phone/email/passport/RRN; reject on write, redact on display | `src/lib/security/pii.ts` |
| Malicious uploads | HTTPS + host allowlist for image URLs | `src/lib/security/upload-allowlist.ts` |
| Clickjacking / MIME sniff | `X-Frame-Options`, `X-Content-Type-Options`, etc. | `src/middleware.ts`, `next.config.js`, `src/lib/security/headers.ts` |

## Auth notes

- `requireAuthUser()` — real session only
- `requireMutatingActor()` — session, else demo traveler **unless** `ALLOW_DEMO_MUTATIONS=false`
- Production: set `ALLOW_DEMO_MUTATIONS=false` so compose/comment/report/block require sign-in
- Admin routes always require `ADMIN` / `STAFF`

## PII patterns

- Email
- KR / intl phone numbers
- Passport-like `A1234567`
- Korean RRN-like `YYMMDD-*******`

Posts with PII are **rejected on write**. Display paths also call `redactPii` as defense in depth.

## Upload allowlist

Default hosts: Unsplash, Pexels, Pixabay, Imgur. Extend via `UPLOAD_URL_ALLOWLIST=cdn.example.com,media.example.com`.

## Headers

Applied globally via middleware + `next.config.js` `headers()`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

API JSON responses also get CSP-ish headers via `applySecurityHeaders`.

## References

- OWASP — [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- OWASP — [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- Next.js — [Security headers](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- Auth.js — [Security](https://authjs.dev/reference/security)
- Mozilla Observatory — [HTTP Observatory](https://observatory.mozilla.org/)
- NIST — [PII guidance (SP 800-122)](https://csrc.nist.gov/publications/detail/sp/800-122/final)

## Related

- Moderation: `docs/MODERATION.md`
- Feed ranking: `docs/FEED_ALGORITHM.md`
