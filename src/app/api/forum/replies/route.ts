import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(4000)
});

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const thread = await prisma.forumThread.findUnique({ where: { id: parsed.data.threadId } });
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reply = await prisma.forumReply.create({
    data: {
      threadId: thread.id,
      authorId: viewer.id,
      body: parsed.data.body,
      createdAt: "just now"
    },
    include: { author: true }
  });

  await prisma.forumThread.update({
    where: { id: thread.id },
    data: { replies: { increment: 1 } }
  });

  return NextResponse.json({
    reply: {
      id: reply.id,
      threadId: reply.threadId,
      author: reply.author.handle,
      body: reply.body,
      likes: reply.likes,
      createdAt: reply.createdAt,
      isLocal: reply.isLocal
    }
  });
}
