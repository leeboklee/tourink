import { NextResponse } from "next/server";
import { dbSearch } from "@/lib/catalog";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const results = await dbSearch(q);
  return NextResponse.json(results);
}
