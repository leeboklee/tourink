import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({ meetupId: z.string().min(1) });

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const meetup = await prisma.meetup.findUnique({ where: { id: parsed.data.meetupId } });
  if (!meetup) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.rsvp.findUnique({
    where: { meetupId_userId: { meetupId: meetup.id, userId: viewer.id } }
  });

  if (existing) {
    await prisma.rsvp.delete({ where: { id: existing.id } });
    const updated = await prisma.meetup.update({
      where: { id: meetup.id },
      data: { going: { decrement: 1 } }
    });
    return NextResponse.json({ going: false, count: updated.going });
  }

  if (meetup.going >= meetup.spots) {
    return NextResponse.json({ error: "Full" }, { status: 409 });
  }

  await prisma.rsvp.create({ data: { meetupId: meetup.id, userId: viewer.id } });
  const updated = await prisma.meetup.update({
    where: { id: meetup.id },
    data: { going: { increment: 1 } }
  });

  if (meetup.hostId !== viewer.id) {
    await prisma.notification.create({
      data: {
        userId: meetup.hostId,
        actorId: viewer.id,
        type: "rsvp",
        title: "New RSVP",
        body: `${viewer.handle} is going to ${meetup.title}`,
        href: "/hangouts"
      }
    });
  }

  return NextResponse.json({ going: true, count: updated.going });
}
