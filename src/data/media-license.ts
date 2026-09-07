/**
 * Licensed media helpers for Tourink content.
 * See CONTENT_LICENSE.md and .cursor/rules/content-license.mdc.
 */

export type MediaLicenseKind =
  | "unsplash"
  | "pexels"
  | "cc0"
  | "dicebear-cc0"
  | "owned"
  | "unknown";

export type LicensedMedia = {
  url: string;
  license: MediaLicenseKind;
  /** Human-readable credit, e.g. "Photo by X on Unsplash" or "DiceBear bottts-neutral · CC0". */
  attribution: string;
  sourceUrl?: string;
};

/** Known Unsplash photo IDs → photographer credit (best-effort; always Unsplash License). */
const UNSPLASH_PHOTOGRAPHERS: Record<string, string> = {
  "photo-1507525428034-b723cf961d3e": "Sean Oulashin",
  "photo-1464822759023-fed622ff2c3b": "Kalen Emsley",
  "photo-1500530855697-b586d89ba3ee": "Luke Stackpoole",
  "photo-1555939594-58d7cb561ad1": "Chad Montano",
  "photo-1554118811-1e0d58224f24": "Toa Heftiba",
  "photo-1493976040374-85c8e12f0c0e": "Su San Lee",
  "photo-1540959733332-eab4deabeeaf": "Jezael Melgoza",
  "photo-1517154428103-8fe2e841f3c0": "Tijs van Leur",
  "photo-1514933651103-005eec06c04b": "Pawel Nolbert",
  "photo-1535189043414-47a3c49a0bed": "Jezael Melgoza",
  "photo-1578662996442-48f60103fc96": "Willian Justen de Vasconcellos",
  "photo-1590301157890-4810ed352733": "Louis Hansel",
  "photo-1551632811-561732d1e306": "Toa Heftiba",
  "photo-1548115184-85cac22f4d35": "Jezael Melgoza",
  "photo-1472099645785-5658abf4ff4e": "Joseph Gonzalez",
  "photo-1494790108377-be9c29b29330": "Michael Dam",
  "photo-1438761681033-6461ffad8d80": "Christopher Campbell",
  "photo-1544005313-94ddf0286df2": "Jessica Felicio",
  "photo-1506794778202-cad84cf45f1d": "Albert Desta",
  "photo-1534528741775-53994a69daeb": "Aiony Haust",
  "photo-1507003211169-0a1dd7228f2d": "Joseph Gonzalez",
  "photo-1500648767791-00dcc994a43e": "Joseph Gonzalez",
  "photo-1535713875002-d1d0cf377fde": "Charles Deluvio",
  "photo-1527980965255-d3b416303d12": "Erik Lucatero",
  "photo-1487412720507-e7ab37603c6f": "Aiony Haust",
  "photo-1463453091185-61582044d556": "Ayo Ogunseinde",
  "photo-1544725176-7c40e5a71c5e": "Jake Nackos"
};

export function extractUnsplashPhotoId(url: string): string | null {
  const m = url.match(/photo-[a-zA-Z0-9-]+/);
  return m ? m[0] : null;
}

/** DiceBear PNG avatar — CC0, no photo likeness rights. */
export function dicebearAvatar(seed: string, style = "bottts-neutral"): LicensedMedia {
  const url = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=128`;
  return {
    url,
    license: "dicebear-cc0",
    attribution: `DiceBear ${style} · CC0 1.0`,
    sourceUrl: "https://www.dicebear.com"
  };
}

export function unsplashMedia(
  photoId: string,
  opts?: { w?: number; h?: number; fit?: string; photographer?: string }
): LicensedMedia {
  const w = opts?.w ?? 900;
  const h = opts?.h ?? 1100;
  const fit = opts?.fit ?? "crop";
  const photographer = opts?.photographer ?? UNSPLASH_PHOTOGRAPHERS[photoId];
  const url = `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=${fit}`;
  return {
    url,
    license: "unsplash",
    attribution: photographer
      ? `Photo by ${photographer} on Unsplash`
      : `Photo on Unsplash (${photoId})`,
    sourceUrl: `https://unsplash.com/photos/${photoId.replace(/^photo-/, "")}`
  };
}

/** Infer license metadata from an existing URL (seed / CMS helpers). */
export function licenseFromUrl(url: string): Pick<LicensedMedia, "license" | "attribution" | "sourceUrl"> {
  if (!url) {
    return { license: "unknown", attribution: "Missing media URL" };
  }
  if (url.includes("api.dicebear.com") || url.includes("dicebear.com")) {
    const style = url.match(/\/([a-z0-9-]+)\/(?:svg|png|jpg)/i)?.[1] ?? "avatar";
    return {
      license: "dicebear-cc0",
      attribution: `DiceBear ${style} · CC0 1.0`,
      sourceUrl: "https://www.dicebear.com"
    };
  }
  if (url.includes("images.unsplash.com") || url.includes("unsplash.com")) {
    const id = extractUnsplashPhotoId(url);
    const photographer = id ? UNSPLASH_PHOTOGRAPHERS[id] : undefined;
    return {
      license: "unsplash",
      attribution: photographer
        ? `Photo by ${photographer} on Unsplash`
        : id
          ? `Photo on Unsplash (${id})`
          : "Photo on Unsplash",
      sourceUrl: id
        ? `https://unsplash.com/photos/${id.replace(/^photo-/, "")}`
        : "https://unsplash.com"
    };
  }
  if (url.includes("images.pexels.com") || url.includes("pexels.com")) {
    return {
      license: "pexels",
      attribution: "Photo on Pexels",
      sourceUrl: "https://www.pexels.com"
    };
  }
  return {
    license: "unknown",
    attribution: "Unknown source — replace before shipping (see CONTENT_LICENSE.md)"
  };
}

export function isSafeMediaLicense(license: MediaLicenseKind | string | null | undefined): boolean {
  return (
    license === "unsplash" ||
    license === "pexels" ||
    license === "cc0" ||
    license === "dicebear-cc0" ||
    license === "owned"
  );
}
