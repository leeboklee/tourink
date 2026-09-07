import { NextResponse } from "next/server";
import { dbSearch } from "@/lib/catalog";
import { searchPlacesNominatim } from "@/lib/geo";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const results = await dbSearch(q);

  let geo: Awaited<ReturnType<typeof searchPlacesNominatim>> = [];
  try {
    geo = await searchPlacesNominatim(q, 4);
  } catch {
    geo = [];
  }

  return NextResponse.json({
    ...results,
    geo: geo.map((g) => ({
      displayName: g.displayName,
      lat: g.lat,
      lon: g.lon,
      type: g.type
    }))
  });
}
