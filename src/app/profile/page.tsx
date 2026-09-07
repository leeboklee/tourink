import { redirect } from "next/navigation";
import {
  CURRENT_USER_HANDLE,
  getCommunityByAuthor,
  getCurrentProfile,
  getHangoutsByHost,
  getPostsByAuthor,
  getReelsByAuthor,
  getSavedPostsForUser,
  getThreadsByAuthor
} from "@/data/mock";
import { parseProfileTab, ProfileView } from "@/components/ProfileView";

export const metadata = { title: "My Page" };

export default async function MyProfilePage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const profile = getCurrentProfile();
  if (!profile) {
    redirect(`/u/${CURRENT_USER_HANDLE}`);
  }

  const { tab: tabRaw } = await searchParams;
  const tab = parseProfileTab(tabRaw);
  const handle = profile.handle;

  return (
    <ProfileView
      profile={profile}
      tab={tab}
      basePath="/profile"
      isOwn
      posts={getPostsByAuthor(handle)}
      threads={getThreadsByAuthor(handle)}
      reels={getReelsByAuthor(handle)}
      saved={getSavedPostsForUser(handle)}
      hangouts={getHangoutsByHost(handle)}
      community={getCommunityByAuthor(handle)}
    />
  );
}
