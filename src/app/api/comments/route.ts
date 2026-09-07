import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";
import { dbGetCommentsForPost } from "@/lib/catalog";

export async function GET(req: Request) {
  const postId = new URL(req.url).searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await dbGetCommentsForPost(postId);
  return NextResponse.json({ comments });
}

const bodySchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1).max(2000)
});

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const post = await prisma.feedPost.findUnique({ where: { id: parsed.data.postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      authorId: viewer.id,
      body: parsed.data.body,
      createdAt: "just now"
    },
    include: { author: true }
  });

  await prisma.feedPost.update({
    where: { id: post.id },
    data: { comments: { increment: 1 } }
  });

  if (post.authorId !== viewer.id) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        actorId: viewer.id,
        type: "comment",
        title: "New comment",
        body: `${viewer.handle} commented on your post`,
        href: `/post/${post.id}`
      }
    });
  }

  return NextResponse.json({
    comment: {
      id: comment.id,
      postId: comment.postId,
      author: comment.author.handle,
      avatar: comment.author.image,
      body: comment.body,
      likes: comment.likes,
      createdAt: comment.createdAt
    }
  });
}
