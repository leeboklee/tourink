import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getViewer } from "@/lib/viewer";
import { mapProfile } from "@/lib/catalog";

const audience = z.enum(["everyone", "followers", "off"]);

const schema = z.object({
  name: z.string().min(1).max(80).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().max(80).optional(),
  image: z.union([z.string().url().max(500), z.literal("")]).optional(),
  website: z.string().max(200).optional(),
  persona: z.string().max(120).optional(),
  work: z.string().max(120).optional(),
  homeTown: z.string().max(120).optional(),
  joinedAt: z.string().max(40).optional(),
  privateAccount: z.boolean().optional(),
  postsVisibility: audience.optional(),
  threadsVisibility: audience.optional(),
  reelsVisibility: audience.optional(),
  whoCanMessage: audience.optional(),
  whoCanFollow: audience.optional(),
  instagramUrl: z.string().max(300).optional(),
  facebookUrl: z.string().max(300).optional(),
  threadsUrl: z.string().max(300).optional(),
  tiktokUrl: z.string().max(300).optional(),
  youtubeUrl: z.string().max(300).optional(),
  notifyLikes: z.boolean().optional(),
  notifyComments: z.boolean().optional(),
  notifyFollows: z.boolean().optional(),
  notifyMessages: z.boolean().optional()
});

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const data: Record<string, unknown> = {};

  if (d.name !== undefined) data.name = d.name;
  if (d.bio !== undefined) data.bio = d.bio;
  if (d.city !== undefined) data.city = d.city;
  if (d.image !== undefined) data.image = d.image || null;
  if (d.website !== undefined) data.website = d.website || null;
  if (d.persona !== undefined) data.persona = d.persona || null;
  if (d.work !== undefined) data.work = d.work || null;
  if (d.homeTown !== undefined) data.homeTown = d.homeTown || null;
  if (d.joinedAt !== undefined) data.joinedAt = d.joinedAt || null;
  if (d.privateAccount !== undefined) data.privateAccount = d.privateAccount;
  if (d.postsVisibility !== undefined) data.postsVisibility = d.postsVisibility;
  if (d.threadsVisibility !== undefined) data.threadsVisibility = d.threadsVisibility;
  if (d.reelsVisibility !== undefined) data.reelsVisibility = d.reelsVisibility;
  if (d.whoCanMessage !== undefined) data.whoCanMessage = d.whoCanMessage;
  if (d.whoCanFollow !== undefined) data.whoCanFollow = d.whoCanFollow;
  if (d.instagramUrl !== undefined) data.instagramUrl = d.instagramUrl || null;
  if (d.facebookUrl !== undefined) data.facebookUrl = d.facebookUrl || null;
  if (d.threadsUrl !== undefined) data.threadsUrl = d.threadsUrl || null;
  if (d.tiktokUrl !== undefined) data.tiktokUrl = d.tiktokUrl || null;
  if (d.youtubeUrl !== undefined) data.youtubeUrl = d.youtubeUrl || null;
  if (d.notifyLikes !== undefined) data.notifyLikes = d.notifyLikes;
  if (d.notifyComments !== undefined) data.notifyComments = d.notifyComments;
  if (d.notifyFollows !== undefined) data.notifyFollows = d.notifyFollows;
  if (d.notifyMessages !== undefined) data.notifyMessages = d.notifyMessages;

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: viewer.id },
    data
  });

  return NextResponse.json({ profile: mapProfile(user) });
}
