import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/staff";

const schema = z.object({
  kind: z.enum(["feed", "thread", "reel"]),
  id: z.string().min(1),
  active: z.boolean()
});

/** Staff toggle: show / hide Official AI feed posts, threads, or reels. */
export async function PATCH(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { kind, id, active } = parsed.data;

  try {
    if (kind === "feed") {
      const item = await prisma.feedPost.update({ where: { id }, data: { active } });
      return NextResponse.json({ ok: true, kind, item });
    }
    if (kind === "thread") {
      const item = await prisma.threadPost.update({ where: { id }, data: { active } });
      return NextResponse.json({ ok: true, kind, item });
    }
    const item = await prisma.reelPost.update({ where: { id }, data: { active } });
    return NextResponse.json({ ok: true, kind, item });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
