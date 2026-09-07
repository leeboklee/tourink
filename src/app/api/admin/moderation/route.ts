import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/staff";
import { applySecurityHeaders } from "@/lib/security/headers";

export async function GET() {
  const staff = await requireStaff();
  if (!staff) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
  }

  const reports = await prisma.contentReport.findMany({
    where: { status: "open" },
    include: {
      reporter: { select: { handle: true, name: true } },
      targetUser: { select: { handle: true, name: true, id: true } },
      post: { select: { id: true, caption: true, active: true, shadowHidden: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return applySecurityHeaders(NextResponse.json({ reports }));
}

const actionSchema = z.object({
  reportId: z.string().min(1),
  action: z.enum(["dismiss", "hide_post", "remove_post", "shadow_hide"])
});

export async function POST(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
  }

  const parsed = actionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    );
  }

  const report = await prisma.contentReport.findUnique({
    where: { id: parsed.data.reportId }
  });
  if (!report) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Report not found" }, { status: 404 })
    );
  }

  if (parsed.data.action === "dismiss") {
    await prisma.contentReport.update({
      where: { id: report.id },
      data: { status: "dismissed", reviewedAt: new Date() }
    });
    return applySecurityHeaders(NextResponse.json({ ok: true }));
  }

  if (report.postId) {
    if (parsed.data.action === "shadow_hide" || parsed.data.action === "hide_post") {
      await prisma.feedPost.update({
        where: { id: report.postId },
        data: { shadowHidden: true }
      });
    }
    if (parsed.data.action === "remove_post") {
      await prisma.feedPost.update({
        where: { id: report.postId },
        data: { active: false, shadowHidden: true }
      });
    }
  }

  await prisma.contentReport.update({
    where: { id: report.id },
    data: { status: "actioned", reviewedAt: new Date() }
  });

  return applySecurityHeaders(NextResponse.json({ ok: true }));
}
