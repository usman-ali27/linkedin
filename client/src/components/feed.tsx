import { useEffect, useRef } from "react";
import {
  type LucideProps,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
  SmilePlus,
  BriefcaseBusiness,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/use-app-store";
import {
  quickActions,
  stories,
  trendingTopics,
  suggestedPeople,
  userProfile,
} from "@/data/mock";

export type PostData = {
  id: number;
  author: string;
  role: string;
  time: string;
  audience: string;
  content: string;
  image: string;
  likesCount: number;
  comments: Array<{
    author: string;
    time: string;
    text: string;
  }>;
  tags: string[];
};

type FeedProps = {};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function Feed({}: FeedProps) {
  const user = useAppStore((state) => state.user);
  const posts = useAppStore((state) => state.posts);
  const likedPosts = useAppStore((state) => state.likedPosts);
  const commentDrafts = useAppStore((state) => state.commentDrafts);
  const postDraft = useAppStore((state) => state.postDraft);
  const isLoadingMore = useAppStore((state) => state.isLoadingMore);
  const hasMore = useAppStore((state) => state.hasMore);
  const setCommentDraft = useAppStore((state) => state.setCommentDraft);
  const setPostDraft = useAppStore((state) => state.setPostDraft);
  const loadFeedPage = useAppStore((state) => state.loadFeedPage);
  const createPost = useAppStore((state) => state.createPost);
  const toggleLike = useAppStore((state) => state.toggleLike);
  const addComment = useAppStore((state) => state.addComment);

  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);


  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const displayName = user?.fullName?.trim() || userProfile.name;
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : userProfile.role;
  const initials = getInitials(displayName);

  useEffect(() => {
    isLoadingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    if (!hasMore) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          void loadFeedPage(true).finally(() => {
            isLoadingRef.current = false;
          });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadFeedPage]);

  return (
    <>
      <aside className="space-y-6">
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-slate-950 via-slate-800 to-sky-700" />
          <CardContent className="-mt-10 p-6">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-900 text-2xl font-black text-white shadow-soft">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {displayName}
                </h2>
                <p className="text-sm text-slate-500">{roleLabel}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {userProfile.headline}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {userProfile.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-slate-50 p-3 text-center"
                >
                  <div className="text-lg font-black text-slate-950">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="text-sm font-semibold text-slate-500">
              Shortcuts
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  {action.label}
                </button>
              );
            })}
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Textarea
                value={postDraft}
                onChange={(event) => setPostDraft(event.target.value)}
                placeholder="Share a post, insight, or hiring update..."
                className="min-h-[96px] flex-1 rounded-3xl border-slate-200 bg-slate-50"
              />
            </div>

            {/* Live Media Preview Box */}
            {selectedMedia && (
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full"
                  onClick={clearSelectedMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
                {selectedMedia.type.startsWith("video/") ? (
                  <video src={selectedMedia.url} controls className="max-h-72 w-full object-contain" />
                ) : (
                  <img src={selectedMedia.url} alt="Upload Preview" className="max-h-72 w-full object-contain" />
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {(
                [
                  ["Photo", ImagePlus],
                  ["Celebrate", SmilePlus],
                  ["Open role", BriefcaseBusiness],
                ] as Array<[string, React.ComponentType<LucideProps>]>
              ).map(([label, Icon]) => (
                <Button
                  key={label}
                  variant="secondary"
                  className="rounded-full"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}

              <Button
                className="ml-auto rounded-full"
                onClick={async () => {
                  await createPost(postDraft, user);
                }}
                disabled={!postDraft.trim()}
              >
                Post now
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {stories.map((story) => (
            <Card
              key={story.title}
              className="min-w-40 shrink-0 overflow-hidden"
            >
              <div className={`h-24 bg-gradient-to-br ${story.accent}`} />
              <CardContent className="-mt-8 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-sm font-bold text-white">
                  {story.by.slice(0, 1)}
                </div>
                <div className="mt-3 text-sm font-bold text-slate-950">
                  {story.title}
                </div>
                <div className="text-xs text-slate-500">by {story.by}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.map((post) => {
          const liked = Boolean(likedPosts[post.id]);
          return (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-950">
                        {post.author}
                      </h3>
                      <Badge variant="secondary">{post.audience}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {post.role} · {post.time}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-[15px] leading-7 text-slate-700">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="accent">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div
                  className="flex h-72 items-end overflow-hidden rounded-3xl border border-white/70 p-6 text-white shadow-soft"
                  style={{ background: post.image }}
                >
                  <div className="max-w-md">
                    <div className="text-sm uppercase tracking-[0.3em] text-white/70">
                      Featured update
                    </div>
                    <div className="mt-2 text-2xl font-black">
                      Professional storyboarding meets product execution.
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{post.likesCount + (liked ? 1 : 0)} likes</span>
                  <span>{post.comments.length} comments</span>
                </div>

                <Separator className="h-px w-full" />

                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={liked ? "subtle" : "ghost"}
                    className="rounded-full"
                    onClick={() => toggleLike(post.id)}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                    />
                    Like
                  </Button>
                  <Button variant="ghost" className="rounded-full">
                    <MessageCircle className="h-4 w-4" />
                    Comment
                  </Button>
                  <Button variant="ghost" className="rounded-full">
                    <Repeat2 className="h-4 w-4" />
                    Repost
                  </Button>
                  <Button variant="ghost" className="rounded-full">
                    <Send className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="space-y-4 rounded-3xl bg-slate-50 p-4">
                  {post.comments.map((comment) => (
                    <div
                      key={`${comment.author}-${comment.time}`}
                      className="flex gap-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {comment.author.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-slate-950">
                            {comment.author}
                          </div>
                          <div className="text-xs text-slate-400">
                            {comment.time}
                          </div>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(event) =>
                          setCommentDraft(post.id, event.target.value)
                        }
                        placeholder="Write a thoughtful comment..."
                        className="min-h-[88px] rounded-2xl border-white bg-white"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button
                          onClick={() => addComment(post.id, user)}
                          disabled={!commentDrafts[post.id]?.trim()}
                          className="rounded-full"
                        >
                          Post comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}

        {hasMore && (
          <>
            <div className="flex justify-center">
              <Button
                onClick={() => void loadFeedPage(true)}
                disabled={isLoadingMore}
                className="rounded-full"
              >
                {isLoadingMore ? "Loading more..." : "Load more posts"}
              </Button>
            </div>
            <div ref={loadMoreRef} className="h-4" />
          </>
        )}
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">
                  Trending now
                </div>
                <div className="text-lg font-black text-slate-950">Topics</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.title}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-950">
                      {topic.title}
                    </div>
                    <div className="text-xs text-slate-500">{topic.posts}</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="text-sm font-semibold text-slate-500">
              People you may know
            </div>
            <div className="text-lg font-black text-slate-950">
              Suggested connections
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedPeople.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback>{person.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-950">
                      {person.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {person.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {person.mutuals}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full rounded-full">
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </>
  );
}

export { Feed };
