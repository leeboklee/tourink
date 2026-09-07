import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({ handle: z.string().min(1) });

export async function GET(req: Request) {
  const viewer = await getViewer();
  const handle = new URL(req.url).searchParams.get("handle");
  if (!viewer || !handle) return NextResponse.json({ following: false });

  const target = await prisma.user.findUnique({ where: { handle } });
  if (!target) return NextResponse.json({ following: false });

  const row = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: viewer.id, followingId: target.id } }
  });
  return NextResponse.json({ following: !!row });
}

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { handle: parsed.data.handle } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.id === viewer.id) return NextResponse.json({ error: "Cannot follow self" }, { status: 400 });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: viewer.id, followingId: target.id } }
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    await prisma.user.update({ where: { id: viewer.id }, data: { following: { decrement: 1 } } });
    await prisma.user.update({ where: { id: target.id }, data: { followers: { decrement: 1 } } });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({ data: { followerId: viewer.id, followingId: target.id } });
  await prisma.user.update({ where: { id: viewer.id }, data: { following: { increment: 1 } } });
  await prisma.user.update({ where: { id: target.id }, data: { followers: { increment: 1 } } });
  await prisma.notification.create({
    data: {
      userId: target.id,
      actorId: viewer.id,
      type: "follow",
      title: "New follower",
      body: `${viewer.handle} started following you`,
      href: `/u/${viewer.handle}`
    }
  });

  return NextResponse.json({ following: true });
}
