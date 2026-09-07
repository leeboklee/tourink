import { redirect } from "next/navigation";
import {
  dbGetCommunityByAuthor,
  dbGetHangoutsByHost,
  dbGetPostsByAuthor,
  dbGetProfile,
  dbGetReelsByAuthor,
  dbGetSavedPostsForUser,
  dbGetThreadsByAuthor
} from "@/lib/catalog";
import { auth } from "@/lib/auth";
import { CURRENT_USER_HANDLE } from "@/data/mock";
import { parseProfileTab, ProfileView } from "@/components/ProfileView";
import Link from "next/link";

export const metadata = { title: "My Page" };

export default async function MyProfilePage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const handle = session?.user?.handle || CURRENT_USER_HANDLE;
  const profile = await dbGetProfile(handle);
  if (!profile) {
    redirect(`/u/${CURRENT_USER_HANDLE}`);
  }

  const { tab: tabRaw } = await searchParams;
  const tab = parseProfileTab(tabRaw);

  const [posts, threads, reels, saved, hangouts, community] = await Promise.all([
    dbGetPostsByAuthor(handle),
    dbGetThreadsByAuthor(handle),
    dbGetReelsByAuthor(handle),
    dbGetSavedPostsForUser(handle),
    dbGetHangoutsByHost(handle),
    dbGetCommunityByAuthor(handle)
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 pt-2 lg:px-0">
        {session?.user ? (
          <p className="text-xs text-white/45">
            Signed in as <span className="text-neon-cyan">@{session.user.handle}</span>
          </p>
        ) : (
          <p className="text-xs text-white/45">
            Demo session ·{" "}
            <Link href="/auth/signin" className="text-neon-cyan hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
      <ProfileView
        profile={profile}
        tab={tab}
        basePath="/profile"
        isOwn
        posts={posts}
        threads={threads}
        reels={reels}
        saved={saved}
        hangouts={hangouts}
        community={community}
      />
    </div>
  );
}
