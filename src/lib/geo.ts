/**
 * Nominatim (OpenStreetMap) — free geocoding, no API key.
 * Usage policy: identify app via User-Agent; keep request volume modest.
 * https://operations.osmfoundation.org/policies/nominatim/
 */

export type GeoPlace = {
  displayName: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
};

export async function searchPlacesNominatim(
  query: string,
  limit = 5
): Promise<GeoPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("countrycodes", "kr");
  url.searchParams.set("addressdetails", "0");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "Tourink/0.1 (https://github.com/leeboklee/tourink; travel discovery)"
    },
    next: { revalidate: 3600 }
  });

  if (!res.ok) return [];

  const rows = (await res.json()) as Array<{
    display_name?: string;
    lat?: string;
    lon?: string;
    type?: string;
    importance?: number;
  }>;

  return rows
    .filter((r) => r.display_name && r.lat && r.lon)
    .map((r) => ({
      displayName: r.display_name!,
      lat: r.lat!,
      lon: r.lon!,
      type: r.type ?? "place",
      importance: r.importance ?? 0
    }));
}
