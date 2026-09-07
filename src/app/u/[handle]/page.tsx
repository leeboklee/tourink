import {
  getCommunityByAuthor,
  getHangoutsByHost,
  getPostsByAuthor,
  getProfile,
  getReelsByAuthor,
  getSavedPostsForUser,
  getThreadsByAuthor,
  CURRENT_USER_HANDLE
} from "@/data/mock";
import { parseProfileTab, ProfileView } from "@/components/ProfileView";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = getProfile(handle);
  return { title: `@${profile?.handle ?? handle}` };
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
  const profile = getProfile(handle);
  const posts = getPostsByAuthor(handle);

  const p = profile ?? {
    handle,
    name: handle,
    avatar:
      posts[0]?.avatar ??
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
    bio: "Tourink traveler — profile stub for demo.",
    city: posts[0]?.location.split(",").pop()?.trim() ?? "Korea",
    followers: 120,
    following: 80,
    posts: posts.length
  };

  const isOwn = p.handle === CURRENT_USER_HANDLE;
  const effectiveTab = tab === "saved" && !isOwn ? "posts" : tab;

  return (
    <ProfileView
      profile={p}
      tab={effectiveTab}
      basePath={`/u/${p.handle}`}
      isOwn={isOwn}
      posts={posts}
      threads={getThreadsByAuthor(p.handle)}
      reels={getReelsByAuthor(p.handle)}
      saved={getSavedPostsForUser(p.handle)}
      hangouts={getHangoutsByHost(p.handle)}
      community={getCommunityByAuthor(p.handle)}
    />
  );
}
