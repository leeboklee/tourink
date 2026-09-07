import { NextResponse } from "next/server";
import { dbGetProfile, dbGetPostsByAuthor, dbGetOfficialAiProfiles } from "@/lib/catalog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("officialAi") === "1") {
    const profiles = await dbGetOfficialAiProfiles();
    return NextResponse.json({ profiles });
  }

  const handle = searchParams.get("handle");
  if (!handle) return NextResponse.json({ error: "handle required" }, { status: 400 });

  const profile = await dbGetProfile(handle);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const posts = await dbGetPostsByAuthor(handle);
  return NextResponse.json({ profile, posts });
}
