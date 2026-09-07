import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ notifications: [], unread: 0 });

  const notifications = await prisma.notification.findMany({
    where: { userId: viewer.id },
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 40
  });

  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      href: n.href,
      read: n.read,
      createdAt: n.createdAt,
      actor: n.actor
        ? { handle: n.actor.handle, name: n.actor.name, image: n.actor.image }
        : null
    })),
    unread
  });
}

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (body?.all) {
    await prisma.notification.updateMany({
      where: { userId: viewer.id, read: false },
      data: { read: true }
    });
    return NextResponse.json({ ok: true });
  }

  if (body?.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: viewer.id },
      data: { read: true }
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "id or all required" }, { status: 400 });
}
