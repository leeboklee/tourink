import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({ postId: z.string().min(1) });

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const post = await prisma.feedPost.findUnique({ where: { id: parsed.data.postId } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: post.id, userId: viewer.id } }
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const updated = await prisma.feedPost.update({
      where: { id: post.id },
      data: { likes: { decrement: 1 } }
    });
    return NextResponse.json({ liked: false, likes: updated.likes });
  }

  await prisma.like.create({ data: { postId: post.id, userId: viewer.id } });
  const updated = await prisma.feedPost.update({
    where: { id: post.id },
    data: { likes: { increment: 1 } }
  });

  if (post.authorId !== viewer.id) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        actorId: viewer.id,
        type: "like",
        title: "New like",
        body: `${viewer.handle} liked your post`,
        href: `/post/${post.id}`
      }
    });
  }

  return NextResponse.json({ liked: true, likes: updated.likes });
}
