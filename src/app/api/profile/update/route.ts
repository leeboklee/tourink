import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";

const schema = z.object({
  name: z.string().min(1).max(80),
  bio: z.string().max(500).optional(),
  city: z.string().max(80).optional()
});

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer?.authenticated) {
    // Allow demo traveler updates in local mode
    if (!viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: viewer!.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio ?? "",
      city: parsed.data.city ?? "Seoul"
    }
  });

  return NextResponse.json({
    profile: {
      handle: user.handle,
      name: user.name,
      bio: user.bio,
      city: user.city
    }
  });
}
