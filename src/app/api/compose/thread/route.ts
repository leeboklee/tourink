import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({
  body: z.string().min(1).max(4000),
  tags: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const id = `t-${Date.now()}`;
  const thread = await prisma.threadPost.create({
    data: {
      id,
      authorId: viewer.id,
      body: parsed.data.body,
      tagsJson: JSON.stringify(parsed.data.tags ?? []),
      createdAt: "just now"
    }
  });

  return NextResponse.json({ thread: { id: thread.id, body: thread.body } });
}
