import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
import { prisma } from "@/lib/db";
import { mapProfile } from "@/lib/catalog";

/** Full settings payload for the logged-in (or demo) viewer. */
export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "No viewer" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: viewer.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    profile: mapProfile(user),
    authenticated: viewer.authenticated
  });
}
