import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireMutatingActor } from "@/lib/security/authz";
import { applySecurityHeaders } from "@/lib/security/headers";
import { moderateUserContent } from "@/lib/moderation/checks";
import { sanitizeUserText } from "@/lib/security/sanitize";

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
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    );
  }

  const verdict = await moderateUserContent({
    userId: viewer.id,
    kind: "post",
    text: parsed.data.caption,
    imageUrl: parsed.data.image,
    rejectPii: true
  });

  if (!verdict.ok) {
    return applySecurityHeaders(
      NextResponse.json(
        { error: verdict.error, reasons: verdict.reasons, spamScore: verdict.spamScore },
        { status: verdict.status }
      )
    );
  }

  const location = sanitizeUserText(parsed.data.location, 120);
  const tags = (parsed.data.tags ?? []).map((t) => sanitizeUserText(t, 40)).filter(Boolean);

  const id = `p-${Date.now()}`;
  const post = await prisma.feedPost.create({
    data: {
      id,
      authorId: viewer.id,
      location,
      image: parsed.data.image,
      caption: verdict.displayText,
      tagsJson: JSON.stringify(tags),
      createdAt: "just now",
      publishedAt: new Date(),
      spamScore: verdict.spamScore,
      shadowHidden: verdict.shadowHidden,
      active: true
    },
    include: { author: true }
  });

  await prisma.user.update({
    where: { id: viewer.id },
    data: { postsCount: { increment: 1 } }
  });

  return applySecurityHeaders(
    NextResponse.json({
      post: {
        id: post.id,
        author: post.author.handle,
        avatar: post.author.image,
        location: post.location,
        image: post.image,
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        tags,
        createdAt: post.createdAt,
        shadowHidden: post.shadowHidden
      }
    })
  );
}
