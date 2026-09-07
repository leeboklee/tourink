import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireMutatingActor } from "@/lib/security/authz";
import { applySecurityHeaders } from "@/lib/security/headers";
import { moderateUserContent } from "@/lib/moderation/checks";

const schema = z.object({
  body: z.string().min(1).max(4000),
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
    kind: "thread",
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

  const id = `t-${Date.now()}`;
  const thread = await prisma.threadPost.create({
    data: {
      id,
      authorId: viewer.id,
      body: verdict.displayText,
      tagsJson: JSON.stringify(parsed.data.tags ?? []),
      createdAt: "just now",
      active: !verdict.shadowHidden
    }
  });

  return applySecurityHeaders(
    NextResponse.json({ thread: { id: thread.id, body: thread.body } })
  );
}
