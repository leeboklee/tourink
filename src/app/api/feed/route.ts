import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
import { getRankedFeed } from "@/lib/feed";
import { dbGetFeedPost } from "@/lib/catalog";
import { applySecurityHeaders } from "@/lib/security/headers";
import { redactPii } from "@/lib/security/pii";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const post = await dbGetFeedPost(id);
    if (!post) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Not found" }, { status: 404 })
      );
    }
    return applySecurityHeaders(
      NextResponse.json({
        post: { ...post, caption: redactPii(post.caption) }
      })
    );
  }

  const viewer = await getViewer();
  const posts = await getRankedFeed({
    viewerId: viewer?.id ?? null,
    limit: 50
  });

  return applySecurityHeaders(
    NextResponse.json({
      posts: posts.map((p) => ({ ...p, caption: redactPii(p.caption) })),
      ranking: "multi-signal"
    })
  );
}
