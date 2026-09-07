import { notFound } from "next/navigation";
import {
  dbGetCommunityByAuthor,
  dbGetHangoutsByHost,
  dbGetPostsByAuthor,
  dbGetProfile,
  dbGetReelsByAuthor,
  dbGetSavedPostsForUser,
  dbGetThreadsByAuthor
} from "@/lib/catalog";
import { isOfficialAiHandle } from "@/data/mock";
import { parseProfileTab, ProfileView } from "@/components/ProfileView";
import { canRequestFollow, canViewContent, resolveViewerAccess } from "@/lib/privacy";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await dbGetProfile(handle);
  const title = profile?.isOfficialAi
    ? `@${profile.handle} · Official AI`
    : `@${profile?.handle ?? handle}`;
  return { title };
}

export default async function PublicProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { handle } = await params;
  const { tab: tabRaw } = await searchParams;
  const tab = parseProfileTab(tabRaw);
  const profile = await dbGetProfile(handle);

  if (isOfficialAiHandle(handle) && !profile) {
    notFound();
  }

  if (!profile) {
    notFound();
  }

  const { isOwn, isFollower } = await resolveViewerAccess(profile.handle);
  const effectiveTab = tab === "saved" && !isOwn ? "posts" : tab;

  const postsVisible = canViewContent(profile, "posts", { isOwn, isFollower });
  const threadsVisible = canViewContent(profile, "threads", { isOwn, isFollower });
  const reelsVisible = canViewContent(profile, "reels", { isOwn, isFollower });

  const contentLockedForTab =
    (effectiveTab === "posts" && !postsVisible) ||
    (effectiveTab === "threads" && !threadsVisible) ||
    (effectiveTab === "reels" && !reelsVisible);

  const [posts, threads, reels, saved, hangouts, community] = await Promise.all([
    postsVisible ? dbGetPostsByAuthor(profile.handle) : Promise.resolve([]),
    threadsVisible ? dbGetThreadsByAuthor(profile.handle) : Promise.resolve([]),
    reelsVisible ? dbGetReelsByAuthor(profile.handle) : Promise.resolve([]),
    isOwn ? dbGetSavedPostsForUser(profile.handle) : Promise.resolve([]),
    dbGetHangoutsByHost(profile.handle),
    dbGetCommunityByAuthor(profile.handle)
  ]);

  return (
    <ProfileView
      profile={profile}
      tab={effectiveTab}
      basePath={`/u/${profile.handle}`}
      isOwn={isOwn}
      posts={posts}
      threads={threads}
      reels={reels}
      saved={saved}
      hangouts={hangouts}
      community={community}
      contentLocked={contentLockedForTab}
      followDisabled={!canRequestFollow(profile, { isOwn })}
    />
  );
}
