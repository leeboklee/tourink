import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireMutatingActor } from "@/lib/security/authz";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/moderation/rate-limit";
import { sanitizeUserText } from "@/lib/security/sanitize";

const schema = z.object({
  targetType: z.enum(["post", "comment", "user", "thread"]),
  targetId: z.string().min(1),
  reason: z.enum([
    "spam",
    "abuse",
    "harassment",
    "hate",
    "sexual",
    "scam",
    "pii",
    "other"
  ]),
  details: z.string().max(1000).optional()
});

export async function POST(req: Request) {
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }

  const rl = checkRateLimit(
    `report:${viewer.id}`,
    RATE_LIMITS.report.limit,
    RATE_LIMITS.report.windowMs
  );
  if (!rl.allowed) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Too many reports. Try later." }, { status: 429 })
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    );
  }

  let targetUserId: string | null = null;
  let postId: string | null = null;

  if (parsed.data.targetType === "post") {
    const post = await prisma.feedPost.findUnique({ where: { id: parsed.data.targetId } });
    if (!post) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Post not found" }, { status: 404 })
      );
    }
    targetUserId = post.authorId;
    postId = post.id;
  } else if (parsed.data.targetType === "comment") {
    const comment = await prisma.comment.findUnique({ where: { id: parsed.data.targetId } });
    if (!comment) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Comment not found" }, { status: 404 })
      );
    }
    targetUserId = comment.authorId;
    postId = comment.postId;
  } else if (parsed.data.targetType === "user") {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: parsed.data.targetId }, { handle: parsed.data.targetId }]
      }
    });
    if (!user) {
      return applySecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 404 })
      );
    }
    targetUserId = user.id;
  } else if (parsed.data.targetType === "thread") {
    const thread = await prisma.threadPost.findUnique({ where: { id: parsed.data.targetId } });
    if (!thread) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Thread not found" }, { status: 404 })
      );
    }
    targetUserId = thread.authorId;
  }

  if (targetUserId === viewer.id) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Cannot report yourself" }, { status: 400 })
    );
  }

  const report = await prisma.contentReport.create({
    data: {
      reporterId: viewer.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      targetUserId,
      postId,
      reason: parsed.data.reason,
      details: sanitizeUserText(parsed.data.details ?? "", 1000),
      status: "open"
    }
  });

  if (postId && (parsed.data.reason === "spam" || parsed.data.reason === "scam")) {
    const openSpam = await prisma.contentReport.count({
      where: {
        postId,
        status: "open",
        reason: { in: ["spam", "scam"] }
      }
    });
    if (openSpam >= 2) {
      await prisma.feedPost.update({
        where: { id: postId },
        data: { shadowHidden: true, spamScore: { increment: 0.2 } }
      });
    }
  }

  return applySecurityHeaders(
    NextResponse.json({ ok: true, reportId: report.id })
  );
}

export async function GET() {
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }
  const mine = await prisma.contentReport.findMany({
    where: { reporterId: viewer.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  return applySecurityHeaders(NextResponse.json({ reports: mine }));
}
