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
import { CURRENT_USER_HANDLE, isOfficialAiHandle } from "@/data/mock";
import { parseProfileTab, ProfileView } from "@/components/ProfileView";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await dbGetProfile(handle);
  const title = profile?.isOfficialAi
    ? `@${profile.handle} · Official AI guide`
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
  const posts = await dbGetPostsByAuthor(handle);

  if (isOfficialAiHandle(handle) && !profile) {
    notFound();
  }

  const p = profile ?? {
    handle,
    name: handle,
    avatar:
      posts[0]?.avatar ??
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
    bio: "Tourink traveler.",
    city: posts[0]?.location.split(",").pop()?.trim() ?? "Korea",
    followers: 120,
    following: 80,
    posts: posts.length
  };

  const isOwn = p.handle === CURRENT_USER_HANDLE;
  const effectiveTab = tab === "saved" && !isOwn ? "posts" : tab;

  const [threads, reels, saved, hangouts, community] = await Promise.all([
    dbGetThreadsByAuthor(p.handle),
    dbGetReelsByAuthor(p.handle),
    dbGetSavedPostsForUser(p.handle),
    dbGetHangoutsByHost(p.handle),
    dbGetCommunityByAuthor(p.handle)
  ]);

  return (
    <ProfileView
      profile={p}
      tab={effectiveTab}
      basePath={`/u/${p.handle}`}
      isOwn={isOwn}
      posts={posts}
      threads={threads}
      reels={reels}
      saved={saved}
      hangouts={hangouts}
      community={community}
    />
  );
}
