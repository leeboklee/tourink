import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({
  caption: z.string().min(1).max(2200),
  location: z.string().min(1).max(120),
  image: z
    .string()
    .url()
    .optional()
    .default("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=1100&fit=crop"),
  tags: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const id = `p-${Date.now()}`;
  const post = await prisma.feedPost.create({
    data: {
      id,
      authorId: viewer.id,
      location: parsed.data.location,
      image: parsed.data.image,
      caption: parsed.data.caption,
      tagsJson: JSON.stringify(parsed.data.tags ?? []),
      createdAt: "just now"
    },
    include: { author: true }
  });

  await prisma.user.update({
    where: { id: viewer.id },
    data: { postsCount: { increment: 1 } }
  });

  return NextResponse.json({
    post: {
      id: post.id,
      author: post.author.handle,
      avatar: post.author.image,
      location: post.location,
      image: post.image,
      caption: post.caption,
      likes: post.likes,
      comments: post.comments,
      tags: parsed.data.tags ?? [],
      createdAt: post.createdAt
    }
  });
}
