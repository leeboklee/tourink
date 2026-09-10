import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import {
  Clapperboard,
  Grid3X3,
  Heart,
  Bookmark,
  MessageCircle,
  MapPin,
  Pencil,
  Plus,
  UserRound,
  Users
} from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { FeedCard } from "@/components/FeedCard";
import { OfficialAiBadge } from "@/components/OfficialAiBadge";
import {
  isOfficialAiHandle,
  type CommunityPost,
  type FeedPost,
  type Meetup,
  type ReelPost,
  type ThreadPost,
  type TravelerProfile
} from "@/data/mock";

export type ProfileTab = "posts" | "threads" | "reels" | "saved" | "about";

const TABS: { id: ProfileTab; label: string; icon: typeof Grid3X3 }[] = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "threads", label: "Threads", icon: MessageCircle },
  { id: "reels", label: "Reels", icon: Clapperboard },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "about", label: "About", icon: UserRound }
];

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function ProfileView({
  profile,
  tab,
  basePath,
  isOwn,
  posts,
  threads,
  reels,
  saved,
  hangouts,
  community
}: {
  profile: TravelerProfile;
  tab: ProfileTab;
  basePath: string;
  isOwn: boolean;
  posts: FeedPost[];
  threads: ThreadPost[];
  reels: ReelPost[];
  saved: FeedPost[];
  hangouts: Meetup[];
  community: CommunityPost[];
}) {
  const hrefFor = (next: ProfileTab) =>
    next === "posts" ? basePath : `${basePath}?tab=${next}`;

  return (
    <div className="pb-8">
      <header className="px-4 pt-5 lg:px-0">
        <div className="flex items-start gap-4">
          <span
            className={
              profile.isOfficialAi
                ? "shrink-0 rounded-full bg-gradient-to-tr from-neon-cyan via-neon-cyan/50 to-neon-pink/50 p-[2px]"
                : "shrink-0 rounded-full bg-gradient-to-tr from-neon-pink via-neon-amber to-neon-cyan p-[2px]"
            }
          >
            <Image
              src={profile.avatar}
              alt={profile.handle}
              width={92}
              height={92}
              className="h-[88px] w-[88px] rounded-full border-2 border-ink-950 object-cover"
              priority
            />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl leading-none">@{profile.handle}</h1>
              {profile.isOfficialAi ? <OfficialAiBadge /> : null}
              {profile.isLocal && !profile.isOfficialAi ? (
                <span className="rounded bg-neon-amber/20 px-1.5 py-0.5 text-[10px] uppercase text-neon-amber">
                  local
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium text-white/80">{profile.name}</p>
            {profile.persona ? (
              <p className="mt-0.5 text-xs text-neon-cyan/80">{profile.persona}</p>
            ) : null}
            <div className="mt-3 flex gap-5 text-sm">
              <span>
                <strong>{posts.length}</strong>{" "}
                <span className="text-white/45">posts</span>
              </span>
              <span>
                <strong>{formatCount(profile.followers)}</strong>{" "}
                <span className="text-white/45">followers</span>
              </span>
              <span>
                <strong>{profile.following}</strong>{" "}
                <span className="text-white/45">following</span>
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/70">{profile.bio}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
          <MapPin size={12} />
          {profile.city}
          {profile.website ? (
            <>
              <span className="mx-1 text-white/20">·</span>
              <span className="text-neon-cyan">{profile.website}</span>
            </>
          ) : null}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {isOwn ? (
            <>
              <Link
                href="/profile/edit"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-paper sm:flex-none"
              >
                <Pencil size={14} />
                Edit profile
              </Link>
              <Link
                href="/compose/post"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neon-pink/40 bg-neon-pink/15 px-3 py-2 text-xs font-semibold text-neon-pink sm:flex-none"
              >
                <Plus size={14} />
                New post
              </Link>
              <Link
                href="/compose/thread"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-2 text-xs font-semibold text-neon-cyan sm:flex-none"
              >
                <MessageCircle size={14} />
                New thread
              </Link>
            </>
          ) : (
            <>
              <FollowButton handle={profile.handle} />
              <Link
                href="/hangouts"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75"
              >
                <Users size={14} />
                Hangouts
              </Link>
            </>
          )}
        </div>
      </header>

      <nav className="mt-5 flex border-b border-white/10 px-1 lg:px-0">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          const hiddenSaved = id === "saved" && !isOwn;
          if (hiddenSaved) return null;
          return (
            <Link
              key={id}
              href={hrefFor(id)}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[10px] uppercase tracking-wider transition sm:flex-row sm:justify-center sm:gap-2 sm:text-xs sm:normal-case sm:tracking-normal",
                active
                  ? "border-b-2 border-neon-cyan text-neon-cyan"
                  : "border-b-2 border-transparent text-white/45 hover:text-white/75"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4">
        {tab === "posts" ? <PostsGrid posts={posts} isOwn={isOwn} /> : null}
        {tab === "threads" ? <ThreadsTimeline threads={threads} isOwn={isOwn} /> : null}
        {tab === "reels" ? <ReelsGrid reels={reels} /> : null}
        {tab === "saved" ? <SavedFeed saved={saved} isOwn={isOwn} /> : null}
        {tab === "about" ? (
          <AboutPanel profile={profile} hangouts={hangouts} community={community} posts={posts} />
        ) : null}
      </div>
    </div>
  );
}

function PostsGrid({ posts, isOwn }: { posts: FeedPost[]; isOwn: boolean }) {
  if (!posts.length) {
    return (
      <EmptyState
        title="No posts yet"
        hint={
          isOwn
            ? "Share a travel still from Seoul, Busan, or Jeju."
            : "This traveler has not posted photos yet."
        }
        ctaHref={isOwn ? "/compose/post" : undefined}
        cta={isOwn ? "Create post" : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1 px-0.5 lg:px-0">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="relative aspect-square overflow-hidden bg-ink-800"
        >
          <Image
            src={post.image}
            alt={post.caption}
            fill
            className="object-cover transition duration-300 hover:scale-105"
            sizes="(max-width:768px) 33vw, 200px"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[10px] text-white/90 opacity-0 transition hover:opacity-100 sm:opacity-100">
            <span className="inline-flex items-center gap-1">
              <Heart size={10} />
              {formatCount(post.likes)}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function ThreadsTimeline({ threads, isOwn }: { threads: ThreadPost[]; isOwn: boolean }) {
  if (!threads.length) {
    return (
      <EmptyState
        title="No threads yet"
        hint="Start a text thread — tips, takes, and local notes."
        ctaHref={isOwn ? "/compose/thread" : undefined}
        cta={isOwn ? "New thread" : undefined}
      />
    );
  }

  return (
    <div className="space-y-0 divide-y divide-white/10 border-y border-white/10 lg:rounded-2xl lg:border lg:divide-y">
      {threads.map((t) => (
        <article key={t.id} className="px-4 py-4">
          <div className="flex gap-3">
            <Image
              src={t.avatar}
              alt={t.author}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link href={`/u/${t.author}`} className="font-semibold hover:text-neon-cyan">
                  @{t.author}
                </Link>
                {isOfficialAiHandle(t.author) ? <OfficialAiBadge compact /> : null}
                <span className="text-xs text-white/35">{t.createdAt}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{t.body}</p>
              {t.tags?.length ? (
                <p className="mt-2 text-sm text-neon-cyan/90">
                  {t.tags.map((tag) => (
                    <Link key={tag} href={`/tag/${tag}`} className="mr-2 hover:underline">
                      #{tag}
                    </Link>
                  ))}
                </p>
              ) : null}
              <div className="mt-3 flex gap-4 text-xs text-white/45">
                <span className="inline-flex items-center gap-1">
                  <Heart size={14} /> {formatCount(t.likes)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle size={14} /> {t.replies}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReelsGrid({ reels }: { reels: ReelPost[] }) {
  if (!reels.length) {
    return <EmptyState title="No reels yet" hint="Vertical travel clips will land here." />;
  }

  return (
    <div className="grid grid-cols-2 gap-1 px-1 sm:grid-cols-3 lg:px-0">
          {reels.map((reel) => (
        <Link
          key={reel.id}
          href={`/reel/${reel.id}`}
          className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-ink-800"
        >
          <Image
            src={reel.cover}
            alt={reel.caption}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 220px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/90">
            Reel
          </div>
          <div className="absolute inset-x-0 bottom-0 space-y-1 p-2.5">
            <p className="line-clamp-2 text-xs font-medium">{reel.caption}</p>
            <p className="text-[10px] text-white/55">{formatCount(reel.views)} views</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SavedFeed({ saved, isOwn }: { saved: FeedPost[]; isOwn: boolean }) {
  if (!isOwn) {
    return <EmptyState title="Saved is private" hint="Only you can see bookmarks on My Page." />;
  }
  if (!saved.length) {
    return (
      <EmptyState
        title="Nothing saved"
        hint="Bookmark feed posts to collect trip ideas."
        ctaHref="/"
        cta="Browse feed"
      />
    );
  }

  return (
    <div className="space-y-0 lg:space-y-6">
      <p className="px-4 text-xs text-white/40 lg:px-0">Only you can see what you&apos;ve saved.</p>
      {saved.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function AboutPanel({
  profile,
  hangouts,
  community,
  posts
}: {
  profile: TravelerProfile;
  hangouts: Meetup[];
  community: CommunityPost[];
  posts: FeedPost[];
}) {
  return (
    <div className="space-y-4 px-4 lg:px-0">
      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <h2 className="text-sm font-semibold text-neon-amber">Intro</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-white/45">Name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/45">Based in</dt>
            <dd>{profile.city}</dd>
          </div>
          {profile.joinedAt ? (
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Joined</dt>
              <dd>{profile.joinedAt}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-white/45">Feed posts</dt>
            <dd>{posts.length}</dd>
          </div>
          {profile.isOfficialAi ? (
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Role</dt>
              <dd className="text-neon-cyan">Official AI creator</dd>
            </div>
          ) : profile.isLocal ? (
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Role</dt>
              <dd className="text-neon-amber">Local host</dd>
            </div>
          ) : null}
          {profile.persona ? (
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Persona</dt>
              <dd className="text-right">{profile.persona}</dd>
            </div>
          ) : null}
        </dl>
        {profile.isOfficialAi ? (
          <p className="mt-3 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-xs leading-relaxed text-white/65">
            This account is operated by Tourink AI. Tips are curated for travelers — follow for feed posts,
            threads, and reels in this persona.
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-white/70">{profile.bio}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Hangouts hosted</h2>
          <Link href="/hangouts" className="text-xs text-neon-cyan hover:underline">
            All hangouts
          </Link>
        </div>
        {hangouts.length ? (
          <ul className="mt-3 space-y-3">
            {hangouts.map((m) => (
              <li key={m.id} className="rounded-xl border border-white/10 bg-ink-950/40 p-3">
                <p className="text-sm font-medium">{m.title}</p>
                <p className="mt-1 text-xs text-white/45">
                  {m.area}, {m.city} · {m.when} · {m.going}/{m.spots} going
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-white/45">No hangouts hosted yet.</p>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        {community.length ? (
          <ul className="mt-3 space-y-3">
            {community.map((c) => (
              <li key={c.id} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                <p className="text-[10px] uppercase tracking-wider text-white/35">{c.kind}</p>
                <p className="mt-1 text-sm font-medium">{c.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/55">{c.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-white/45">No community posts yet — check the feed instead.</p>
        )}
      </section>
    </div>
  );
}

function EmptyState({
  title,
  hint,
  ctaHref,
  cta
}: {
  title: string;
  hint: string;
  ctaHref?: string;
  cta?: string;
}) {
  return (
    <div className="mx-4 rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center lg:mx-0">
      <p className="font-display text-xl">{title}</p>
      <p className="mt-2 text-sm text-white/50">{hint}</p>
      {ctaHref && cta ? (
        <Link
          href={ctaHref}
          className="mt-4 inline-flex rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-xs font-semibold text-neon-cyan"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export function parseProfileTab(raw: string | string[] | undefined): ProfileTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "threads" || value === "reels" || value === "saved" || value === "about") {
    return value;
  }
  return "posts";
}
