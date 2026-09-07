import { NextResponse } from "next/server";
import { dbListFeedPosts, dbGetFeedPost } from "@/lib/catalog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const post = await dbGetFeedPost(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  }
  const posts = await dbListFeedPosts();
  return NextResponse.json({ posts });
}
