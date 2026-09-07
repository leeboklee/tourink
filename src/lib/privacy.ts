import { prisma } from "@/lib/db";
import type { TravelerProfile, VisibilityAudience } from "@/data/mock";
import { getViewer } from "@/lib/viewer";

export type ContentKind = "posts" | "threads" | "reels";

export function visibilityFor(
  profile: TravelerProfile,
  kind: ContentKind
): VisibilityAudience {
  if (kind === "posts") return profile.postsVisibility ?? "everyone";
  if (kind === "threads") return profile.threadsVisibility ?? "everyone";
  return profile.reelsVisibility ?? "everyone";
}

/** Whether a viewer may see a content tab for this profile. */
export function canViewContent(
  profile: TravelerProfile,
  kind: ContentKind,
  opts: { isOwn: boolean; isFollower: boolean }
): boolean {
  if (opts.isOwn) return true;
  const audience = visibilityFor(profile, kind);
  if (audience === "off") return false;
  if (profile.privateAccount && !opts.isFollower) return false;
  if (audience === "followers") return opts.isFollower;
  return true;
}

export function canRequestFollow(
  profile: TravelerProfile,
  opts: { isOwn: boolean }
): boolean {
  if (opts.isOwn) return false;
  return (profile.whoCanFollow ?? "everyone") !== "off";
}

export async function isFollowingHandle(followerId: string, handle: string) {
  const target = await prisma.user.findUnique({ where: { handle }, select: { id: true } });
  if (!target) return false;
  const row = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId: target.id }
    }
  });
  return !!row;
}

export async function resolveViewerAccess(profileHandle: string) {
  const viewer = await getViewer();
  const isOwn = !!viewer && viewer.handle === profileHandle;
  const isFollower =
    !!viewer && !isOwn ? await isFollowingHandle(viewer.id, profileHandle) : false;
  return { viewer, isOwn, isFollower };
}
