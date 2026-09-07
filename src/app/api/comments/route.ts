import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireMutatingActor } from "@/lib/security/authz";
import { applySecurityHeaders } from "@/lib/security/headers";
import { moderateUserContent } from "@/lib/moderation/checks";
import { dbGetCommentsForPost } from "@/lib/catalog";

export async function GET(req: Request) {
  const postId = new URL(req.url).searchParams.get("postId");
  if (!postId) {
    return applySecurityHeaders(
      NextResponse.json({ error: "postId required" }, { status: 400 })
    );
  }
  const comments = await dbGetCommentsForPost(postId);
  return applySecurityHeaders(NextResponse.json({ comments }));
}

const bodySchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1).max(2000)
});

export async function POST(req: Request) {
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    );
  }

  const post = await prisma.feedPost.findUnique({ where: { id: parsed.data.postId } });
  if (!post || !post.active) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Post not found" }, { status: 404 })
    );
  }

  const verdict = await moderateUserContent({
    userId: viewer.id,
    kind: "comment",
    text: parsed.data.body,
    rejectPii: true
  });

  if (!verdict.ok) {
    return applySecurityHeaders(
      NextResponse.json(
        { error: verdict.error, reasons: verdict.reasons },
        { status: verdict.status }
      )
    );
  }

  const comment = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      authorId: viewer.id,
      body: verdict.displayText,
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

  return applySecurityHeaders(
    NextResponse.json({
      comment: {
        id: comment.id,
        postId: comment.postId,
        author: comment.author.handle,
        avatar: comment.author.image,
        body: comment.body,
        likes: comment.likes,
        createdAt: comment.createdAt
      }
    })
  );
}
