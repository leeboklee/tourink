import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireMutatingActor } from "@/lib/security/authz";
import { applySecurityHeaders } from "@/lib/security/headers";

const schema = z.object({
  handle: z.string().min(1).max(64).optional(),
  userId: z.string().min(1).optional()
});

async function resolveTarget(data: z.infer<typeof schema>) {
  if (data.userId) {
    return prisma.user.findUnique({ where: { id: data.userId } });
  }
  if (data.handle) {
    const handle = data.handle.replace(/^@/, "").toLowerCase();
    return prisma.user.findUnique({ where: { handle } });
  }
  return null;
}

export async function GET() {
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }
  const blocks = await prisma.userBlock.findMany({
    where: { blockerId: viewer.id },
    include: { blocked: { select: { id: true, handle: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" }
  });
  return applySecurityHeaders(
    NextResponse.json({
      blocks: blocks.map((b) => ({
        id: b.id,
        user: b.blocked,
        createdAt: b.createdAt
      }))
    })
  );
}

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

  const target = await resolveTarget(parsed.data);
  if (!target) {
    return applySecurityHeaders(
      NextResponse.json({ error: "User not found" }, { status: 404 })
    );
  }
  if (target.id === viewer.id) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Cannot block yourself" }, { status: 400 })
    );
  }

  const block = await prisma.userBlock.upsert({
    where: {
      blockerId_blockedId: { blockerId: viewer.id, blockedId: target.id }
    },
    create: { blockerId: viewer.id, blockedId: target.id },
    update: {}
  });

  return applySecurityHeaders(
    NextResponse.json({ ok: true, blockId: block.id, handle: target.handle })
  );
}

export async function DELETE(req: Request) {
  const viewer = await requireMutatingActor();
  if (!viewer) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Sign in required" }, { status: 401 })
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    );
  }

  const target = await resolveTarget(parsed.data);
  if (!target) {
    return applySecurityHeaders(
      NextResponse.json({ error: "User not found" }, { status: 404 })
    );
  }

  await prisma.userBlock.deleteMany({
    where: { blockerId: viewer.id, blockedId: target.id }
  });

  return applySecurityHeaders(NextResponse.json({ ok: true }));
}
