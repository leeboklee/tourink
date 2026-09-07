export type PiiHit = {
  type: "email" | "phone" | "passport" | "rrn";
  match: string;
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE =
  /(?<!\d)(?:\+?82[-\s]?)?0?1[016789][-\s]?\d{3,4}[-\s]?\d{4}(?!\d)|(?<!\d)\+?\d{1,3}[-\s]?\(?\d{2,4}\)?[-\s]?\d{3,4}[-\s]?\d{4}(?!\d)/g;
const PASSPORT_RE = /\b[A-Z]{1,2}\d{6,9}\b/g;
const RRN_RE = /\b\d{6}[-\s]?\d{7}\b/g;

export function findPii(text: string): PiiHit[] {
  const hits: PiiHit[] = [];
  for (const m of text.match(EMAIL_RE) ?? []) hits.push({ type: "email", match: m });
  for (const m of text.match(PHONE_RE) ?? []) hits.push({ type: "phone", match: m });
  for (const m of text.match(PASSPORT_RE) ?? []) hits.push({ type: "passport", match: m });
  for (const m of text.match(RRN_RE) ?? []) hits.push({ type: "rrn", match: m });
  return hits;
}

export function redactPii(text: string): string {
  return text
    .replace(EMAIL_RE, "[email redacted]")
    .replace(PHONE_RE, "[phone redacted]")
    .replace(PASSPORT_RE, "[id redacted]")
    .replace(RRN_RE, "[id redacted]");
}
