const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function stripHtmlTags(input: string): string {
  return input
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/<[^>]+>/g, "");
}

export function sanitizeUserText(input: string, maxLen = 4000): string {
  let out = String(input ?? "");
  out = stripHtmlTags(out);
  out = out.replace(CONTROL_CHARS, "");
  out = out.replace(/javascript\s*:/gi, "");
  out = out.replace(/on\w+\s*=/gi, "");
  out = out.trim();
  if (out.length > maxLen) out = out.slice(0, maxLen);
  return out;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
